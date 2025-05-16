---
title: I thought TypeScript's type system was powerful. Until I tried Rust.
---

My first language was JavaScript. Then TypeScript. TypeScript caught many bugs which I've experienced with JS, such as spending 2 hours debugging because I accidentally wrote "false" instead of false. TypeScript caught these bugs. I was amazed by how "powerful" its type system is

Then I tried Rust. I've been programming in Rust for about 2 months now.

Rust's type system to TypeScript is like TypeScript's type system to JavaScript. I wouldn't have believed these worlds before Rust. Having a type system which actually co-exists with your code is really, really delightful.

When a value claims to have some type in TypeScript, you can't be sure that it actually is that type. Any of the 100s of function calls used to derive this value may have used an `as` assertion, and if this assertion is wrong then the type is invalid. If an invalid type is somewhere deep enough it can spread like the plague, but you won't know.

TypeScript's type inference compared to Rust's is weaker. This means there are often situations where you're forced to use an `as` assertion. And that's pretty bad, because now you've introduced an extra chance for incorrect types to be introduces and proliferate in your code

When people said "haha using JavaScript on the backend", I thought TypeScript is the solution. But if you want to be certain your program will work correctly you'll have to be extra careful when using TypeScript, values can claim to be some type while not actually being that type.

In some sense, using an `as` assertion is similar to using `unsafe` in Rust. You're making a promise that your program upholds some invariants that the compiler can't infer itself. And the Rust community places a lot of importance on properly documenting why certain invariants are upheld for `unsafe` blocks. But `as` are not treated nearly the same, they're often just used without a second thought. And that's a problem

Having a strong type system is one of the most important factors about a language, to me at least. Type systems allow you to express the purpose of your program in a way that your code never will.

I am super grateful to Rust and Haskell for opening my eyes on type systems. I'm also super grateful for all the work done on the TypeScript compiler. While it's far from perfect, I understand it's the way it is and has to be that way. There's not much TS can do since it compiles to the same old JavaScript. TypeScript it is an essential layer of protection on top of your JavaScript.

But I'm really looking forward to a future where we don't need to use TypeScript anymore, and Rust frameworks such as Dioxus can become popular like Next.js (I can dream...)
