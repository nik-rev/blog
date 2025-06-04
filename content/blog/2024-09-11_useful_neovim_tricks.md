---
title: Neovim tips and life hacks that significantly improved my productivity
---

I've been using Neovim for a couple months now and by now have went through the entire Wiki.

I would like to share some of my most loved tricks that have really skyrocketed my productivity.

<!--more-->

## Basic Navigation

| Command     | Description                                        |
|------------|----------------------------------------------------|
| `h`        | Move left by one character                         |
| `l`        | Move right by one character                        |
| `j`        | Move down by one line                              |
| `k`        | Move up by one line                                |
| `+`        | Move to the next non-whitespace character on line  |
| `-`        | Move to the previous non-whitespace character      |
| `^`        | Move to the first non-whitespace character         |
| `_`        | Move to the first character on the line (takes count) |
| `$`        | Move to the last character on the line             |
| `G`        | Move to the end of the file                        |
| `gg`       | Move to the beginning of the file                  |
| `40gg`     | Jump to line 40                                    |
| `%`        | Jump to matching parenthesis or bracket            |
| `t{char}`  | Jump before the next occurrence of `{char}`        |
| `f{char}`  | Jump to the next occurrence of `{char}`            |
| `T{char}`  | Jump before the previous occurrence of `{char}`    |
| `F{char}`  | Jump to the previous occurrence of `{char}`        |
| `,`        | Repeat `t`, `T`, `f`, `F` in opposite direction     |
| `;`        | Repeat `t`, `T`, `f`, `F` in same direction         |

## Searching

| Command         | Description                                            |
|----------------|--------------------------------------------------------|
| `/pattern`      | Search forward                                        |
| `?pattern`      | Search backward                                       |
| `#`             | Search backward for identifier under cursor           |
| `*`             | Search forward for identifier under cursor            |
| `/pattern/e`    | Place cursor on last character of match               |
| `/pattern/e+1`  | Place cursor one character to the right of match      |
| `/apple\C`      | Case-sensitive search                                 |
| `:%s/pattern//n`| Count occurrences of pattern                          |
| `/\%V`          | Search inside visual selection                        |

## Editing

| Command     | Description                                      |
|-------------|--------------------------------------------------|
| `i`         | Insert at cursor                                 |
| `I`         | Insert at start of line                          |
| `a`         | Append after cursor                              |
| `A`         | Append at end of line                            |
| `gi`        | Insert at last edit position                     |
| `o`         | Open new line below and enter insert mode        |
| `O`         | Open new line above and enter insert mode        |
| `r{char}`   | Replace character under cursor                   |
| `J`         | Join line with next one                          |
| `gJ`        | Join lines without inserting space               |
| `xp`        | Swap two characters                              |
| `D`         | Delete to end of line                            |
| `Y`         | Yank to end of line                              |
| `C`         | Change to end of line                            |
| `gq`        | Wrap long lines                                  |

## Case Modification

| Command      | Description                                  |
|--------------|----------------------------------------------|
| `guu`        | Make current line lowercase                  |
| `gUU`        | Make current line uppercase                  |
| `g~~`        | Toggle case of current line                  |
| `gu`         | Operator to make text lowercase              |
| `gU`         | Operator to make text uppercase              |
| `g~`         | Operator to toggle case                      |

## Copying & Deleting

| Command     | Description                                  |
|-------------|----------------------------------------------|
| `yy`        | Yank entire line                             |
| `dd`        | Delete entire line                           |
| `yib`       | Yank inside `()`                             |
| `d/hello`   | Delete until "hello"                         |
| `d/hello/e` | Delete up to and including "hello"           |
| `dk`        | Delete current and previous line             |
| `dj`        | Delete current and next line                 |
| `gp`        | Paste like `p` but leave cursor after        |
| `gP`        | Paste like `P` but leave cursor after        |

## Visual Mode Tricks

| Command       | Description                                        |
|---------------|----------------------------------------------------|
| `CTRL v`      | Visual block mode                                 |
| `<`           | Dedent selected text                              |
| `>`           | Indent selected text                              |
| `I`           | Insert text at beginning of each line (block mode)|
| `$A`          | Append text at end of each line (block mode)      |
| `o`           | Jump to the other end of the selection            |
| `gv`          | Reselect last visual selection                    |
| `g CTRL v`    | Increment each line numerically                   |

## Window Management

| Command      | Description                     |
|--------------|---------------------------------|
| `CTRL wx`    | Swap windows                    |
| `CTRL wv`    | Split window vertically         |
| `CTRL ws`    | Split window horizontally       |
| `CTRL wq`    | Quit window                     |
| `CTRL w=`    | Equalize window sizes           |

## Useful Operators & Motions

| Command     | Description                                      |
|-------------|--------------------------------------------------|
| `vap`       | Select around paragraph                         |
| `[{`        | Move to previous unmatched `{`                  |
| `]{`        | Move to next unmatched `{`                      |
| `[( `       | Move to previous unmatched `(`                  |
| `](`        | Move to next unmatched `(`                      |
| `g;`        | Jump to previous insert location                |
| `g,`        | Jump to next insert location                    |
| `''`        | Jump to position before last jump               |

## Command-line Mode Tricks

| Command            | Description                                             |
|--------------------|---------------------------------------------------------|
| `CTRL r+`          | Paste from system clipboard                             |
| `CTRL u`           | Delete all characters                                   |
| `CTRL g`           | Next match in search results                            |
| `CTRL t`           | Previous match in search results                        |
| `:%norm`           | Apply command to every line (`:%norm $ciwhello`)        |
| `:g/^#/d`          | Delete all comments from a Bash file                    |
| `:g/foo/s/bar/baz/g` | Replace "bar" with "baz" in lines containing "foo"    |
| `g&`               | Repeat last substitution                                |

## Clipboard & Registers

| Command       | Description                                              |
|---------------|----------------------------------------------------------|
| `gx`          | Open link under cursor                                   |
| `gf`          | Open file under cursor                                   |
|              | If `unnamedplus` is set, system clipboard won't overwrite yank buffer |

## Miscellaneous

| Command       | Description                                       |
|---------------|---------------------------------------------------|
| `CTRL g`      | Show filename and line count                      |
| `zz`          | Center cursor on screen (middle)                  |
| `zt`          | Cursor to top of screen                           |
| `zb`          | Cursor to bottom of screen                        |
| `:center`     | Center text                                       |
| `ga`          | Show character info under cursor                  |
| `g?`          | ROT13 encode input                                |
| `CTRL a`      | Increment number under cursor                     |
| `CTRL x`      | Decrement number under cursor                     |
| `:sort u`     | Sort lines uniquely                               |
| `:sort n`     | Sort lines numerically                            |
| `<C-f>`       | Edit Ex command in full-page view                 |
| `_`           | Move to first character on line, accepts a motion |
