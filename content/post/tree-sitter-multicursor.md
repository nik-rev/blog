---
title: Let's create a Tree Sitter grammar for the Helix Editor
date: 2025-01-18
readTime: true
---

I've always been fascinated with [Tree Sitter](https://github.com/tree-sitter/tree-sitter), a powerful framework for creating grammars that parse text into syntax trees and incrementally update them.

<!--more-->

This is perfect for text editors, because when you're editing a file more often than not the file will be in an invalid state and wouldn't be able to compile.

But with Tree Sitter, only the region which you are editing is affected. Syntax highlighting takes milliseconds and happens in real time. Other parts of the code are not affected!

## Purpose of this grammar

I'm really glad to finally have an excuse to learn how Tree Sitter works for a real world project. Specifically, I've been using the [Helix Editor](https://github.com/helix-editor/helix) for a while now which is lacking the `:help` command to view documentation on various commands right within the editor.

Now, Helix is a selection-first editor with multi-cursor functionality as a core editing primitive. We could just write the help files in plaintext or markdown, but in my opiniont that wouldn't be enough.

We need a way to _render_ Helix selections right within the editor, like this for example:

![helix selections rendered in the editor](/helix-selections.png)

## Creating the grammar

I followed the [Creating Parsers](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html) guide in order to set up my environment.

But basically, these are the commands we need to run:

```sh
mkdir tree-sitter-multicursor
cd tree-sitter-multicursor
tree-sitter init
tree-sitter generate
pnpm install
```

Our point of interest is the `grammar.js` file. This is where we'll be doing all of our work, by using high-level APIs that Tree Sitter provides. Not all parsers will be possible using the JavaScript API, so sometimes using C is required to implement certain rules. But in our case, we're good to go!

This is our file:

```js
module.exports = grammar({
  name: "multicursor",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => "hello",
  },
});
```

First, let's implement rules for the primary selection with cursor on the left: `hello #[|world]#`. If we can get this one right, the others will be quite straightforward.

If you mentally break down every token above, you can think of it like this:

- Text: `hello `
- Primary Selection with Cursor on the Left:
  - Opening: `#[|`
  - Cursor: `w`
  - Text (optional): `orld`
  - Closing: `]#`

That's right, we need a specific sequence of characters. We must **always** have the cursor, so the contents of each selection must be at least 1 character.

Tree Sitter has a handy function called `seq` which matches any number of other rules, one after the other.

First, let's create `text`. `text` is just "any characters", _other than_ our reserved ones. We don't want to allow users to write the characters `#`, `[`, `]`, `(`, `)` or `|` for a simple implementation. We'll think about how we can allow those characters later.

```js
text: ($) => /[^#\[\]\(\)\|]+/,
```

`text` will match one or more characters which are not the aformentioned ones.

Now let's create `right_primary`, which means "**Primary** selection, with cursor on the **Right**".

```js
right_primary: ($) =>
  seq(
    "#[",
    repeat($.text),
    "|]#",
  ),
```

Our structure will look something as follows:

```js
right_primary: ($) =>
  seq(
    /* ,
    repeat(alias($.char_primary, $.char)),
    $.cursor_primary,
    $.end_right_primary,
  ),
```

To start implementing our rules, first let's think about what our requirements are:
