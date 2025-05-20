---
title: Rust's `format!` macro is slow for simple string concatenation. But *why*?
---

Why is the `format!` _compiler built-in_ macro so much slower for string concatenation than doing it "manually" by calling `String::with_capacity` followed by a series of `String::push_str`?

<!-- more -->

I'm going to test this with a benchmark that will join 3 variables together with a space 100,000 times using both the `format!` macro and the manual method.

```rs
// We'll need black_box to make sure the
// compiler does not make any optimizations that
// would ruin the benchmark.

// For instance it could concatenate the strings at compile time
// as an optimization. We want to simulate how it would be like in
// real code, where we don't know what the values will be.
use std::hint::black_box;
use std::time::Instant;

fn concat_format(a: &str, b: &str, c: &str) -> String {
    format!("{a} {b} {c}")
}

fn concat_manual(a: &str, b: &str, c: &str) -> String {
    let mut buf = String::with_capacity(a.len() + 1 + b.len() + 1 + c.len());
    buf.push_str(a);
    buf.push(' ');
    buf.push_str(b);
    buf.push(' ');
    buf.push_str(c);
    buf
}

fn main() {
    // Manual concat
    let now = Instant::now();
    for _ in 0..100_000 {
        let a = black_box("first");
        let b = black_box("second");
        let c = black_box("third");
        black_box(concat_manual(a, b, c));
    }
    println!("concat_manual: {:?}", now.elapsed());

    // Concat with `format!`
    let now = Instant::now();
    for _ in 0..100_000 {
        let a = black_box("first");
        let b = black_box("second");
        let c = black_box("third");
        black_box(concat_format(a, b, c));
    }
    println!("concat_format: {:?}", now.elapsed());
}
```

These are the results, running in `--release` mode:

```
concat_manual: 1.879225ms
concat_format: 9.984558ms
```

Using `format!` is about **5x slower** than preallocating the correct amount of memory, then pushing the strings manually.

My question is why. Since `format!` is built-in, at compile time the Rust compiler _should_ be able optimize a simple use of `format!` that is only for string concatenation to be just as fast as using the "manual" approach of concatenating the string.

I am aware that strings passing through the `std::fmt` machinery have to do more work. But couldn't this extra work be skipped in more simple cases such as string concatenation?

In theory, the Rust compiler could optimize the `format!` macro and friends to use a different, much simpler algorithm if none of the fancy formatting options are used, so only the `Display` impls are.

Using `format!` is so much nicer than having to resort to manual string preallocation then pushing into a buffer, and used quite a lot in Rust. I would love to see this area get some performance improvements.

## Declarative utility macro for efficient string concatenation

I've written a declarative macro that can concatenate strings in a more efficient way. Granted, this efficiency is unlikely to matter in most situations since `format_args!` is still incredibly fast.

```rs
/// Concatenates strings together.
///
/// `str_concat!(a, " ", b, " ", c)` is:
/// - more performant than `format!("{a} {b} {c}")`
/// - more ergonomic than using `String::with_capacity` followed by a series of `String::push_str`
#[macro_export]
macro_rules! str_concat {
    ($($value:expr),*) => {{
        // Rust does not allow using `+` as separator between value
        // so we must add that at the end of everything. The `0` is necessary
        // at the end so it does not end with "+ " (which would be invalid syntax)
        let mut buf = String::with_capacity($($value.len() + )* 0);
        $(
            buf.push_str(&$value);
        )*
        buf
    }}
}
```

## However, there's hope!

As it turns out, the library team is absolutely aware about this. In fact [there are efforts](https://github.com/rust-lang/rust/issues/99012) to make this formatting faster.

Thanks to [`u/joboet`](https://www.reddit.com/user/joboet/) for these 2 additional points:

> - Since all `format_args!` invocations must create a `fmt::Arguments` structure, and (due to std being precompiled) that structure cannot be changed dynamically, the solution needs to be one-size-fits-all: it needs to be fast to run and compile in both debug and release builds, ideally irrespective of how complex the format string is.
> - Due to the way bootstrapping the Rust compiler works, it's currently very difficult to make changes to `format_args!`, as you need to maintain the old definition of `fmt::Arguments` to support bootstrapping the initial compiler.
