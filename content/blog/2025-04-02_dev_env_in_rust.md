---
title: My development environment is fully written in Rust! 7 Alternatives written in Rust I'm excited to share
---

Since I started learning Rust 5 months ago, I have since replaced my full development environment with software written in Rust.

## But why?!

Well, I _like_ Rust and I also _love_ contributing to open source.

I contribute features I would use myself, and I like to contributes to projects that I believe in.

Not only does it keep me motivated to work on them, but also it's very fun to use something I made myself. So using software written in Rust enables me to enjoy using tools that I understand and develop.

I also like to understand how the software I use actually works. IDEs, shells, terminal emulators. What actually happens _under the hood_? Rust makes it **fun** for me to just dig into the codebase and read to my heart's desire.

## Neovim → Helix (IDE)

Helix is just ready to go out of the box. Everything is setup, it doesn't support plugins yet but they're not needed for me (probably because I have freedom to modify any part of Helix anyways).

Helix has custom keybindings and allows running TUIs inside of it like a git UI or a file manager which is extremely powerful.

## Kitty → Rio (Terminal Emulator)

The other two Rust terminals I've used is Alacritty and WezTerm.

I _loved_ Alacritty for its performance, and I using WezTerm was pure joy, for how many features it has. Alacritty is quite conservative on features so they don't support stuff like ligatures or tabs which is a deal-breaker for me.

Rio is basically a blend of these 2 terminals, Rio uses the high-performance crates developed by Alacritty while having all the features I needed from WezTerm

## Lazygit → GitUI

While [GitUI](https://github.com/gitui-org/gitui) has less features than [Lazygit](https://github.com/jesseduffield/lazygit), I still find it plenty for my use cases.

GitUI uses [gitoxide](https://github.com/GitoxideLabs/gitoxide) under the hood where possible for its operations.

gitoxide is a Rust implementation of Git that's making very good progress, and is a project I am really excited about plus believe is criminally underrated. Gitoxide is powering projects like Helix for git hunks and (hopefully soon!) [inline blame](https://github.com/helix-editor/helix/pull/13133).

I do find GitUI snappier than Lazygit is, in fact I experienced about 3X performance increase when undoing changes for 1,200 files so I'd say it is very promising and looking forward to seeing where it can be improved to have more a feature parity with Lazygit!

## zsh → nushell

[Nushell](https://github.com/nushell/nushell) is _very_ different from zsh, bash, fish and similar shells. Every command is colored and syntax highlighting comes out of the box. Traditional shells output text, whilst in nushell commands output **structured data** like tables and arrays, on which you can use high-level commands like `filter`, `map`, `first`, `reverse` etc. to operate on them.

It comes with a swiss-army knife of utility commands that fit into Nushell's model. Utilities for parsing text into structured data, as well as operating on them. The `nu` language is the most beautiful scripting language I have come across. It's like the Rust of scripting languages, in a sense.

I'd say this shell is much easier to learn and is a lot more intuitive than any other shell. Also being cross-platform is a huge bonus. Nushell to Zsh is strikingly similar to what Helix is to Neovim.

## lf → yazi (file manager)

I don't really use file managers much aside from occasionally viewing images with them, as that is very handy. However, with Helix there is a direct integration available for yazi that lets you use it like a plugin. It integrates so well and is really seamless, not requiring tmux or zellij or whatever. this made me use yazi far, far more now. I like how fast yazi is.

## tmux → zellij (terminal multiplexer)

I don't use terminal multiplexers often, but I appreciate that zellij has more intuitive keybindings and is easier to customize, also feels a lot snappier than tmux

## sway → niri (tiling window manager + wayland compositor)

I'd like to give niri a mention too. I haven't tried it as it simply doesn't work with my Nvidia 4070 GPU unfortunately but I do hope support improves for it. I've been really wanting to switch to a tiling window manager + wayland compositor but there aren't really many options in this field. Niri is also doing things the "new way" like Helix and Nushell are. I'm super happy to see these software not afraid of experimentation, this is exactly how things get better!

---

Some honorary mentions:

- grep → ripgrep
- find → fd
- latex → typst

Some things I hope to replace in my lifetime with pure Rust alternatives would be:

- Operating System (Linux) → e.g. RedoxOS
- Browser (Firefox) → e.g. Servo
- Image Editor (Gimp and Inkscape) → e.g. Graphite.rs
- Media Player (mpv), Video Editor (kdenlive), Recording Software (obs studio) → ??? rewriting FFMPEG in Rust is left as an exercise to the reader :)

## References

- [Neovim](https://github.com/neovim/neovim) → [Helix](https://github.com/helix-editor/helix)
- [Kitty](https://sw.kovidgoyal.net/kitty/) → [Rio](https://github.com/raphamorim/rio)
- [Lazygit](https://github.com/jesseduffield/lazygit) → [GitUI](https://github.com/extrawurst/gitui)
- [zsh](https://www.zsh.org/) → [nushell](https://github.com/nushell/nushell)
- [lf](https://github.com/gokcehan/lf) → [yazi](https://github.com/sxyazi/yazi)
- [tmux](https://github.com/tmux/tmux) → [zellij](https://github.com/zellij-org/zellij)
- [sway](https://github.com/swaywm/sway) → [niri](https://github.com/YaLTeR/niri)
- [grep](https://www.gnu.org/software/grep/) → [ripgrep](https://github.com/BurntSushi/ripgrep)
- [find](https://www.gnu.org/software/findutils/) → [fd](https://github.com/sharkdp/fd)
- [LaTeX](https://www.latex-project.org/) → [typst](https://github.com/typst/typst)
- [Linux](https://www.kernel.org/) → [RedoxOS](https://github.com/redox-os/redox)
- [Firefox](https://www.mozilla.org/firefox/) → [Servo](https://github.com/servo/servo)
- [GIMP](https://www.gimp.org/) and [Inkscape](https://inkscape.org/) → [Graphite.rs](https://github.com/GraphiteEditor/Graphite)

[I use these tools in my dotfiles](https://github.com/nik-rev/dotfiles).
