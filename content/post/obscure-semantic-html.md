---
title: What you might not know about Semantic Blockquotes in HTML
date: 2024-04-17
readTime: true
---

I think most people know the basics about semantic HTML, where you use the correct HTML elements to clearly state the purpose of a page.

<!--more-->

For example, instead of a "soup of divs" like this:

```html
<div class="content">
  <div class="header" />
  <div class="button" />
  <div class="footer" />
</div>
```

It's better to use HTML elements designed specifically to describe the meaning of the page semantically:

```html
<main>
  <header />
  <button />
  <footer />
</main>
```

Semantic HTML is extremely important for websites due to two main factors:

- Accessibility

  Screen readers understand the context of the page by reading HTML elements, not tags or class names.

- Search Engine Optimization (SEO)

  Bots such as Google crawler use HTML to understand the structure of a page.

But there are some semantic HTML patterns that aren't as obvious. For instance, if you want to cite the original author when using `blockquote`.

## Properly representing blockquotes with a caption

To quote, you can use the `blockquote` element:

```html
<blockquote>
  We cannot solve our problems with the same thinking we used when we created
  them.
</blockquote>
```

### cite element

But what if you wanted to give credit to the original author? You might try something like this:

```html
<blockquote>
  We cannot solve our problems with the same thinking we used when we created
  them.
  <cite> Albert Einstein </cite>
</blockquote>
```

But the above approach is actually semantically incorrect. There are two problems with it:

1. A `cite` element [should refer to _work_ and not _people_](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite#usage_notes).

For example, we could put the link to a social media post or an article in a `cite` element. But not an individual person.

1. Putting a `cite` element within a `blockquote` is [forbidden by the HTML spec](https://www.w3.org/TR/html5-author/the-blockquote-element.html#the-blockquote-element), due to the fact that it would make the citation a part of the quote.

### parent element

An alternative idea would be to use a `div` to group the quote and the citation together:

```html
<div>
  <blockquote>
    <p>
      We cannot solve our problems with the same thinking we used when we
      created them.
    </p>
  </blockquote>
  <p>Albert Einstein</p>
</div>
```

But again, this can be used to help style those two elements, but semantically it doesn't join them together.

#### figure element

Finally, after researching I stumbled across a new solution, using the `figure` element:

```html
<figure>
  <blockquote>
    <p>
      We cannot solve our problems with the same thinking we used when we
      created them.
    </p>
  </blockquote>
  <figcaption>
    <p>Albert Einstein</p>
  </figcaption>
</figure>
```

This way, we are properly describing the relationship between the `blockquote` and the `figcaption`.

## `rehype-semantic-blockquotes` plugin

I wanted to be able to create such blockquotes and figcaptions on-the-fly, in markdown. There wasn't a solution available, so I wrote a rehype plugin myself to accomplish this.

Rehype is a parser for HTML and is commonly used with MDX and remark, a parser for markdown.

It transforms markdown syntax like this:

```md
> We cannot solve our problems with the same thinking we used when we created them.
>
> @ Albert Einstein
```

Into the following HTML:

```md
<figure data-blockquote-container="">
  <blockquote data-blockquote-content="">
    <p>
      We cannot solve our problems with the same thinking we used when we created
    them.
    </p>
  </blockquote>
  <figcaption data-blockquote-credit="">
    <p>Albert Einstein</p>
  </figcaption>
</figure>
```

The `data-*` attributes are useful for styling these blockquotes.

You can find more information about how to use this on [`rehype-semantic-blockquotes`](https://github.com/nikitarevenco/rehype-semantic-blockquotes) plugin README!
