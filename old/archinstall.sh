#!/usr/bin/env -S bash -e

while true; do
  read -r -p "Select keyboard layout (enter nothing for US, / to see available layouts): " keyboard_layout

  case "$keyboard_layout" in
  '')
    keyboard_layout="us"
    echo "US keyboard layout will be used."
    break
    ;;
  '/')
    localectl list-keymaps
    clear
    ;;
  *)
    if localectl list-keymaps | grep -Fxq "$keyboard_layout"; then
      echo "Keyboard layout will be changed to $keyboard_layout."
      loadkeys "$keyboard_layout"
      break
    else
      echo "Keyboard layout does not exist."
    fi
    ;;
  esac
done

echo "Available Devices:"
PS3="Select number of the corresponding device: "
select POSSIBLE_DEVICE in $(lsblk -dpnoNAME | grep -P "/dev/sd|nvme|vd"); do
  SELECTED_DEVICE="$POSSIBLE_DEVICE"
  echo -e "Arch will be installed on $SELECTED_DEVICE"
  break
done

while true; do
  read -r -s -p "Enter password for the LUKS encrypted device: " luks_password
  echo
  if [[ -z "$luks_password" ]]; then
    echo "Please enter a password for the LUKS encrypted device."
    continue
  fi

  read -r -s -p "Confirm your password: " luks_password_confirm
  echo

  if [[ "$luks_password" == "$luks_password_confirm" ]]; then
    break
  else
    echo "Passwords do not match, please try again."
  fi
done

while true; do
  read -r -p "Select locale (enter nothing for en_GB, / to see available layouts): " locale

  case "$locale" in
  '')
    locale="en_GB.UTF-8"
    echo "$locale was chosen."
    break
    ;;
  '/')
    sed -E '/^#  |^#$/d;s/^#| *$//g;s/ .*/ (Charset:&)/' /etc/locale.gen | less -M
    clear
    ;;
  *)
    if grep -q "^#?$(sed 's/[].*[]/\\&/g' <<<"$locale") " /etc/locale.gen; then
      break
    else
      echo "Locale does not exist."
    fi
    ;;
  esac
done

while true; do
  read -r -p "Enter hostname: " hostname
  if [[ -n "$hostname" ]]; then
    break
  else
    echo "Please enter a hostname."
  fi
done

while true; do
  read -r -p "Enter username for user account (enter nothing if you don't want user to be created): " username
  if [[ -z "$username" ]]; then
    echo "No user will be created."
    break
  fi

  read -r -s -p "Enter a password for $username: " user_password
  echo
  if [[ -z "$user_password" ]]; then
    echo "Please enter a password for $username."
    continue
  fi

  read -r -s -p "Confirm password: " user_password_confirm
  echo

  if [[ "$user_password" == "$user_password_confirm" ]]; then
    echo "User $username created."
    break
  else
    echo "Passwords do not match. Try again."
  fi
done

while true; do
  read -r -s -p "Enter password for root user: " root_password
  echo
  if [[ -z "$root_password" ]]; then
    echo "You need to enter a password for root user."
    continue
  fi

  read -r -s -p "Please enter the password again: " root_password_confirm
  echo

  if [[ "$root_password" == "$root_password_confirm" ]]; then
    echo "Root password set successfully."
    break
  else
    echo "Passwords don't match, please try again."
  fi
done

echo -ne "Are you sure you want to wipe $SELECTED_DEVICE [y/N]?: "
read -r wipe_device_response
if ! [[ "${wipe_device_response,,}" =~ ^(yes|y)$ ]]; then
  echo -e "Exiting."
  exit
fi
echo -e "Wiping $SELECTED_DEVICE."
wipefs -af "$SELECTED_DEVICE" &>/dev/null
sgdisk -Zo "$SELECTED_DEVICE" &>/dev/null

