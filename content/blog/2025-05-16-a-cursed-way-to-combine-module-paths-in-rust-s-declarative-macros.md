---
title: A cursed way to combine module paths in Rust's declarative macros
date: 2025-05-16
readTime: true
---

Today, I ran into an interesting problem with a not-so-obvious solution: How do you concatenate path segments in Rust's declarative macros?

> **TLDR:**
>
> ```rust
> mod a {
>     pub mod b {
>         pub struct A;
>         pub struct B;
>     }
>     pub struct A;
>     pub struct B;
> }
>
> // Macro:
>
> macro_rules! compose_paths {
>     ($($segment:ident)::*) => {
>         use $($segment)::*::A;
>         use $($segment)::*::B;
>     }
> }
>
> // Invoke:
>
> compose_paths!(a);
> compose_paths!(a::b);
>
> // Expansion:
>
> use a::A;
> use a::B;
> use a::b::A;
> use a::b::B;
> ```

## Why I need to do this

In my project [ferrishot](https://github.com/nik-rev/ferrishot) I have two _very_ similar enums:

```rs
pub enum Command {
    ImageUpload(crate::image::action::Command),
    App(ui::app::Command),
    DebugOverlay(ui::debug_overlay::Command),
    KeybindingsCheatsheet(keybindings_cheatsheet::Command),
    Letters(ui::popup::letters::Command),
    Selection(ui::selection::Command),
}

pub enum KeymappableCommand {
    ImageUpload(crate::image::action::KeymappableCommand),
    App(ui::app::KeymappableCommand),
    DebugOverlay(ui::debug_overlay::KeymappableCommand),
    KeybindingsCheatsheet(keybindings_cheatsheet::KeymappableCommand),
    Letters(ui::popup::letters::KeymappableCommand),
    Selection(ui::selection::KeymappableCommand),
}
```

Each `Command` and `KeymappableCommand` pair is created by a macro in their specific module.

---

`KeymappableCommand` is almost the same as `Command`, but it has additional fields representing the keystrokes required to invoke this command.

This enum is used to parse the [KDL](https://kdl.dev/) config file using [knus](https://github.com/TheLostLambda/knus):

```json
keys {
  exit wait=10s key=<esc>
  copy-to-clipboard key=<enter>
  save-screenshot mod=ctrl key=s
}
```

By parsing that we will have something like this:

```rust
use crate::image::action::KeymappableCommand;

vec![
  KeymappableCommand::Exit {
    wait: Duration::from_seconds(10),
    key: Key::Escape,
    mods: None
  },
  KeymappableCommand::CopyToClipboard {
    key: Key::Enter,
    mods: None
  },
  KeymappableCommand::SaveScreenshot {
    key: Key::Character('s'),
    mods: Some(Modifier::CTRL)
  },
]
```

What we actually store is a `HashMap<KEYS, Command>` where `Command` is a version of `KeymappableCommand` that excludes the `key` and `mods` field, where `KEYS` is a tuple of said `(key, mods)`.

This allows us to retrieve the correct `Command` for any given key sequence in `O(1)` time.

Each module has its own pair of `(KeymappableCommand, Command)`, and then there are 2 separate enums at the root of the crate: `crate::KeymappableCommand` and `crate::Command` which _compose_ all of the other `KeymappableCommand`s and `Command`s from other module.

## The naive approach

In order to create a macro that lets me define the following:

```rs
pub enum Command {
    ImageUpload(crate::image::action::Command),
    App(ui::app::Command),
    Letters(ui::popup::letters::Command),
}

pub enum KeymappableCommand {
    ImageUpload(crate::image::action::KeymappableCommand),
    App(ui::app::KeymappableCommand),
    Letters(ui::popup::letters::KeymappableCommand),
}
```

As follows, for instance:

```rs
declare_commands! {
    ImageUpload(crate::image::action),
    App(ui::app),
    Letters(ui::popup::letters)
}
```

I need to just write the path once, then concatenate it with the item I want to use.
I initially tried this:

```rust
// surely, this will work right?
macro_rules! declare_commands {
  (
    $(
      $Variant:ident($path:path)
    ),*
  ) => {
    pub enum Command {
      $(
        $Variant($path::Command)
      ),*
    }

    pub enum KeymappableCommand {
      $(
        $Variant($path::KeymappableCommand)
      ),*
    }
  }
}
```

It feels like it should work. But specifically, this part is not valid Rust:

```rust
$path::Command
$path::KeymappableCommand
```

But an attempt to compile the above results in an error:

```rust
error: missing angle brackets in associated item path
  --> src/main.rs:30:18
   |
30 |           $Variant($path::Command)
   |                    ^^^^^
...
42 | / declare_commands! {
43 | |    ImageUpload(crate::image::action),
44 | |    App(ui::app),
45 | |    Letters(ui::popup::letters)
46 | | }
   | |_- in this macro invocation
   |
   = note: this error originates in the macro `declare_commands` (in Nightly builds, run with -Z macro-backtrace for more info)
help: types that don't start with an identifier need to be surrounded with angle brackets in qualified paths
   |
30 |         $Variant(<$path>::Command)
   |                  +     +

error: missing angle brackets in associated item path
  --> src/main.rs:36:18
   |
36 |           $Variant($path::KeymappableCommand)
   |                    ^^^^^
...
42 | / declare_commands! {
43 | |    ImageUpload(crate::image::action),
44 | |    App(ui::app),
45 | |    Letters(ui::popup::letters)
46 | | }
   | |_- in this macro invocation
```

The suggestion to add `< >` is incorrect here, as that is not valid syntax for referencing items in modules.

If we try the advice, we get another error:

```rust
error[E0573]: expected type, found module `crate::image::action`
  --> src/main.rs:43:16
   |
43 |    ImageUpload(crate::image::action),
   |                ^^^^^^^^^^^^^^^^^^^^ not a type

error[E0573]: expected type, found module `ui::app`
  --> src/main.rs:44:8
   |
44 |    App(ui::app),
   |        ^^^^^^^ not a type

error[E0412]: cannot find type `letters` in module `ui::popup`
  --> src/main.rs:45:23
   |
45 |    Letters(ui::popup::letters)
   |                       ^^^^^^^ not found in `ui::popup`

Some errors have detailed explanations: E0412, E0573.
For more information about an error, try `rustc --explain E0412`.
error: could not compile `macro_example` (bin "macro_example") due to 3 previous errors
```

Composing path segments like this does not have an obvious solution. I initially tried the [paste](https://crates.io/crates/paste) crate which lets you compose identifiers in this manner:

### Tried `paste!`

```rust
macro_rules! declare_commands {
  (
    $(
      $Variant:ident($path:path)
    ),*
  ) => {
    pub enum Command {
      $(
        $Variant(paste! {[<$path::Command>]})
      ),*
    }

    pub enum KeymappableCommand {
      $(
        $Variant(paste! {[<$path::KeymappableCommand>]})
      ),*
    }
  }
}
```

But `paste!` does not work for composing paths like that.

```rust
error: expected identifier after `:`
  --> src/main.rs:44:22
   |
44 |    ImageUpload(crate::image::action),
   |                      ^

error: expected identifier after `:`
  --> src/main.rs:45:11
   |
45 |    App(ui::app),
   |           ^

error: expected identifier after `:`
  --> src/main.rs:46:15
   |
46 |    Letters(ui::popup::letters)
   |               ^

error: could not compile `macro_example` (bin "macro_example") due to 6 previous errors
```

## The Solution

If we look at what a path is, it's just identifiers (`ident`) separated by double-colon `::`:

```rust
path::to::some_module
```

You can represent the above using the following macro specifier:

```rust
$(
  $segment:ident
)::*
```

- `$( ... )*` denotes a repetition
- `$( ... )SEPARATOR*` denotes a repetition, but we have to insert the `SEPARATOR` in-between each repetition.

In `path::to::some_module`, it would parse as follows:

```rust
$segment // `path`
:: // `SEPARATOR`
$segment // `to`
:: // `SEPARATOR`
$segment // `some_module`
```

Then, using `$($segment)::*` in a similar fashion _expands_ this repetition to the path:

```rust
path // `$segment`
:: // `SEPARATOR`
to // `$segment`
:: // `SEPARATOR`
some_module // `$segment`
```

And what's interesting is that we can compose _this_ with another double-colon `::` followed by an identifier (`ident`) like this:

```rust
$($segment)::*::some_identifier
```

The above (with `path::to::some_module` as `$($segment)::*`) will expand to this:

```rust
path::to::some_module::some_identifier
```

This feels like a "cheat", I have looked for a long time and haven't found anyone talk about this.
So the correct version of the macro I tried to make is this:

```rust
macro_rules! declare_commands {
  (
    $(
      $Variant:ident($($segment:ident)::*)
    ),*
  ) => {
    pub enum Command {
      $(
        $Variant($($segment)::*::Command)
      ),*
    }

    pub enum KeymappableCommand {
      $(
        $Variant($($segment)::*::KeymappableCommand)
      ),*
    }
  }
}
```

The full code can be seen on GitHub.
