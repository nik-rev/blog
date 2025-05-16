---
title: I gave Helix a try and now I can't see myself using any other text editor
readTime: true
---

I've been using VSCode for several months when I first started programming. It was fine, but I was tired of using like 40 extensions and not using any of them to their capabilities. I wanted something new.

<!--more-->

With VSCode it felt like I had no control over my editor and I didn't have an idea of how things were going on. With VSCode I feel like a consumer that just installs extensions.

I have been hearing about Neovim for a while until this point decided to give it a try. I expected it to be difficult to get started, because it's a mouseless modal editor -- a completely new way of editing code than what I've been used to.

But honestly, it was way easier to get started than I originally anticipated. It took me about a day to learn the basic vim motions. I've learned to edit text and navigate around files pretty well in just a couple days. But I still couldn't switch away from VSCode since I wanted intellisense, goto definition and other fancy IDE functionality.

Thankfully, Neovim supported all of those. But actually getting any of it setup was immense pain. It took me about 2 weeks of wrestling and tinkering with my neovim config to finally get a setup that _felt right_.

There was quite a lot of bloat in my config, a lot of "eye candy" that I ended up getting rid of. For instance
[noice <!--typos-ignore-->
.nvim](https://github.com/folke/noice.nvim) which becomes distracting after a while.

I've been using Neovim for several months by this point and things were starting to settle. But every week or so I had to spend **several hours** fixing my configs because a new error arose due to one of my 60+ plugins updating.

Sometimes you just want to open your text editor and use it to write code. But when you have bugs you need to fix and sift through github issues, it gets in the way and can get old.

I loved Neovim a lot as well as the mouse-less terminal lifestyle I've gotten used to, thanks to Neovim. But the amount of time I spent on my editor vs actually using it to write code was just insane. So I was just thinking of switching back to VSCode and using vim motions plugin, since I just wanted to become productive again.

Yes, Neovim made me write code _way faster_, but at what cost? I have to maintain my configuration as if it was some kind of project. Think of breaking changes when updating my dependencies. Maybe even should add automated tests? Configure a CI/CD pipeline to make sure my editor works?!

So I stumbled upon Helix, which is a terminal modal editor written in Rust. I decided to give it a try, and I was _seriously impressed_. Not only did it do literally everything I want Neovim to be out of the box with ZERO configuration, its editing model was also signifincalty more intuitive than Neovim's. I also found myself way more productive with Helix due to Helix's multiple cursor feature.

What's great about having everything built-in is that you have a much larger pool of people who may have experienced the same issue as you, and likely solved it.

I went full-helix for around a week to properly test-drive it and consider switching full time. That was a really easy choice. The community is really nice, but most importantly, I just love how clean Helix's Rust codebase is. It's so incredibly hackable, if Helix does not have a feature, I just write a bit of code and send a pull request. Until it's merged, I just use it in my personal fork. I've made a couple of such pull requests:

- [Colors for items in the completion menu #12299](https://github.com/helix-editor/helix/pull/12299)
- [Color swatches ( 🟩 green 🟥 #ffaaaa ) #12308](https://github.com/helix-editor/helix/pull/12308)
- [More can be seen here](https://github.com/helix-editor/helix/pulls?q=is%3Apr+author%3ANikitaRevenco+is%3Aclosed+is%3Amerged)

One _awesome_ thing about Helix, for me personally -- is that I feel wayyyyy more in control of the editor despite Helix not having plugins. I understand a fair amount of Helix's 80,000+ lines of Rust codebase, and I just can't emphasize it enough how empowering it is to use some software and you know exactly what is happening behind the scenes.

The only thing Helix was really missing is an ability to navigate across the file system. Stuff like delete folders, rename files etc. But there was a pull request which I've merged into my own personal fork [Command expansion v2 #11164](https://github.com/helix-editor/helix/pull/11164) which provided the full functionality I would want.

Now I really don't see a reason why I would ever switch back to Neovim or something like VSCode. Helix is blazingly fast, meets all my demands, extremely hackable and reliable. I don't need to worry about one of my 60 plugins pushing a breaking change and force me to investigate for half an hour instead of actually writing my code.

Helix to Neovim feels like what Neovim is to Vim. Really, I am super impressed that this piece of software was written in just 4 years, and already has more contributors than Neovim does in 10 years. Really excited for the future of Helix.