echo -e "Creating partition table on $SELECTED_DEVICE."
parted -s "$SELECTED_DEVICE"
mklabel gpt
mkpart ESP fat32 1MiB 1025MiB
set 1 esp on
mkpart CRYPTROOT 1025MiB 100%

CRYPT_ROOT="/dev/disk/by-partlabel/CRYPTROOT"
EFI_ESP="/dev/disk/by-partlabel/ESP"

echo -e "Letting the kernel know about the disk changes..."
partprobe "$SELECTED_DEVICE"

echo -e "Filesystem on EFI partition will be FAT32."
mkfs.fat -F 32 "$EFI_ESP" &>/dev/null

echo -e "Creating LUKS root."
echo -n "$luks_password" | cryptsetup luksFormat "$CRYPT_ROOT" -d - &>/dev/null
echo -n "$luks_password" | cryptsetup open "$CRYPT_ROOT" cryptroot -d -
BTRFS="/dev/mapper/cryptroot"

# Formatting the LUKS Container as BTRFS.
echo -e "Filesystem on LUKS container will be BTRFS."
mkfs.btrfs "$BTRFS" &>/dev/null
mount "$BTRFS" /mnt

echo -e "Creating subvolumes for BTRFS..."
subvolumes=(snapshots var_pkgs var_log home root srv)
for subvolume in '' "${subvolumes[@]}"; do
  btrfs su cr /mnt/@"$subvolume" &>/dev/null
done

umount /mnt
echo -e "Mounting BTRFS subvolumes..."
mount_options="ssd,noatime,compress-force=zstd:3,discard=async"
mount -o "$mount_options",subvol=@ "$BTRFS" /mnt
mkdir -p /mnt/{home,root,srv,.snapshots,var/{log,cache/pacman/pkg},boot}
for subvolume in "${subvolumes[@]:2}"; do
  mount -o "$mount_options",subvol=@"$subvolume" "$BTRFS" /mnt/"${subvolume//_//}"
done
chmod 750 /mnt/root
mount -o "$mount_options",subvol=@snapshots "$BTRFS" /mnt/.snapshots
mount -o "$mount_options",subvol=@var_pkgs "$BTRFS" /mnt/var/cache/pacman/pkg
chattr C /mnt/var/log
mount "$EFI_ESP" /mnt/boot/

CPU_VENDOR=$(grep vendor_id /proc/cpuinfo)
if [[ "$CPU_VENDOR" == *"AuthenticAMD"* ]]; then
  echo -e "AMD microcode will be installed."
  microcode="amd-ucode"
else
  echo -e "Intel microcode will be installed."
  microcode="intel-ucode"
fi

echo -e "Installing the base system..."
pacstrap -K /mnt base linux "$microcode" linux-firmware linux-headers btrfs-progs zsh rsync efibootmgr snapper reflector snap-pac zram-generator sudo &>/dev/null

echo -e "Writing the hostname..."
echo "$hostname" >/mnt/etc/hostname

echo -e "Generating FSTab..."
genfstab -U /mnt >>/mnt/etc/fstab

echo -e "Configuring selected locale and console keymap..."
sed -i "/^#$locale/s/^#//" /mnt/etc/locale.gen
echo "LANG=$locale" >/mnt/etc/locale.conf
echo "KEYMAP=$keyboard_layout" >/mnt/etc/vconsole.conf

echo -e "Creating hosts file..."
cat >/mnt/etc/hosts <<EOF
127.0.0.1   localhost
::1         localhost
127.0.1.1   $hostname.localdomain   $hostname
EOF

hypervisor=$(systemd-detect-virt)
case $hypervisor in
oracle)
  echo -e "Detected VirtualBox, setting up guest tools..."
  pacstrap /mnt virtualbox-guest-utils &>/dev/null
  systemctl enable vboxservice --root=/mnt &>/dev/null
  ;;
vmware)
  echo -e "Detected VMWare, setting up guest tools..."
  pacstrap /mnt open-vm-tools >/dev/null
  systemctl enable vmtoolsd --root=/mnt &>/dev/null
  systemctl enable vmware-vmblock-fuse --root=/mnt &>/dev/null
  ;;
