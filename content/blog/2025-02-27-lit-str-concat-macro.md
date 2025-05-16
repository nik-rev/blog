---
title: Rust's std macros like include_str! and env! have a superpower, and how can we achieve it?
---

So you can use the `concat!` macro to pass string literals into macros:

```rs
env!("ab")
env!(concat!("a", "b"))
```

Both of the above calls will become `env!("ab")`

However, a macro created using the `syn` crate that expects a single `syn::LitStr` (literal string) as its input, such as Dioxus's [`asset!`](https://docs.rs/dioxus/0.6.3/dioxus/prelude/macro.asset.html) macro:

```rs
asset!("/assets/icons/github.svg")
```

You aren't able to pass `concat!` to this macro for some reason.

This does not compile: Expected a string literal.

```rs
asset!(concat!("/assets/icons/", "github", ".svg"))
```

This seems to be because the `asset!` macro expects a string literal. But is `concat!("...", "...")` a string literal? Since you can use it inside of `concat!()`: `concat!(concat!(""))`, it feels like it is. But the macro has to be _first_ expanded and _then_ passed inside of the macro

What I'm seeing is that Rust's own macros like `include_str!` and `env!` have a special "superpower" where they can expand the `concat!` macro _before_ parsing. However, user-created declarative macros using the `syn` crate are unable to.

These macros get the raw `TokenStream` corresponding to the tokens in `"concat!("/assets/icons/", "github", ".svg"))"`

Thankfully, the amazing [David Tolnay](https://github.com/dtolnay) shared a pretty cool crate called [`macro-string`](https://crates.io/crates/macro-string) which allows creating a derive macro which eagerly evaluates the following `std` macros, at the time of writing:

- `concat!`
- `env!`
- `include!`
- `include_str!`
- `stringify!`

Meaning you'll be able to pass them into macros that expect a string literal, and they'll get expanded _before_!
