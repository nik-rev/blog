---
title: Rust's format! macro is slow for simple string concatenation. But why?
---

I'm wondering why is `format!` (which is a compiler built-in macro) so much slower for string concatenation than doing it "manually" by calling `String::with_capacity` followed by a series of `String::push_str`

Here is the benchmark that I am running:

```rs
use std::hint::black_box;
use std::time::Instant;

fn concat_format(a: &str, b: &str, c: &str) -> String {
    format!("{a} {b} {c}")
}

fn concat_capacity(a: &str, b: &str, c: &str) -> String {
    let mut buf = String::with_capacity(a.len() + 1 + b.len() + 1 + c.len());
    buf.push_str(a);
    buf.push(' ');
    buf.push_str(b);
    buf.push(' ');
    buf.push_str(c);
    buf
}

fn main() {
    let now = Instant::now();
    for _ in 0..100_000 {
        let a = black_box("first");
        let b = black_box("second");
        let c = black_box("third");
        black_box(concat_capacity(a, b, c));
    }
    println!("concat_capacity: {:?}", now.elapsed());
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
concat_capacity: 1.879225ms
concat_format: 9.984558ms
```

Using `format!` is about 5x slower than preallocating the correct amount then pushing the strings manually.

My question is why. Since `format!` is built-in, at compile time the Rust compiler should be able optimize a simple use of `format!` that is only for string concatenation to be just as fast as using the "manual" approach of concatenating the string.

I am aware that strings passing through the `std::fmt` machinery have to do more work. But couldn't this extra work be skipped in more simple cases such as string concatenation? All of this can happen at compile time as well.

In theory, the Rust compiler could optimize the `format!` macro and friends to use a different, much simpler algorithm if none of the fancy formatting options are used, so only the `Display` impls are.

Using `format!` is so much nicer than having to resort to manual string preallocation then pushing into a buffer, and used quite a lot in Rust. I would love to see this area get some performance improvements.

## Research

It turns out that the library team is absolutely aware about this. In fact [there are efforts](https://github.com/rust-lang/rust/issues/99012) to make this formatting faster.

Thanks to [`u/joboet`](https://www.reddit.com/user/joboet/) for these 2 additional points:

> - Since all `format_args!` invocations must create a `fmt::Arguments` structure, and (due to std being precompiled) that structure cannot be changed dynamically, the solution needs to be one-size-fits-all: it needs to be fast to run and compile in both debug and release builds, ideally irrespective of how complex the format string is.
> - Due to the way bootstrapping the Rust compiler works, it's currently very difficult to make changes to `format_args!`, as you need to maintain the old definition of `fmt::Arguments` to support bootstrapping the initial compiler.
