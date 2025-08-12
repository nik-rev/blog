---
title: I made a macro that generates macros for my proc macro
draft: true
---

I developed a serde-like proc macro [`oh_my_toml`](...) -- it allows deserializing TOML like serde, but unlike serde it supports:

- Reporting as many errors as possible
- Beautiful, <span class="rainbow-text">colorful</span> error output with *way better* diagnostic messages
- Error recovery

  <!-- For example, a text editor might use this - where you might have 1 invalid config option but that doesn't mean you want the entire config to fail - the config option might use some default value instead of [breaking everything](https://github.com/helix-editor/helix/discussions/12342) :) -->

An example config using this crate:

```rs
use oh_my_toml::Deserialize;

#[derive(Deserialize)]
enum Theme {
  Dark,
  Light
}

#[derive(Deserialize)]
struct Config {
  auto_save: bool,
  // If this field is missing, uses `u64::default()` = `0`
  #[toml(default)]
  completion_timeout: u64,
  // If the field is invalid, uses the supplied default value
  #[toml(recover = Theme::Light)]
  theme: Theme,
}
```

The above can deserialize the following TOML file:

```toml
auto_save = false
theme = "ligth"
```

Into the following:

```rs
Config {
  auto_save: false,
  // Used `u64::default()`
  completion_timeout: 0,
  // Input was malformed - so we'll report an error
  // and use `Theme::Light` as the default
  theme: Theme::Light
}
```

And *also* log an error:

<!-- TODO: Update with a real diagnostic -->

```
help: did you mean "light"?
```

Pretty cool, right? I have a [separate post](TODO) about this crate, if you're interested.

## The Problem

My derive macro supports many different attributes, for instance, all of these can be applied to a `struct` or `enum` when `#[derive(Deserialize)]` is used:

```rs
// Deserialize as the inner variant
// (applies to structs with 1 field)
#[toml(transparent)]
// rename this unit struct
#[toml(rename)]
// rename all fields of struct to a naming convention,
// like `"PascalCase"`
#[toml(rename_all)]
// rename all fields of enum variants to a naming convention,
// like `"PascalCase"`
#[toml(rename_all_fields)]
// apply `#[toml(default)]` to all fields
#[toml(default)]
// apply `#[toml(default::error)]` to all fields
#[toml(default::error)]
// apply `#[toml(recover)]` to all fields
#[toml(recover)] 
```

However, depending on the actual input that we are deserializing - only some of these attributes may be applicable.

For example, unit `struct`s like the following:


```rs
#[derive(Deserialize)]
#[toml(rename = "Bar")]
// This is a unit struct
struct Foo;

