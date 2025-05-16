---
title: I switched from Zsh to Nushell. It's a beautiful shell, I'm never going back!
readTime: true
---

I switched from zsh to nushell. It is so good _wow_, I've been using it for a couple months as an interactive shell but recently just started writing scripts with it. I'm wondering why I didn't do it sooner!

1. No need to memorize flags for commands anymore. I dont need a `--reverse` for every command. Instead, if I want to reverse something I just pipe my data with `| reverse`. Instead of memorizing N flags for M commands, memorize N commands and compose with any command. Elegant.
1. Every nushell command reads like plain english. Sometimes I forget I'm even talking to a computer. "What's the largest file in the current directory?" = `ls | sort-by size | reverse | first` = List all files, sort them by size from largest to smallest, then take the first file.
1. No more `sed` and `awk`. Nushell's string manipulation is a pleasure to work with. The `str` command can even convert text between snake_case, PascalCase, camelCase etc.
1. Data manipulation on steroids. It works on so many file formats, with dozens of utility functions to get output of data.
1. Each function does one thing and does it well. Wait, isn't this Unix's philosophy? Yes, Nushell feels like what we should have had from the beginning. It feels a lot "more UNIX" than bash or zsh
1. it ships with its own tools. no need to worry about stuff like `curl` not being available. you always have `http get` if you can execute the script
1. Performance. It feels a lot snappier than zsh.
1. The scripting language is just expressive, beautiful and so much easier to read and write than bash is.
1. It's cross platform!! Huge deal for people who need to use their shell on Windows.
1. Beautiful help pages. Everything is colored with usage examples for each command.

More people should be using nushell! In my opinion it is really underrated and I encourage you to give it a go
