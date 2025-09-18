---
title: Multi-line string literals in Rust
---

Writing multi-line strings in Rust is quite awkward:

```rust
let sql = "create table student(
    id int primary key,
    name text
)";
```

I like how it works in Zig, I think Zig's multi-line string literal syntax is one of the best:

```zig
const sql =
    \\ create table student(
    \\     id int primary key,
    \\     name text
    \\ )
;
```

Comments in Zig use `//` and make content until end of the line part of the comment. Same with multi-line string literals, `\\` makes everything after it a part of the string.
Incredible consistency.

I've been missing this feature a lot in Rust. There are some solutions for this problem, like the `indoc` crate:

```rs
let sql = indoc! {"
    create table student(
        id int primary key,
        name text
    )
"};
```

Or you can do it using one of the following alternatives:

```rs
let sql = "\
create table student(
    id int primary key,
    name text
)";
```

```rs
let sql = concat!(
    "create table student\n",
    "    id int primary key,\n",
    "    name text\n",
    ")",
);
```

```rs
let sql = "\
    create table student(\n\
        id int primary key,\n\
        name text\n\
    )\
";
```

But none of those are satsifying to me.
The biggest selling point of multi-line string literals is that they would be automatically formatted by `rustfmt` to match the surrounding indentation.

But wait... apparently Rust already has multi-line string literals? It's just as elegant as Zig's, and I've never seen anyone use it!

```rust
macro_rules! multi {
    (
        #[doc = $first:literal]
        $(#[doc = $rest:literal])*
    ) => {
        concat!($first, $("\n", $rest,)*)
    };
}
let sql = multi!(
    /// create table student(
    ///     id int primary key,
    ///     name text
    /// );
);
```

This works since `/// foo` is just syntax sugar for `#[doc = r"foo"]`.

What I *really* like about this is that I can take the expression `multi!(...)` and copy-paste it wherever I feel like, **and the indentation will be preserved!**.

And the best part, it is totally customizeable! You can make a cool new `format!` macro that makes use of that syntax:

```rs
macro_rules! multi_format {
    (
        #[doc = $first:literal]
        $(#[doc = $rest:literal])*
        $(, $($tt:tt)*)?
    ) => {
        format!(concat!($first, $("\n", $rest,)*)$(, $($tt)*)?)
    };
}

let foo = multi_format!(
     /// Hello, my name is {}
     , "bob"
);
```

It won't work with interpolated variables, though:

```rs
let age = 0;
let bob = multi_format!(
     /// Hello, my name is {} and I am {age} years old!
     , "bob"
);
```

> "there is no argument named `age`"
> did you intend to capture a variable `age` from the surrounding scope?
> to avoid ambiguity, `format_args!` cannot capture variables when the format string is expanded from a macro

That's unfortunate, it takes away from the utility of a *naive* implementatio!
That's why I made a procedural macro [`docstr!`](https://github.com/nik-rev/docstr/tree/main), which turns documentation into strings at compile-time:

```rust
use docstr::docstr;

let hello_world: &'static str = docstr!(format
    /// fn main() {
    ///     println!("Hello, my name is {}");
    /// }
"Bob");

assert_eq!(hello_world_in_c, r#"fn main() {
    println!("Hello, my name is Bob");
}"#)
```

Expands to this:

```rust
format!(r#"fn main() {
    println!("Hello, my name is {}");
}"#, "Bob")
```
