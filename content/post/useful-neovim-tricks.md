---
title: Neovim tips and life hacks that significantly improved my productivity
date: 2024-09-11
readTime: true
---

I've been using Neovim for quite some time and have went through the entire Wiki. I would like to share some of my most loved tricks that have really skyrocketed my productivity.

<!--more-->

## Basic Navigation

- `h`, `l` ~ Move left, right by one character
- `j`, `k` ~ Move down, up by one line
- `+`, `-` ~ Move to the next/previous non-whitespace character on the line
- `^` ~ Move to the first non-whitespace character
- `_` ~ Move to the first character on the line (also takes a count)
- `$` ~ Move to the last character on the line
- `G` ~ Move to the end of the file
- `gg` ~ Move to the beginning of the file
- `40gg` ~ Jump to line 40
- `%` ~ Jump to matching parenthesis or bracket
- `t{char}` ~ Jump before the next occurrence of `{char}`
- `f{char}` ~ Jump to the next occurrence of `{char}`
- `T{char}` / `F{char}` ~ Reverse of `t` and `f`
- `,` and `;` ~ Repeat `t`, `T`, `f`, `F` in opposite/same direction

## Searching

- `/pattern` ~ Search forward
- `?pattern` ~ Search backward
- `#` and `*` ~ Search for the identifier under the cursor (backward/forward)
- `/pattern/e` ~ Place cursor on last character of pattern
- `/pattern/e+1` ~ Place cursor one character to the right of match
- `/apple\C` ~ Case-sensitive search
- `:%s/pattern//n` ~ Count occurrences of pattern
- `/\%V` ~ Search inside visual selection

## Editing

- `i`, `I` ~ Insert at cursor / start of line
- `a`, `A` ~ Append after cursor / end of line
- `gi` ~ Insert at last edit position
- `o`, `O` ~ Open new line below / above and enter insert mode
- `r{char}` ~ Replace character under cursor
- `J` ~ Join line with next one
- `gJ` ~ Join lines without inserting space
- `xp` ~ Swap two characters
- `D`, `Y`, `C` ~ Instead of `d$`, `y$`, `c$`
- `gq` ~ Wrap long lines

## Case Modification

- `guu` / `gUU` / `g~~` ~ Make current line lowercase, uppercase, or toggle case
- `gu`, `gU`, `g~` ~ Operator to change case

## Copying & Deleting

- `yy` / `dd` ~ Yank/Delete entire line
- `yib` ~ Yank inside `()`
- `d/hello` ~ Delete until "hello"
- `d/hello/e` ~ Delete up to and including "hello"
- `dk` / `dj` ~ Delete current and previous/next line
- `gp` / `gP` ~ Paste like `p` / `P` but leave cursor after pasted text

## Visual Mode Tricks

- `CTRL v` ~ Visual block mode
- `<` / `>` ~ Dedent/Indent selected text
- `I` in visual block ~ Insert text at the beginning of each line
- `$A` in visual block ~ Append text at the end of each line
- `o` ~ Jump to the other end of the selection
- `gv` ~ Reselect last visual selection
- `g CTRL v` ~ Increment each line numerically (e.g., `0 0 0 0` ~ `1 2 3 4`)

## Window Management

- `CTRL wx` ~ Swap windows
- `CTRL wv` ~ Split vertically
- `CTRL ws` ~ Split horizontally
- `CTRL wq` ~ Quit window
- `CTRL w=` ~ Equalize window sizes

## Useful Operators & Motions

- `vap` ~ Select around paragraph
- `[{`, `]{`, `[(`, `](` ~ Move to last/next unmatched `{`, `(`
- `g;` ~ Jump to previous insert location
- `g,` ~ Jump to next insert location
- `''` ~ Jump to before last jump

## Command-line Mode Tricks

- `CTRL r+` ~ Paste from system clipboard
- `CTRL u` ~ Delete all characters
- `CTRL g` / `CTRL t` ~ Next/previous match in search results
- `:%norm` ~ Apply a command to every line (`:%norm $ciwhello`)
- `:g/^#/d` ~ Delete all comments from a Bash file
- `:g/foo/s/bar/baz/g` ~ Replace "bar" with "baz" in lines containing "foo"
- `g&` ~ Repeat last substitution

## Clipboard & Registers

- `gx` ~ Open link under cursor
- `gf` ~ Open file under cursor
- If `unnamedplus` is set, copying with system clipboard (`CTRL c`) won’t overwrite Vim’s yank buffer.

## Miscellaneous

- `CTRL g` ~ Show filename and line count
- `zz`, `zt`, `zb` ~ Center cursor on screen (middle, top, bottom)
- `:center` ~ Center text
- `ga` ~ Show character info under cursor
- `g?` ~ ROT13 encode input
- `CTRL a` / `CTRL x` ~ Increment/decrement number under cursor
- `:sort u` ~ Sort lines uniquely
- `:sort n` ~ Sort numerically
- `<C-f>` ~ Edit Ex command in a full-page view
- `_` instead of `^` ~ `_` moves to the first character on a line but also accepts a motion