kvm)
  echo -e "Detected KVM, setting up guest tools..."
  pacstrap /mnt qemu-guest-agent &>/dev/null
  systemctl enable qemu-guest-agent --root=/mnt &>/dev/null
  ;;
microsoft)
  echo -e "Detected Hyper-V, setting up guest tools..."
  pacstrap /mnt hyperv &>/dev/null
  systemctl enable hv_fcopy_daemon --root=/mnt &>/dev/null
  systemctl enable hv_kvp_daemon --root=/mnt &>/dev/null
  systemctl enable hv_vss_daemon --root=/mnt &>/dev/null
  ;;
esac

echo -e "Setting up NetworkManager..."
pacstrap /mnt networkmanager >/dev/null
systemctl enable NetworkManager --root=/mnt &>/dev/null

echo -e "Configuring /etc/mkinitcpio.conf..."
cat >/mnt/etc/mkinitcpio.conf <<EOF
HOOKS=(systemd autodetect keyboard sd-vconsole modconf block sd-encrypt filesystems)
EOF

echo -e "Setting up your system..."
arch-chroot /mnt /bin/bash -e <<EOF

    # Set up timezone.
    ln -sf /usr/share/zoneinfo/$(curl -s http://ip-api.com/line?fields=timezone) /etc/localtime &>/dev/null

    # Synchronize clock.
    hwclock --systohc

    # Generate locales.
    locale-gen &>/dev/null

    # SecureBoot keys. mkinitcpio will fail without it
    sbctl create-keys

    # Generating initramfs
    mkinitcpio -P &>/dev/null

    # Snapper.
    umount /.snapshots
    rm -r /.snapshots
    snapper --no-dbus -c root create-config /
    btrfs subvolume delete /.snapshots &>/dev/null
    mkdir /.snapshots
    mount -a &>/dev/null
    chmod 750 /.snapshots

EOF

echo -e "Root password is being set."
echo "root:$root_password" | arch-chroot /mnt chpasswd

if [[ -n "$username" ]]; then
  echo "%wheel ALL=(ALL:ALL) ALL" >/mnt/etc/sudoers.d/wheel
  echo -e "Gave $username root priviliges."
  arch-chroot /mnt useradd -m -k /var/empty -G wheel -s /bin/zsh "$username"
  echo -e "Setting user password for $username."
  echo "$username:$user_password" | arch-chroot /mnt chpasswd
fi

echo -e "Setting up backups for /boot..."
mkdir /mnt/etc/pacman.d/hooks
cat >/mnt/etc/pacman.d/hooks/50-bootbackup.hook <<EOF
[Trigger]
Operation = Upgrade
Operation = Install
Operation = Remove
Type = Path
Target = usr/lib/modules/*/vmlinuz

[Action]
Depends = rsync
Description = Backing up /boot...
When = PostTransaction
Exec = /usr/bin/rsync -a --delete /boot /.bootbackup
EOF

echo -e "Setting up ZRAM..."
cat >/mnt/etc/systemd/zram-generator.conf <<EOF
[zram0]
zram-size = min(ram, 8192)
EOF

echo -e "Gave pacman superpowers: colurs, animations and parallel downloads!"
sed -Ei 's/^#(Color)$/1nILoveCandy/;s/^#(ParallelDownloads).*/1 = 10/' /mnt/etc/pacman.conf

echo -e "Enabled services: Reflector, automatic snapshots, BTRFS scrubbing, systemd-oomd."
services=(reflector.timer snapper-timeline.timer snapper-cleanup.timer btrfs-scrub@-.timer btrfs-scrub@home.timer btrfs-scrub@var-log.timer btrfs-scrub@\x2esnapshots.timer systemd-oomd)
for service in "${services[@]}"; do
  systemctl enable "$service" --root=/mnt &>/dev/null
done

echo -e "Done. You may reboot now."
exit
