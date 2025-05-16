---
title: What will these reserved Rust keywords do? Theory and speculation
---

I found this page which lists all reserved keywords for Rust: https://doc.rust-lang.org/reference/keywords.html

I did research and compiled a list of speculations / rfcs that use these keywords:

- `priv`: everything in Rust is already private by default[^1] except trait items, enum variants, and fields in enum variants. Perhaps at some point these can be made opt-in private
- `become`: tail call optimization for recursive functions (https://github.com/rust-lang/rfcs/pull/3407)
- `abstract`, `override`, `final`: [Was reserved for a possibility of adding "more efficient inheritance"](https://rust-lang.github.io/rfcs/0342-keywords.html)[^2]
- `box`: box patterns (https://github.com/rust-lang/rust/issues/29641)
- `do`: In the old days, `do` was a way to invoke a function that takes a closure as a parameter such as `do task::span { println!("Hello, world!"); }`.[^2]
- `macro`: declarative macros 2.0 (https://github.com/rust-lang/rust/issues/39412)
- `typeof`: get the type of an expression so you can do `let x: typeof("a") = "hello"`
- `unsized`: syntax sugar for `!Sized`
- `virtual`: Rust used to have "virtual structs" which were implemented as a test, this lead to the `virtual` keyword. [They were later removed, but the keyword was kept.](https://rust-lang.github.io/rfcs/0341-remove-virtual-structs.html)
- `yield` and `gen` (weak): generator functions and blocks (https://github.com/rust-lang/rust/issues/117078)
- `try`: local blocks which the `?` operator can return from without returning from the function (https://github.com/rust-lang/rust/issues/31436)

`unsized` only makes sense as sugar for `!Sized` but is this really necessary? Rust tries hard not to special case the standard library and just adding syntax for a built-in item seems like isn't necessary. I didn't find an RFC for it though so it could be used for more than that

`do` is used for the `do yeet` in https://github.com/rust-lang/rust/issues/96373 but the syntax will change when its stabilized so I don't count it

[^1]: This wasn't always the case, [there was a time when not everything was private by default!](https://github.com/rust-lang/rust/issues/8122)

[^2]: Thanks to [`u/steveklabnik1`](https://www.reddit.com/user/steveklabnik1/) for the info
