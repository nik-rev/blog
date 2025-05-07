---
title: "Fun with traits, generics and complex types in Rust: Pass either a new value or compute the new value from a closure to a method"
date: 2025-05-7
readTime: true
---

I have a type `Person` as follows:

```rs
struct Person {
  age: u8,
}
```

I would like to have an API that allows me to update its `age` field either by specifying a concrete value or updating it with a closure:

```rs
let person = Person { age: 24 };
let years = 11;

// set its age to a value
assert_eq!(person.age(years), Person { age: 11 });

// update its age by passing a closure
assert_eq!(person.age(|y| y + years), Person { age: 24 + 11 });
```

I know that you can do this sort of crazy, beautiful type-level dark magic using traits. I'm pretty new to Rust type-fu, but I had a go at creating an `Updater` trait that can do this:

```rs
trait Updater {
  fn update(self, current: u8) -> u8;
}

impl Updater for u8 {
  fn update(self, _current: u8) -> u8 {
    self
  }
}

impl<F: FnOnce(u8) -> u8> Updater for F {
  fn update(self, current: u8) -> u8 {
    self(current)
  }
}
```

This is a generic trait with a blanket impl for all `FnOnce` closures that take 1 parameter `u8` and return `u8`.

I can then create my method like so:

```rs
impl Person {
  fn age<F: Updater>(mut self, f: F) -> Person {
    self.age = f.update(self.age);
    self
  }
}
```

And, it works! But, what if instead my `Person` is a more complex type:

```rs
struct Person {
  age: u8,
  name: String,
  favorite_color: Color,
}
```

I want to create a similar updater method for each field, I don't want to create a new trait for _each field_, that would totally **not** be worth it.

I'd just like to have 1 trait which takes a generic type parameter, which would allow me to create those methods like so:

```rs
impl Person {
  fn age<F: Updater<u8>>(mut self, f: F) -> Person {
    self.age = f.update(self.age);
    self
  }

  fn name<F: Updater<String>>(mut self, f: F) -> Person {
    self.name = f.update(self.name);
    self
  }

  fn favorite_color<F: Updater<Color>>(mut self, f: F) -> Person {
    self.favorite_color = f.update(self.favorite_color);
    self
  }
}
```

To achieve the above, I tried making my trait implementation generic.

```rs
impl<T> Updater<T> for T {
    fn apply(self, _current: T) -> T {
        self
    }
}

impl<T, F: FnOnce(T) -> T> Updater<T> for F {
    fn apply(self, current: T) -> T {
        self(current)
    }
}
```

Either of them work, but not both at the same time. Rust says that the trait implementations are conflicting. I learned that this specific problem would be solved by something called [specialization](https://github.com/rust-lang/rust/issues/31844).

Essentially, my generic trait blanket implementations don't work because the set of types that are `FnOnce(T) -> T` are _a subset of_ the set of types that are `T`.

Essentially, a type like `|x| x + 4` which is a closure `FnOnce(u8) -> u8`, gets both implementations:

- `impl<T> Updater<T> for T`
- `impl<T, F: FnOnce(T) -> T> Updater<T> for F`

And this is a problem in Rust because it can't choose a "more specific" implementation and instead the compiler thinks `|x| x + 4` has 2 implementations of the same trait which should not be possible.

This is where specialization would come in to help. At the moment there does not seem to be a sound implementation of specialization and it may take a lot of work to get there.

Thankfully, we _don't_ need specialization here! What we can instead do, is guarantee to the type checker that the two blanket implementations never overlap by introducing generic parameters that are disjoint from one another.

We can do that like this:

```rs
trait Updater<T, Marker> {
    fn apply(self, t: T) -> T;
}

// This type can never be constructed. It is only a type-level marker
enum AbsoluteMarker {}
impl<T> Updater<T, AbsoluteMarker> for T {
    fn apply(self, _: T) -> T { self }
}

// This type can also never be constructed. It is only a type-level marker
enum RelativeMarker {}
impl<T, F: FnOnce(T) -> T> Updater<T, RelativeMarker> for F {
    fn apply(self, t: T) -> T { (self)(t) }
}

struct Person { age: u8 }

impl Person {
    fn age<Marker, U: Updater<u8, Marker>>(mut self, updater: U) -> Self {
        self.age = updater.apply(self.age);
        self
    }
}
```

Because `AbsoluteMarker` and `RelativeMarker` **never overlap**, the Rust compiler is able to reason that the two trait implementations also do not overlap.

We would expect to have to call the `age` method like this:

```rs
person.age::<AbsoluteMarker>(4);
person.age::<RelativeMarker>(|y| y + 4);
```

But we don't need to do that! Rust's type inference system is smart enough to infer these generics for us.

```rs
// This works!
person.age(4);
person.age(|y| y + 4);
```

Thanks to [u/xr2279](https://www.reddit.com/r/rust/comments/1jxxu5a/comment/mmuis93/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) for showing me how to do that.

## Should you do this?

Probably not. It is fairly complex and it may just be better to write the 2 methods. It depends on your need, of course. But you can accomplish the above with a public field:

```rs
person.age = 4;
person.age += 4;
```

The way that _we_ did it allows us to write the updates in a functional style, so maybe it's something you might prefer when chaining many update methods together.

```rs
rectangle.x(4).y(|y| y + 1100).width(800).height(|h| h - 100)
```

It's very fun to explore the limitations of Rust's type theory like this. I had zero ideas you could "cheat" like that with generic types that never overlap, only used to guide Rust's type inference system. Pretty cool!
