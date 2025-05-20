---
title: Rust has many reserved keywords like `become`. But what will they do?
---

I found a [page in the Rust reference](https://doc.rust-lang.org/reference/keywords.html) that lists all of the currently reserved keywords:

- `priv`
- `become`
- `abstract`
- `override`
- `final`
- `box`
- `do`
- `macro`
- `typeof`
- `unsized`
- `virtual`
- `yield`
- `try`

I am really curious what they will do. I did some research, compiling a list of rfcs which use these keywords with my own speculations mixed in:

- `priv`: Everything in Rust is already private by default[^1] except trait items, enum variants, and fields in enum variants. Perhaps at some point these can be made opt-in private.
- `become`: [Tail call optimization](https://github.com/rust-lang/rfcs/pull/3407) for recursive functions.
- `abstract`, `override`, `final`: [Was reserved for a possibility of adding "more efficient inheritance"](https://rust-lang.github.io/rfcs/0342-keywords.html)[^2]
- `box`: [Box patterns](https://github.com/rust-lang/rust/issues/29641).
- `do`: In the old days, `do` was a way to invoke a function that takes a closure as a parameter such as `do task::spawn { println!("Hello, world!"); }`.[^2]
- `macro`: [Declarative macros 2.0](https://github.com/rust-lang/rust/issues/39412), which will bring many improvements over the current system -- such as improved hygiene
- `typeof`: Obtain the type of an expression so you can do something like: `let x: typeof("a") = "hello"`.
- `unsized`: Could be syntax sugar for `!Sized`.
- `virtual`: Rust used to have "virtual structs" which were implemented as a test, this lead to the `virtual` keyword. [They were later removed, but the keyword was kept.](https://rust-lang.github.io/rfcs/0341-remove-virtual-structs.html)
- `yield` and `gen`: [Generator functions and blocks](https://github.com/rust-lang/rust/issues/117078).
- `try`: [Local blocks](https://github.com/rust-lang/rust/issues/31436) which the `?` operator can return from without returning from the function.

`unsized` only makes sense as sugar for `!Sized` but is this really necessary? Rust tries hard not to special case the standard library and just adding syntax for a built-in item seems like isn't necessary. I didn't find an RFC for it though so it could be used for more than that.

`do` is used for the `do yeet` in https://github.com/rust-lang/rust/issues/96373 but the syntax will change when its stabilized so I don't count it.

[^1]: This wasn't always the case, [there was a time when not everything was private by default!](https://github.com/rust-lang/rust/issues/8122).

[^2]: Thank you [`u/steveklabnik1`](https://www.reddit.com/user/steveklabnik1/) for the info.
