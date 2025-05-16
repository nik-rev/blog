---
title: I switched to NixOS from Arch Linux and I'm never going back
---

10 months ago I tried Linux for the first time. First it was Ubuntu, then I switched to Debian, then Arch Linux.

I tested them all for a few months and was mostly happy with my Arch Linux for about half a year. But then I tried NixOS...

<!--more-->

## First Encounter with NixOS

NixOS was frequently talked about and I was curious to learn about it. I heard that it is an operating system where the config is declarative instead of imperative.

So for example, instead of saying "I want to install firefox on my computer: `apt get firefox`", instead we say "My computer has firefox" then specify `firefox` as one of the _dependencies_ of my system.

That was about it, in terms of how much I knew. I wanted to found out what NixOS is like so I installed it on my computer.

For about a whole day I was transferring my [dotfiles configuration](https://github.com/nik-rev/dotfiles) to NixOS. First I started doing it the basic way, with configuration.nix and zero flakes.

### Flakes

After a few days I was really done tinkering with my setup and things worked fine now. I was happy with my `configuration.nix`. It worked quite well. However, people were suggesting me to try out "flakes".

I didn't want to use flakes because I didn't see a point, I just saw it as extra added complexity. Additionally they are an experimental feature, so what happens if the flakes get deprecated after I spend time transferring all of my configs?

### A Comparison to Arch Linux

My laptop had arch on it, and after an update broke my system I decided to also install NixOS on that. Once I already knew a couple of concepts about Nix, the installation was extremely simple and fast. Took about 2 minutes of action, and 10-20 minutes of waiting for programs to install.

But after I've installed the system, it is _identical_ to the one I have on my computer. No longer do I have to worry about synchronising my laptop and computer -- a single `sudo nixos-rebuild switch` gets the job done. It's just beautiful! I finally "get" NixOS and why it's so loved.

## Switching to Helix Editor

During the setup, I decided to ditch my bloated Neovim configuration which I've kept adding on and on to and it was becoming hard to maintain, with breaking changes in my plugins at least once a week ([more on that in another post](/post/switched-to-helix)).

I wanted something that has everything built-in, is lightweight, fast, and made with Rust, so I am motivated to dig into the codebase and contribute to it :P.

Helix is awesome at what it does, and I was mostly happy with it.

### Hard Times

But I was about to switch back to Neovim, because the only thing Helix is missing is a way to properly navigate files. However, while looking at the pull requests for Helix I noticed that it has a [pull request](https://github.com/helix-editor/helix/pull/11285) which adds a basic file navigator that really covers all my needs -- viewing file names in the same directory as the current buffer, and opening new files.

I was excited. I cloned, checked out and built it. But it was painful. Helix binary wasn't aware of the runtime directory that it usually knows about, which contains tools for syntax highlighting (tree-sitter) and it didn't recognize my configuration either.

There were a few other pull requests I really wanted to use: one pull request that added `.editorconfig` support for example, as well as many others. But it started taking up a long time having to manually build my Helix fork every time I wanted to add a new pull request.

### Discovering the Power of Flakes

Then I saw that they have a `flake.nix` file, so I researched flakes. I previously didn't want to use flakes because I didn't see the point, I have all my packages from nixpkgs. Why should I use them?

But, as it turns out -- flakes make the process I described above _comically easy_. I converted my setup to flakes, and then I pointed one of the inputs at my helix fork, that had additional pull requests merged into it:

<!-- TODO: add styles for code blocks with titles -->

```nix {title="flake.nix"}
helix.url = "github:NikitaRevenco/helix/master";
```

```nix {title="home.nix"}
programs.helix.package =
  inputs.helix.packages.${pkgs.system}.helix;
```

And it built from `master`. It built my fork and I could use the features I really wanted without much hassle. I was astonished, because I could see the potential that this can have!

I don't know if I can use any other distro now. Once you try NixOS you _can't_ go back...
