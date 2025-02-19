---
title: "Open Source Projects and Contributions"
toc: true
---

Contributing to open-source projects is the most fun hobby. You get to make your own experience of using the software more enjoyable, as well as having other people appreciate your contributions.

Diving into a new codebase can be a real challenge sometimes, you get to discover different patterns, how people think about structuring their projects. Which is why it feels so rewarding to make your first pull request. I always come out of it having learned a thing or two and I _love_ it.

## Helix

I love and use Helix as my primary editor for everything. It is extremely powerful and comes with everything you need built-in. A breath of fresh air for someone who surely spent too much time configuring their NeoVim, and now I use that time to contribute to Helix instead:

- Helix has a file explorer, but it is limited to viewing files. [I added some extensions to it to allow, for example: deleting files, renaming them, copying and others.](https://github.com/helix-editor/helix/pull/12902)
- Implemented a [_Language Server Protocol feature_](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentColor) that [shows you colored boxes next to colors in the file](https://github.com/helix-editor/helix/pull/12308), such as in CSS
- I often find needing myself to convert the case of selected text between PascalCase, snake_case, camelCase and other case modes. That's why I made a pull request that [incorporates case conversion functions into the editor](https://github.com/helix-editor/helix/pull/12043).
- Despite Helix being a terminal text editor, mouse support is still sometimes useful. That's why I made mouse be consistent with other editors by implementing functionality such as [double click that the word that was clicked and triple click selecting the line](https://github.com/helix-editor/helix/pull/12514)
- [_and a bunch more..._](https://github.com/search?q=author%3Anik-rev&type=pullrequests)

## Patchy

I built a command line tool that makes it easy to declaratively configure personal forks of repositories.

Say I want to use the Helix editor but also use features from certain pull requests like `#12309`, `#12285`, `#8908` and `#11164`.

I want to keep my branch and those merged PRs up to date aswell, easily add and remove pull requests.

With patchy, doing that is really easy and automated. So with this config:

```toml
repo = "helix-editor/helix"
remote-branch = "master"
local-branch = "patchy"
pull-requests = [
  "12309",
  "11285",
  "8908",
  "11164"
]
```

Then just running a single command:

```sh
patchy run
```

Will "build" a new branch that contains the up-to-date clone with all the merged pull requests.

Link: [patchy](https://github.com/nik-rev/patchy)

## Semantic Blockquotes Plugin

There is a certain correct way to `@mention` an author of a quote when using the `<blockquote>` HTML element. Unfortunately, it involves quite a lot of boilerplate and a lot of people don't know about it.

That's why I created `rehype-semantic-blockquotes`, which operates on the HTML syntax tree to transform the following markdown:

```md
> We cannot solve our problems with the same thinking we used when we created them.
>
> @ Albert Einstein
```

Into the following HTML:

```html
<figure data-blockquote-container="">
  <blockquote data-blockquote-content="">
    <p>
      We cannot solve our problems with the same thinking we used when we
      created them.
    </p>
  </blockquote>
  <figcaption data-blockquote-credit="">
    <p>Albert Einstein</p>
  </figcaption>
</figure>
```

Link: [rehype-semantic-blockquotes](https://github.com/nik-rev/rehype-semantic-blockquotes)

## Odin Project

[The Odin Project](https://github.com/theodinproject) is an open-source curriculum for learning web development which is focusing on **building projects**. Unlike most other courses I tried which were about _following a tutorial_.

That's what got me hooked on programming. When a challenge is presented in front of you and you are challenged with a task to overcome it.

I also made my first open-source contributions here. While I was completing this course, I made several contributions by writing new content, improving material and more. Some examples:

- They use markdown lint to keep a consistent lesson structure, as they have hundreds of lessons. I [wrote a custom rule](https://github.com/TheOdinProject/curriculum/pull/27977) to help with that.
- Me and two maintainers collaborated to [create new JavaScript recursion exercises](https://github.com/TheOdinProject/javascript-exercises/pulls?q=is:open%20is:pr%20author:nik-rev%20create%20exercise) to test learners after their first introduction to recursion.
- [A lot of paragraph edits, structural improvements and others to make content easier to read...](https://github.com/TheOdinProject/curriculum/pulls?q=is:merged%20is:pr%20author:nik-rev)

Contributing to the Odin Project was an extremely valuable experience. It made me a better technical writer.

## Catppuccin

I'm an avid user of the [Catppuccin](https://github.com/catppuccin) color theme and I _love_ it. They have ports for hundreds of apps and sites, some of which I personally themed as well:

- [Slidev](https://github.com/nik-rev/catppuccin-slidev) -- a presentation tool for developers.
- [Nushell](https://github.com/nik-rev/catppuccin-nushell) -- a modern shell.
- [Docsify](https://github.com/nik-rev/catppuccin-nushell) -- instant documentation website generator from READMEs with no build step required.
