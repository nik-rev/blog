# Proposal

## Problem statement

The range types that have both a start and an end (e.g. `Range<Idx>`) only take a single generic parameter `Idx` which must be the same for both ends. This limits the APIs that we can create.

<!-- Start with a concise description of the problem you're trying to solve. Don't talk about possible solutions yet. -->

## Motivating examples or use cases

You are creating a data structure called `Text` for use in text editors, it represents the contents of a file.

```rs
struct Text(String);
```

For extra type safety, you have 3 newtypes around `usize` that represent various byte offsets into the `Text`:
- `CharIndex` always represents an in-bounds byte index which lies on the start of a character (the left character boundary)
- `GraphemeIndex` is a `CharIndex` that is also guaranteed to lie on the start of a grapheme cluster. It can be always converted into `CharIndex` as all grapheme boundaries are char boundaries
- `LineIndex` is a `GraphemeIndex` that is guaranteed to be directly after a line ending. It can always be converted into `CharIndex` or `GraphemeIndex`.

The definitions, and `From` impls are as follows:

```rs
struct CharIndex(usize);
struct GraphemeIndex(CharIndex);
struct LineIndex(GraphemeIndex);

impl From<GraphemeIndex> for CharIndex { /* ... */ }

impl From<LineIndex> for CharIndex { /* ... */ }
impl From<LineIndex> for GraphemeIndex { /* ... */ }
```

These 3 index types all internally represent byte offsets into the `Text` that have certain guarantees.

Suppose the `Text` has a `slice` method that returns a sub-range of the text:

```rs
impl Text {
    /// Returns a sub-slice of the `Text`.
    fn slice<R: RangeBounds<CharIndex>>(&self, range: R) -> &str { /* ... */ }
}
```

Because `GraphemeIndex` and `LineIndex` also fit the requirement of lying on a character index, we should be able to a range of them too. Hence to make our API more ergonomic we might use the `Into<CharIndex>` trait bound:

```rs
impl Text {
    /// Returns a sub-slice of the `Text`.
    fn slice<C: Into<CharIndex>, R: RangeBounds<C>>(&self, range: R) -> &str { /* ... */ }
}
```

This allows `slice` to be called with `impl RangeBounds<GraphemeIndex>`, `impl RangeBounds<CharIndex>` and `impl RangeBounds<LineIndex>`, making our API more ergonomic:

```rs
let text: Text;
let from: CharIndex;
let to: CharIndex;

// works
text.slice(from..to);

let from: GraphemeIndex;
let to: GraphemeIndex;

// works
text.slice(from..to);
```

However, it would be impossible to call `slice` with ends that are of different types, making our API not as ergonomic as it could be:

```rs
let text: Text;
let from: CharIndex;
let to: GraphemeIndex;

// ERROR! Both of them must be the same type, even though they are both `impl Into<CharIndex>`
// text.slice(from..to);

// Instead, we must manually convert them
text.slice(from..to.0);
```

Our API could be made more ergonomic if the constraint of both ends requiring to be the same type was to be removed. Currently, this is impossible because `RangeBounds` takes a single generic parameter.

<!-- Next add any motivating examples. Examples should ideally be real world examples, or minimized versions of the real world example in scenarios where the motivating code is not open source. Don't propose changes you think might *hypothetically* be useful; real use cases help make sure we have the right design. -->

## Solution sketch

I propose adding a new type parameter to the `RangeBounds` trait:

```rs
// OLD
pub trait RangeBounds<T> {
    fn start_bound(&self) -> Bound<&T>;
    fn end_bound(&self) -> Bound<&T>;
}

// NEW
pub trait RangeBounds<Start, End = Start> {
    fn start_bound(&self) -> Bound<&Start>;
    fn end_bound(&self) -> Bound<&End>;
}
```

This new type parameter is optional, and defaults to whatever the first type parameter is.
This means it won't be a breaking change, and users can specify custom `End` type parameter when they want to.

With that solution, The `slice` method of `Text` can be made more ergonomic by allowing the `From` and `End` to be different:

```rs
impl Text {
    /// Returns a sub-slice of the `Text`.
    fn slice<From: Into<CharIndex>, To: Into<CharIndex>, R: RangeBounds<From, To>>(&self, range: R) -> &str { /* ... */ }
}
```

Which makes our API nicer, as we no longer have to manually convert:

```rs
let text: Text;
let from: CharIndex;
let to: GraphemeIndex;

// This works now! `from` and `to` are different types, but that's permitted.
text.slice(from..to);
```

### Full API Change

This shows all the changes I propose making to existing range types, which are all backward-compatible.

