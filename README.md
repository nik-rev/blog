Hi! My favorite programming language is:

```rust
fn you_guessed_it() -> impl Debug {
    ..=..=.. ..    .. .. .. ..    .. .. .. ..    .. .. .. ..
    ..=.. ..=..    .. .. .. ..    .. .. .. ..    .. ..=.. ..
    ..=.. ..=..    ..=.. ..=..    .. ..=..=..    ..=..=..=..
    ..=..=.. ..    ..=.. ..=..    ..=.. .. ..    .. ..=.. ..
    ..=.. ..=..    ..=.. ..=..    .. ..=.. ..    .. ..=.. ..
    ..=.. ..=..    ..=.. ..=..    .. .. ..=..    .. ..=.. ..
    ..=.. ..=..    .. ..=..=..    ..=..=.. ..    .. ..=..=..
}
```

# 📦 Crates

My contributions to the Rust ecosystem.

## `derive_aliases` [![github](https://img.shields.io/github/stars/nik-rev/derive-aliases)](https://github.com/nik-rev/derive-aliases)

Custom `#[derive]` aliases. Write this:

```rust
#[derive(Debug, ..Ord, ..Copy)]
//              ^^^^^^^^^^^^^
//              aliases
struct User;
```

which expands to this:

```rust
[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Copy, Clone)]
//             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//             expanded
struct User;
```

## `docstr` [![github](https://img.shields.io/github/stars/nik-rev/docstr)](https://github.com/nik-rev/docstr)

Ergonomic multi-line string literals, even composes with any macro like `format!`.

```rust
use docstr::docstr;

let hello_world_in_c: &'static str = docstr!(
    /// #include <stdio.h>
    ///
    /// int main(int argc, char **argv) {
    ///     printf("hello world\n");
    ///     return 0;
    /// }
);

assert_eq!(hello_world_in_c, r#"#include <stdio.h>

int main(int argc, char **argv) {
    printf("hello world\n");
    return 0;
}"#)
```

## `culit` [![github](https://img.shields.io/github/stars/nik-rev/culit)](https://github.com/nik-rev/culit)

Lets you define custom literals. Like literals for `Duration`:

```rust
#[culit]
fn main() {
    assert_eq!(
        100d + 11h + 8m + 7s,
        Duration::from_secs(100 * 60 * 60 * 24)
        + Duration::from_secs(11 * 60 * 60)
        + Duration::from_secs(8 * 60)
        + Duration::from_secs(7)
    );
}
```

Fully custom, can be whatever you want. Like `10nzusize` which produces `NonZeroUsize` and compile errors if it is `0`.

## `simply_colored` [![github](https://img.shields.io/github/stars/nik-rev/culit)](https://github.com/nik-rev/culit)

Simplest crate in existence for terminal styles.

```rust
use simply_colored::*;

println!("{BLUE}{BOLD}Simply colored!")
```

## Other crates

- `collection-macro` which provides the general-purpose `seq![]` and `map! {}` macros for creating collections [![github](https://img.shields.io/github/stars/nik-rev/collection-macro)](https://github.com/nik-rev/collection-macro/tree/main)
- `ignorable` to derive standard library traits, with the ability to ignore a field [![github](https://img.shields.io/github/stars/nik-rev/ignorable)](https://github.com/nik-rev/ignorable)
- `displaystr` provides a completely novel way to implement the `Display` trait [![github](https://img.shields.io/github/stars/nik-rev/displaystr)](https://github.com/nik-rev/displaystr)

# ⚒️ Projects

## countryfetch [![github](https://img.shields.io/github/stars/nik-rev/countryfetch)](https://github.com/nik-rev/countryfetch)

Like Neofetch but for your country

## ferrishot [![github](https://img.shields.io/github/stars/nik-rev/ferrishot)](https://github.com/nik-rev/ferrishot)

It's a screenshot app written in Rust!

## patchy [![github](https://img.shields.io/github/stars/nik-rev/patchy)](https://github.com/nik-rev/patchy)

If you fork a project just to merge PRs you like, you might find `patchy` useful

## dots [![github](https://img.shields.io/github/stars/nik-rev/dots)](https://github.com/nik-rev/dots)

Incredibly simple dotfiles manager

<!-- Hi, I love programming in Rust! I use Helix and [contribute](https://github.com/helix-editor/helix/pulls?q=is%3Apr%20sort%3Areactions-%2B1-desc%20author%3Anik-rev%20) to it. -->

<!-- I maintain a bunch of open source projects written in Rust: -->

<!-- - [`ferrishot`](https://github.com/nik-rev/ferrishot) is a screenshot app written in Rust. Inspired by flameshot! -->
<!-- - [`countryfetch`](https://github.com/nik-rev/countryfetch) is a Neofetch-inspired command line tool that shows beautiful ASCII art of your country's flag along with info -->
<!-- - [`patchy`](https://github.com/nik-rev/patchy) is a command line app that makes it easy to declaratively manage personal forks by automatically merging pull requests. -->

<!-- As well as: -->

<!-- - [`ghost-text.hx`](https://github.com/nik-rev/ghost-text.hx): a plugin that allows you to edit text inputs in the browser from Helix -->
<!-- - [`brightness-cli`](https://github.com/nik-rev/brightness-cli): CLI to control brightness -->
<!-- - [`simply-colored`](https://github.com/nik-rev/simply-colored): simplest and yet ergonomic crate for colors in the terminal -->
<!-- - [`tree-sitter-rust-format-args`](https://github.com/nik-rev/tree-sitter-rust-format-args): syntax highlighting for Rust's string interpolation macros like `format!("hi {name}")` -->
<!-- - [`helix-golf`](https://github.com/nik-rev/helix-golf): showcase of efficient text refactoring using the Helix editor -->
<!-- - [`og-image-generator`](https://github.com/nik-rev/og-image-generator): generate OpenGraph images from HTML -->
<!-- - [`carbon`](https://github.com/nik-rev/carbon): A [zola](https://github.com/getzola/zola) theme inspired by simplicity -->

<!-- Blog: [nikrev.com](https://nikrev.com) -->
