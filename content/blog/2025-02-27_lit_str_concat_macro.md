---
title: Rust's macros like `include_str!` have a superpower, but how can *our* code achieve it?
---

You can use the `concat!` macro to pass string literals into macros:

```rs
env!("ab")
env!(concat!("a", "b"))
```

Both of the above calls will **become** `env!("ab")`.

However, a macro created using the [`syn`](https://crates.io/crates/syn) crate that expects a literal string `syn::LitStr` as its input, such as Dioxus's [`asset!`](https://docs.rs/dioxus/0.6.3/dioxus/prelude/macro.asset.html) macro:

```rs
asset!("/assets/icons/github.svg")
```

Will _not_ be able to receive `concat!`.

This does not compile. **`ERROR: Expected a string literal`**.

```rs
asset!(concat!("/assets/icons/", "github", ".svg"))
```

I assume this is because the `asset!` macro expects a string literal. But _is_ `concat!("...", "...")` a string literal?

Because `concat!(...)` itself only accepts string literals, and you can use it inside of itself: inside of itself: `concat!(concat!(""))`, it **must** be, right? For this to work, the macro has to be evaluated in this order.

1. Macro expands
1. The expanded form is passed inside the `concat!`

When you try to write your own macro that can do the above, you'll notice it isn't possible.

Rust's macros such as `include_str!` and `env!` have a special "superpower" where they can expand the `concat!` macro _before_ parsing. However, user-created declarative macros using the `syn` crate are unable to.

These macros get the raw `TokenStream` corresponding to the tokens in `"concat!("/assets/icons/", "github", ".svg"))"`

## Solution

Thankfully, the amazing [David Tolnay](https://github.com/dtolnay) shared a pretty cool crate called [`macro-string`](https://crates.io/crates/macro-string) which allows creating a derive macro which eagerly evaluates the following `std` macros, at the time of writing:

- `concat!`
- `env!`
- `include!`
- `include_str!`
- `stringify!`

Meaning you'll be able to pass them into macros that expect a string literal, and they'll get expanded _before_!
