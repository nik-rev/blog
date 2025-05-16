---
title: What you might not know about Semantic Blockquotes in HTML
readTime: true
---

I think most people know the basics about semantic HTML, where you use certain HTML elements to describe the structure of your page in order to make it more accessible for screen readers.

But not all semantic HTML is straightforward. Specifically, how do you represent a quote by someone and give them credit for it in a semantic way?

<!--more-->

To understand, first let's talk about semantic HTML. An example below, instead of a "soup of divs" as follows:

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

### `cite` element

But what if you wanted to give credit to the original author? You might try something like this:

```html
<blockquote>
  We cannot solve our problems with the same thinking we used when we created
  them.
  <cite> Albert Einstein </cite>
</blockquote>
```

But the above approach is semantically incorrect. There are two problems with it:

1. A `cite` element [should refer to _work_ and not _people_](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite#usage_notes).

   For example, we could put the link to a social media post or an article in a `cite` element. But not an individual person.

1. Putting a `cite` element within a `blockquote` is [forbidden by the HTML spec](https://www.w3.org/TR/html5-author/the-blockquote-element.html#the-blockquote-element), due to the fact that it would make the citation a part of the quote.

### `parent` element

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

But again, this can be used to help style those two elements, but semantically it doesn't join them together. To a screen reader they would appear as two distinct, unrelated elements.

#### `figure` element

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

## A plugin that adds a new syntax to Markdown to represent blockquotes semantically

I wanted to be able to create such blockquotes and figcaptions on-the-fly, in markdown. There wasn't a solution available, so I wrote a plugin in order to accomplish this.

[Rehype](https://github.com/rehypejs/rehype) is a parser for HTML and is commonly used with MDX and [remark](https://github.com/remarkjs/remark) -- a parser for markdown. Together, these tools allow you to get very creative with your markdown editing.

My plugin is called [`rehype-semantic-blockquotes`](https://github.com/nik-rev/rehype-semantic-blockquotes), and it transforms markdown syntax such as this:

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

The `@` syntax is added by the plugin. It makes it easy to author accessible content in markdown.

You can find more information about how to use this on [`rehype-semantic-blockquotes`](https://github.com/nikitarevenco/rehype-semantic-blockquotes) plugin README!
