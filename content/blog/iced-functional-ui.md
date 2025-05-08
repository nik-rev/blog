---
title: Iced sets an example of a Rust UI library. It got me onboard in writing UIs in a functional, pure style. Here's why
date: 2025-04-13
readTime: true
---

I'm using [`iced`](https://github.com/iced-rs/iced), a native UI library for Rust _inspired_ by Elm architecture (which is a purely functional way of doing UI) for my app [`ferrishot`](https://github.com/nik-rev/ferrishot) (a desktop screenshot app inspired by flameshot)

I recently came across a PR by the maintainer of iced which introduces ["Time Travel Debugging"](https://github.com/iced-rs/iced/pull/2910).

Essentially, in iced there is **only 1 enum**, a `Message` which is responsible for mutating your application state. There is only **1 place** which receives this `Message`, the `update` method of your app. No other place can _ever_ access `&mut App`.

This way of doing UI makes it highly effective to reason about your app. Because only `Message` can mutate the state, if you assemble all of the `Message`s you receives throughout 1 instance of the app into a `Vec<(Instant, Message)>`, (where `Instant` is when the `Message` happened).

You have a complete 4-dimensional control over your app. You are able to go to any point of its existence. And view the entire state of the app. Rewind, go back into the future etc. It's crazy powerful!

This great power comes at a little cost. To properly work, the `update` method (which receives `Message` and `&mut App`) **must be pure**. It should not do any IO, like reading from a file. Instead, iced has a `Task` structure which the `update` method returns. Signature:

```rs
fn update(&mut App, Message) -> Task
```

Inside of this `Task` you are free to do whatever IO you want. But it **must not** happen directly inside of the `update`. Lets say your app wants to read from a file and store the contents.

This is the impure way to achieve that by directly reading in the `update` method:

```rs
struct App {
    file_contents: String
}

enum Message {
    ReadFromFile(PathBuf),
}

fn update(app: &mut App, message: Message) -> Task {
    match message {
        Message::ReadFromFile(file) => {
            let contents = fs::read_to_string(file);
            app.file_contents = contents;
        }
    }
    Task::none()
}
```

With the above, time-travelling will not work properly. Because when you re-play the sent `Message`, it will read from the file again. Who's contents could have changed in-between reads

By moving the impure IO stuff into a `Task`, we fix the above problem:

```rs
struct App {
    file_contents: String
}

enum Message {
    ReadFromFile(PathBuf),
    UpdateFileContents(String)
}

fn update(app: &mut App, message: Message) -> Task {
    match message {
        Message::ReadFromFile(file) => {
            Task::future(async move {
                let contents = fs::read_to_string(file);

                // below message will be sent to the `update`
                Message::UpdateFileContents(contents)
            })
        }

        Message::UpdateFileContents(contents) => {
            app.file_contents = contents;
            Task::none()
        }
    }
}
```

Here, our timeline will include 2 `Message`s. Even if the contents of the file changes, the `Message` will not and we can now safely time-travel.
