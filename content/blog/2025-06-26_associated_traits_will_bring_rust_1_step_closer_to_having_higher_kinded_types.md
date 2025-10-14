---
title: Associated traits will bring Rust 1 step closer to having higher-kinded types
---

The `Functor` trait is an abstraction for the `map` function which is commonly seen on `Option::map`, `Iterator::map`, `Array::map`.

`impl Functor for Collection` would mean you can get from a `Collection<A>` to `Collection<B>` by calling `map` and supplying a closure with type `A -> B`.

`Functor` requires higher-kinded types, as you cannot implement traits on collections directly. However, we can think of a workaround by using generic associated types:

```rust
trait Functor<A> {
    type Collection<T>;

    fn fmap<B, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B>;
}
```

In the above, the `A` in `Functor<A>` represents the input, and `B` represents the output. `Collection<T>` is a generic associated type representing the collection.

Here's how you could implement it for a `Vec<T>` in stable Rust today:

```rust
impl<A> Functor<A> for Vec<A> {
    type Collection<T> = Vec<T>;

    fn fmap<B, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B> {
        self.into_iter().map(f).collect()
    }
}
```

It works for `Vec<T>`, but if you try to implement it for a `HashSet<T>`, you'll run into a problem:

```rust
impl<A: Hash + Eq> Functor<A> for HashSet<A> {
    type Collection<T> = HashSet<T>;

    fn fmap<B, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B> {
        self.into_iter().map(f).collect()
    }
}
```

In order for the above code to compile, `B` needs to be `Hash + Eq` as `HashSet<T> where T: Hash + Eq`.

If you try to add this constraint to B, you won't be able to because the signature of `fmap` in the `trait` definition and `impl for HashSet` will be mismatched:

```rust
// trait Functor<A>
fn fmap<B, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B>

// impl<A: Hash + Eq> Functor<A> for HashSet<A>
fn fmap<B: Hash + Eq, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B>
```

How do this solve this? Creating the `Functor` trait in today's rust is not possible due to the above limitations. Rust does not have "higher-kinded" types.

However, with a natural extension to the language we can think about the "associated trait" feature that would fit into Rust.

This feature will allow you to write a `trait` bound inside of a `trait`, which the implementor will need to fill. It is similar to the "associated types".

With associated traits, we can define the `Functor` trait as follows:

```rust
trait Functor<A> {
    type Collection<T>;
    trait Constraint;

    fn fmap<B: Self::Constraint, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B>;
}
```

In the above, we declare a `trait Constraint` which will need to be provided by the implementor of the caller.

The generic `B` now must satisfy the bound. `B: Self::Constraint`. This allows us to implement `Functor` for `HashSet`:

```rust
impl<A: Hash + Eq> Functor<A> for HashSet<A> {
    type Collection<T> = HashSet<T>;
    trait Constraint = Hash + Eq;

    fn fmap<B: Self::Constraint, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B> {
        self.into_iter().map(f).collect()
    }
}
```

Both `A: Hash + Eq` and `B: Hash + Eq`, so this code will compile.

The `impl Functor for Vec<T>` does not need to provide any constraint, but it must be included. In `Vec<T>` the `T` has no trait constraints. How do we work around this?

Define a `AnyType` trait which is implemented for all types:

```rust
trait AnyType {}
impl<T> AnyType for T
```

This allows us to implement `Functor` for `Vec` again:

```rust
impl<A> Functor<A> for Vec<A> {
    type Collection<T> = Vec<T>;
    trait Constraint = AnyType;

    fn fmap<B: Self::Constraint, F: Fn(A) -> B>(self, f: F) -> Self::Collection<B> {
        self.into_iter().map(f).collect()
    }
}
```

Because the `AnyType` associated trait is implemented for all types, `Vec<T> where T: AnyType` is identical to `Vec<T>`. It is a bit wordier, but it gives us the flexibility of implementing the `Functor` trait for any type.

Effectively, this gives us higher-kinded types in Rust. When you see `impl<A> Functor<A> for Vec<A>`, `Vec<A>` is the *output* type.

If you want to learn more about this feature, as well as extra use-cases, check out the [issue](https://github.com/rust-lang/rfcs/issues/2190)! There is currently no RFC to add it.
