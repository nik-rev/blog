---
title: How I install Arch Linux with full disk encryption
readTime: true
---

I've grown to love Arch Linux due to its simplicity and ease of use. However installing it can be a bit of a process, especially if you want to do it with full disk encryption.

In this post I show you the steps I follow to install it with encryption.

<!--more-->

## Installation

Go to [arch linux downloads](https://archlinux.org/download/) and head over to the `geo.mirror.pkgbuild.com` link under the "Worldwide" HTTP direct downloads.

Install the following files from there:

- `archlinux-####.##.##-x86_64.iso`
- `archlinux-####.##.##-x86_64.iso.sig`

It is important to verify the signature of the file, to ensure that is has not been tampered with:

```bash
pacman-key -v arch.iso.sig
```

Flash the `.iso` into a device, for instance `/dev/sdc`:

```bash
sudo cp arch.iso /dev/sdc
```

Boot the live environment.

[Connect to the internet.](https://wiki.archlinux.org/title/Installation_guide#Connect_to_the_internet)

Setup the disk:

```bash
sgdisk -Z -n1:0:+1024M -t1:ef00 -c1:efi -n2:0:+4096M -t2:ef02 -c2:boot -N3 -t3:8309 -c3:root /dev/sda
```

Load the encryption modules:

```bash
modprobe dm-crypt && modprobe dm-mod
```

Set up the encryption and then open it:

```bash
cryptsetup luksFormat -s 512 -h sha512 /dev/sda3
cryptsetup open /dev/sda3 luks_lvm
```

Create the volume and volume group:

```bash
pvcreate /dev/mapper/luks_lvm
vgcreate arch /dev/mapper/luks_lvm
```

Create a volume for your swap space. A good size for this is your RAM size (find out with `free -h`) + 2GB.

```bash
lvcreate -n swap -L 18G arch
```

Use entire disk space for your root volume:

```bash
lvcreate -n root -l +100%FREE arch
```

Create filesystems:

```bash
mkfs.fat -F32 /dev/sda1
mkfs.ext4 /dev/sda2
mkfs.btrfs -L root /dev/mapper/arch-root
```

Setup swap device:

```bash
mkswap /dev/mapper/arch-swap
swapon /dev/mapper/arch-swap
swapon -a
```

Mount Root, Boot and EFI:

```bash
mkdir -p /mnt/boot /mnt/boot/efi
mount /dev/mapper/arch-root /mnt
mount /dev/sda2 /mnt/boot
mount /dev/sda1 /mnt/boot/efi
```

Install Arch:

```bash
pacstrap -K /mnt base sof-firmware base-devel linux linux-firmware neovim btrfs-progs lvm2 grub efibootmgr zsh
```

Load the file table and chroot.

```bash
genfstab -U -p /mnt > /mnt/etc/fstab
arch-chroot /mnt /bin/bash
```

Add encryption hooks:

```bash
sudo sed -i '/^HOOKS=.*block/s/block /block encrypt lvm2 /' /etc/mkinitcpio.conf
```

Setup grub on efi partition:

```bash
grub-install --efi-directory=/boot/efi
```

Add cryptdevice to linux commandline arguments:

```bash
sed -i '/^GRUB_CMDLINE_LINUX_DEFAULT=/ s/"$/ root=\/dev\/mapper\/arch-root cryptdevice=UUID='$(blkid -s UUID -o value /dev/sda3)':luks_lvm"/' /etc/default/grub
```

```bash
mkdir /secure
dd if=/dev/random of=/secure/root_keyfile.bin bs=512 count=8
```

Change permissions on the secure files:

```bash
chmod 000 /secure/*
chmod 600 /boot/initramfs*
```

Add to partitions:

```bash
cryptsetup luksAddKey /dev/sda3 /secure/root_keyfile.bin
```

Recognize root keyfile:

```bash
sed -i 's/FILES=()/FILES=(\/secure\/root_keyfile.bin)/' your_file
```

Reload Linux:

```bash
mkinitcpio -p linux
```

Create grub config:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
grub-mkconfig -o /boot/efi/EFI/arch/grub.cfg
```

Create a symlink for the timezone:

```bash
ln -sf /usr/share/zoneinfo/Europe/London /etc/localtime
```

Set up [NTP](https://wiki.archlinux.org/title/Network_Time_Protocol_daemon):

```bash
echo "[Time]\nNTP=0.arch.pool.ntp.org 1.arch.pool.ntp.org 2.arch.pool.ntp.org 3.arch.pool.ntp.org\nFallbackNTP=0.pool.ntp.org 1.pool.ntp.org" > /etc/systemd/timesyncd.conf
```

Enable timesyncd:

```bash
systemctl enable systemd-timesyncd.service
```

Configure network manager, in order to use wifi:

```bash
pacman -S networkmanager
systemctl enable NetworkManager.service
```

Set up your locale:

```bash
sed -i -e "/^#"en_GB.UTF-8"/s/^#//" /mnt/etc/locale.gen
echo "KEYMAP=us" > /etc/vconsole.conf
echo "LANG=en_GB.UTF-8" > /etc/locale.conf
locale-gen
```

Add your hostname:

```bash
echo "arch" > /etc/hostname
```

Secure the root user by setting a password:

```bash
passwd
```

Add your user, for me it is `e` because it's 1 character and fast to type:

```bash
useradd -m -k /var/empty -G wheel -s /bin/zsh e
passwd e
```

Add the wheel group to sudoers, to be able to execute commands as root with `sudo`:

```bash
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/wheel
```

Install amd or intel microcode depending on which processor you use (`lscpu`):

```sh
pacman -S amd-ucode # or intel-ucode
```

```bash
exit
umount -R /mnt
reboot
```

Put UEFI Secure Boot into "Setup Mode":

```bash
sudo sbctl create-keys
sudo sbctl enroll-keys -m
```

And with that, we're done! We just installed Arch with full disk encryption. Now you can officially say "_I use arch BTW_" :)