```rs
// OLD
pub trait RangeBounds<T> {
    fn start_bound(&self) -> Bound<&T>;
    fn end_bound(&self) -> Bound<&T>;
}

// NEW
pub trait RangeBounds<Start, End = Start> {
    fn start_bound(&self) -> Bound<&Start>;
    fn end_bound(&self) -> Bound<&End>;
}

// OLD
pub struct Range<Idx> {
    pub start: Idx,
    pub end: Idx,
}

// NEW
pub struct Range<Start, End = Start> {
    pub start: Start,
    pub end: End,
}

// OLD
pub struct RangeInclusive<Idx> { /* private fields */ }
pub struct RangeInclusive<Start, End = Start> { /* private fields */ }

// NOTE: also rename the generic type parameter of `RangeFrom`, `RangeTo` and `RangeToInclusive`
```

The new trait implementations of `RangeBounds` will be as follows:

```rs
// OLD
impl<T> RangeBounds<T> for (Bound<T>, Bound<T>) { /* ... */ }
// NEW
impl<Start, End> RangeBounds<Start, End> for (Bound<Start>, Bound<End>) { /* ... */ }

// OLD
impl<T> RangeBounds<T> for RangeFrom<T> { /* ... */ }
// NEW
impl<Start, End> RangeBounds<Start, End> for RangeFrom<Start> { /* ... */ }

// OLD
impl<T> RangeBounds<T> for RangeInclusive<T> { /* ... */ }
// NEW
impl<Start, End> RangeBounds<Start, End> for RangeInclusive<Start, End> { /* ... */ }

// OLD
impl<T> RangeBounds<T> for Range<T> { /* ... */ }
// NEW
impl<Start, End> RangeBounds<Start, End> for Range<Start, End> { /* ... */ }

// OLD
impl<T> RangeBounds<T> for RangeTo<T> { /* ... */ }
// NEW
impl<Start, End> RangeBounds<Start, End> for RangeTo<End> { /* ... */ }

// OLD
impl<T> RangeBounds<T> for RangeToInclusive<T> { /* ... */ }
// NEW
impl<Start, End> RangeBounds<Start, End> for RangeToInclusive<End> { /* ... */ }

// OLD
impl<T: ?Sized> RangeBounds<T> for RangeFull { /* ... */ }
// NEW
impl<Start: ?Sized, End: ?Sized> RangeBounds<Start, End> for RangeFull { /* ... */ }
```

<!--
If you have a sketch of a concrete solution, please include it here. You don't have to have all the details worked out, but it should be enough to convey the idea.

If you want to quickly check whether *any* some solution to the problem would be acceptable, you can delete this section.
-->

## Alternatives

You can express this using existing code, but this requires much more boilerplate than the range syntax would need.

### Pass 2 arguments `from` and `to`

Instead of using the range syntax, specify the bounds explicitly:

```rs
impl Text {
    /// Returns a sub-slice of the `Text`.
    fn slice<From: Into<CharIndex>, To: Into<CharIndex>>(&self, from: Bound<From>, to: Bound<To>) -> &str { /* ... */ }
}
```

The disadvantage here is we can't use Rust's range syntax, but also having to import `Bounds` and wrap our types with it:

```rs
use std::ops::Bound;

let text: Text;
let from: CharIndex;
let to: GraphemeIndex;

// much noisier
text.slice(Bound::Inclusive(from), Bound::Exclusive(to));
```

<!--
Please also discuss alternative solutions to the problem. Include any reasoning for why you didn't suggest those as the primary solution.

Could this be written using existing APIs? If so, roughly what would that look like? Why does it need to be different? Could this be done as a crate on crates.io?
-->

## Links and related work

*No response*

<!-- Provide links to any <https://internals.rust-lang.org> thread(s), github issues, approaches to this problem in other languages/libraries, or similar supporting information. -->

## What happens now?

This issue contains an API change proposal (or ACP) and is part of the libs-api team [feature lifecycle]. Once this issue is filed, the libs-api team will review open proposals as capability becomes available. Current response times do not have a clear estimate, but may be up to several months.

[feature lifecycle]: https://std-dev-guide.rust-lang.org/development/feature-lifecycle.html

## Possible responses

The libs team may respond in various different ways. First, the team will consider the *problem* (this doesn't require any concrete solution or alternatives to have been proposed):

- We think this problem seems worth solving, and the standard library might be the right place to solve it.
- We think that this probably doesn't belong in the standard library.

Second, if there's a concrete solution:

- We think this specific solution looks roughly right, approved, you or someone else should implement this. (Further review will still happen on the subsequent implementation PR.)
- We're not sure this is the right solution, and the alternatives or other materials don't give us enough information to be sure about that. Here are some questions we have that aren't answered, or rough ideas about alternatives we'd want to see discussed.

