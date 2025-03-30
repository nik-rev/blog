---
title: Let's create a Tree Sitter grammar for Rust's string interpolation macros like println!
date: 2025-01-18
readTime: true
draft: true
toc: true
---

I am using the [Helix Editor](https://github.com/helix-editor/helix) which uses tree-sitter for syntax highlighting. However, the Rust tree-sitter grammar does _not_ support parsing the string interpolations of macros like `format!` and `eprintln!`. This means that Helix cannot have syntax highlighting for these macros. **_for now!_**

In this blog post we will learn how to create a Tree Sitter grammar from scratch, in order to add syntax highlighting for these macros! _Exciting_!

<!--more-->

An example of some Rust code that uses string interpolation:

```rs
fn main() {
    let (name, age) = ("Bob", 25);

    println!("My name is {name} and I am {age} years old.");
    // ^ My name is Bob and I am 25 years old.

    println!("Pi to 3 decimal places: {:.3}", f64::consts::PI);
    // ^ Pi to 3 decimal places: 3.141

    println!("Debug: {:?}", ("tuple", [1, 2, 3], Some("value")));
    // ^ Debug: ("tuple", [1, 2, 3], Some("value"))
}
```

## The Grammar of String Interpolation Macros

Grammars of languages can be expressed in a language called [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) (BNF). This is the [official grammar for string interpolations](https://doc.rust-lang.org/std/fmt/index.html#syntax) in rust:

```
format_string := text [ maybe_format text ] *
maybe_format := '{' '{' | '}' '}' | format
format := '{' [ argument ] [ ':' format_spec ] [ ws ] * '}'
argument := integer | identifier

format_spec := [[fill]align][sign]['#']['0'][width]['.' precision]type
fill := character
align := '<' | '^' | '>'
sign := '+' | '-'
width := count
precision := count | '*'
type := '' | '?' | 'x?' | 'X?' | identifier
count := parameter | integer
parameter := argument '$'
```

### A quick tour of BNF Syntax

In order to understand the rest of this post, we'll need to know some BNF notation.

`[stuff]` means that `stuff` is optional. We don't have to include it.

For instance, say we have `:= '100'['.100'['.100']]`. Valid forms would be:

- `100`
- `100.100`
- `100.100.100`

An asterisk `*` is a repetition of 0 or more.

So if we have `:= '10' *`. Valid forms are:

- `10`
- `1010`
- `101010`
- _..._

The pipe `|` means an OR. If we have two patterns, we choose one of them.

If we have `:= 'a' | 'b' | 'c'`, then valid forms are:

- `a`
- `b`
- `c`

Finally, we can also reference other variables. If we have:

```
alice := 'alice'
bob := 'bob'
person := alice | bob
```

Then valid forms for `person` are:

- `alice`
- `bob`

Given all of the knowledge learned above, we can express numbers with the following BNF notation:

```
digit_nonzero := '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
digit := '0' | digit_nonzero
floating_part := '.' digit *
number := digit_nonzero * [floating_part]
```

Examples of valid forms for `number` in the above BNF notation:

- `100` which is `digit_nonzero digit_nonzero digit_nonzero`
- `.412` which is `floating_part`
- `100.412` which is `digit_nonzero digit_nonzero digit_nonzero floating_part`

## Creating the Tree-Sitter Grammar

Okay, now we can finally get to the interesting stuff. We will translate the following BNF syntax into a tree-sitter parser that can parse this syntax:

```
format_string := text [ maybe_format text ] *
maybe_format := '{' '{' | '}' '}' | format
format := '{' [ argument ] [ ':' format_spec ] [ ws ] * '}'
argument := integer | identifier

format_spec := [[fill]align][sign]['#']['0'][width]['.' precision]type
fill := character
align := '<' | '^' | '>'
sign := '+' | '-'
width := count
precision := count | '*'
type := '' | '?' | 'x?' | 'X?' | identifier
count := parameter | integer
parameter := argument '$'

```

### Initialising the Project