#[derive(Deserialize)]
struct Container {
  foo: Foo
}
```

Deserialize a single TOML string, with `Container` being able to deserialize the following TOML file:

```toml
foo = "Bar"
```

The only attribute that can be applied to a `struct` with no fields is `rename`. All the other 6 attributes **cannot** be applied.

This means, in my code I had to manually make sure each of the 6 fields are unset:

```rs
// A single arm of a much larger `match` expression
UnitStruct { ident, .. } => {
  // The only field that we don't error on is `input.rename`
  unset_or_err!(input.rename_all, err::RENAME_ALL);
  unset_or_err!(input.rename_all_fields, err::RENAME_ALL_FIELDS);
  unset_or_err!(input.transparent, err::TRANSPARENT);
  unset_or_err!(input.default, err::DEFAULT_ALL);
  unset_or_err!(input.default_error, err::DEFAULT_ALL);
  unset_or_err!(input.recover, err::DEFAULT_ALL);
}
```

<note>

Each constant in the `err` module is a `&str` for each attribute, telling the user under
which circumstances this attribute can be used:

```rs
pub const RENAME_ALL: &str = concat!(
    "attribute `rename_all` only applies to:\n",
    "- enum variants with named fields\n",
    "- structs with named fields\n",
    "- enums with at least 1 unit variant"
);
```

The `unset_or_err!` makes sure the flag argument isn't set. If it **is**, a `CompileError` is pushed into a `Vec<CompileError>`.

</note>

What's worse, is that I don't just have 1 branch. I have *many* branches, and each of them have specific requirements where only some of the flags are allowed to be set.

Specifying the flags that I *don't* support, on each branch got tedious really fast - anytime I wanted to add a new flag, I'd have to update **every single branch** to say "no, this flag isn't allowed here" except for the branches that *were*.

I want to solve this problem.

My idea is as follows: Instead of listing flags that I *don't* support, list flags that *are* supported - and if any flags are present when they're not supported an error should be automatically thrown.

This sounds *great* - except for 1 caveat. These "flags" are **not** runtime values. They're *fields* which are stored in a `struct`:

```rust
#[derive(FromDeriveInput, Debug)]
pub struct Input {
    pub ident: Ident,
    pub vis: Visibility,
    pub data: darling::ast::Data<InputVariant, InputField>,
    // All of our Flags
    pub transparent: Flag,
    pub rename_all: Flag,
    pub rename_all_fields: Flag,
    pub rename: Flag,
    pub default: Flag,
    pub default_error: Flag,
    pub recover: Flag,
}
```

I want the following API, using a macro:

```rs
validate_flags! {
  // `input` is the `Input` which contains all
  // of those fields with `Flag`s
  input,
  // Because of macro hygiene, we have to explicitly
  // provide the `Vec<CompileError>` that the macro
  // can push to
  errs,

  // Here's the really important part.
  //
  // A list of flags that are allowed.
  //
  // If any flags are set which aren't in this list
  // - a `CompileError` is created
  // for every single one
  //
  // For this validation in particular,
  // we only allow the `rename` flag
  allowed_flags = [rename]
}
```

Brute-forcing the macro was pretty easy. I

```rust
macro_rules! input_validator {
  (
    // The structure that contains every field
    $input:ident,
    // `Vec<CompileError>`
    $errs:ident,
    // A list of flags that we permit
    allowed_flags = $($allowed_flags:ident)*
  ) => {{
    // Put all of the flags in a HashSet so we can
    // check if they are allowed in O(1) time

    // (this will likely make the code slower than
    // if Vec was used and we did an O(n) iteration
    // for each check - due to CPU cache
    // locality and the fact that we have a very
    // small list of flags,
    // but I think using a HashSet better
    // conveys intent)
    let allowed_flags =
      std::collections::HashSet::from(
        [ $(stringify!($allowed_flags)),* ]
    );

    // If the flag is a disallowed flag,
    // => check if this flag is set
    if !allowed_flags.contains("transparent")
      && $input.transparent.is_set() {
      // In which case we throw a `CompileError`
      $errs.push(CompileError::new(
        $input.transparent.span(),
          // .span() => get position of the flag
          //            in the source file
        err::TRANSPARENT // error message
      ))
    }

    // Do the same for all 6 other flags ...

    if !allowed_flags.contains("default")
      && $input.default.is_set() {
      $errs.push(CompileError::new(
        $input.default.span(),
        err::DEFAULT
      ))
    }

    // (rest omitted for brevity)
  }}
}
```

That's quite verbose. We essentially duplicate every check for all of the fields. We have to repeat
the name of each field multiple times.

One more thing: I don't just have 1 of these structs with a bunch of `Flag`s in my proc macro. I have several of them, like 1 of them is for fields and 1 more is for variants.

So I'd need to define more than 1 of the above macros. This is a *perfect* use case for a macro: We will define a macro `create_validator` and call it each time we want one of those `validator` macros.

## Macro that generates macros

Here it is...

```rs
macro_rules! create_validator {
  (
    // A `$` token, because creating macros inside of
    // macros is ambiguous.
    //
    // So we have to do it this odd way, as there is no
    // way to "escape" a `$`
    $__dollar__:tt

    // Name of the macro that we want to create: like `input_validator!`
    $name:ident!

    // A list of fields that are `Flag`s on the given structure
    $($field:ident)*
  ) => {
    macro_rules! $name {
      (
        // This is the same as `$value:ident`
        $__dollar__ value:ident,
        // This is the same as `$errs:ident`
        $__dollar__ errs:ident,
        // This is the same as `$($allowed:ident)*`
        $__dollar__ ($__dollar__ allowed:ident) *
      ) => {{
        // The same HashSet as we had before
        let allowed_flags = std::collections::HashSet::from(
         // same as `$(stringify!($allowed)*)`
         [ $__dollar__ (stringify!($__dollar__ allowed)),* ]
        );

        // Create an single validation for each field
        $(
          if !allowed_flags.contains(stringify!($field))
           && $__dollar__ value.$field.is_set() {
            $errs.push(CompileError::new(
              $__dollar__ value.$field.span(),
              // Since Rust macros do not have a way
              // to change the case of identifiers,
              // we'll have to rename all constants
              // in the `err` modules to be
              // snake_case
              err::$field
            ))
          }
        )*
      }}
    }
  };
}
```

The above macro works, and it can be invoked like this:

```rs
define_flag_checker! {
  // Dollar token, this is a HACK that allows
  // creating one macro inside of another
  $
 
  // Name of the macro this macro generates
 
  input_validator!
 
  // Flag Fields that exist on `Input`
  rename rename_all_fields rename_all
  default_error default
  recover
  transparent
}
```

After this, we'll have an `input_validator!` macro that we can invoke just as before, replacing code like this:

```rs
unset_or_err!(input.rename_all, err::RENAME_ALL);
unset_or_err!(input.rename_all_fields, err::RENAME_ALL_FIELDS);
unset_or_err!(input.transparent, err::TRANSPARENT);
unset_or_err!(input.default, err::DEFAULT_ALL);
unset_or_err!(input.default_error, err::DEFAULT_ALL);
unset_or_err!(input.recover, err::DEFAULT_ALL);
```

With:

```rs
validate_flags!(input, errs, [rename]);
```

For each flag out of these that is set:

- `rename_all_fields`
- `rename_all`
- `default_error`
- `default`
- `recover`
- `transparent`

An error will be generated.
