---
title: "Projects & Contributions"
date: "2024-08-21"
toc: true
---

I love contributing to open source software and improving it such as by fixing bugs or adding new features.

## Helix

I love and use Helix as my primary editor for everything. It is extremely powerful and seriously underrated.

- [Colored boxes next to colors #12308](https://github.com/helix-editor/helix/pull/12308)
- [Colors for items in the completion menu #12299](https://github.com/helix-editor/helix/pull/12299)
- [Colors for directory prompt completions #12205](https://github.com/helix-editor/helix/pull/12205)

[All of my additions to Helix are available on GitHub.](https://github.com/helix-editor/helix/pulls/nik-rev)

## Patchy

I built a command line tool that makes it easy to declaratively configure personal forks of repositories.

Say I want to use the Helix editor but also use features from certain pull requests like `#12309`, `#12285`, `#8908` and `#11164`.

I want to keep my branch and those merged PRs up to date aswell, easily add and remove pull requests.

With patchy, doing that is really easy with this config:

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

An open-source curriculum for learning web development. This is a very special project to me. It was my starting point as a programmer, and I submitted my first pull requests here.

While I was completing this course, I improved the material by making it more accessible to learners.

This was my starting point as a programmer.

- They use markdown lint to keep a consistent lesson structure, as they have hundreds of lessons. I [wrote a custom rule](https://github.com/TheOdinProject/curriculum/pull/27977) to help with that.
- [Created new JavaScript recursion exercises](https://github.com/TheOdinProject/javascript-exercises/pulls?q=is:open%20is:pr%20author:nik-rev%20create%20exercise) to test learners after their first introduction to recursion.
- A lot of paragraph edits, structural improvements, etc. to make content easier to read. [You can view all my changes on GitHub](https://github.com/TheOdinProject/curriculum/pulls?q=is:merged%20is:pr%20author:nik-rev).

## Catppuccin

I'm an avid user of the [Catppuccin](https://github.com/catppuccin) color theme and I use it _everywhere_ I can.

I've personally themed several apps as well.

- [Slidev](https://github.com/nik-rev/catppuccin-slidev) -- a presentation tool for developers.
- [Nushell](https://github.com/nik-rev/catppuccin-nushell) -- a modern shell.
- [Docsify](https://github.com/nik-rev/catppuccin-nushell) -- instant documentation website generator from READMEs with no build step required.
