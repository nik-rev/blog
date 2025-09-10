---
title: Variant, Covariant and Invariant Lifetimes explained like you're 5
draft: true
---

I want to understand what these magic words mean.

I had to read the [Nomicon](https://doc.rust-lang.org/nomicon/subtyping.html) several times over the course of several months in order to try and wrap my head around it.

I'll explain these 3 concepts as simply as possible so you can understand them sooner!

## Covariance

I want something that lives for a little bit, but I'll accept something that lives for longer.

- I want: `&'short T`
- but I'll be OK with: `&'long T`

  **Why:** By the time `'short` expires, I won't care about the `T` anymore.
  So, I only need something that lives for *at least* `'short`.

- and I am **NOT OK** with `&'very_short T`

  **Why:**: I am allowed to dereference `'short` right before it would expire.
  However, a `'very_short` would have expired earlier - **I would be dereferencing a value who's lifetime has expired**.
  Which would be 💥 Undefined Behaviour! 💥

### Example

## Contravariance

I want a function that expects its argument to live for a long time, but I'll accept a function that expects its argument to live for a little bit.

- I want: `fn(&'long str)`
- but I'll be OK with: `fn(&'short str)`

  **Why:**

- and I am **NOT OK** with `fn(&'very_long str)`

### Example

## Invariance

### Example
