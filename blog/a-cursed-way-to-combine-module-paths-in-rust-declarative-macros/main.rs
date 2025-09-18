mod image {
    pub mod action {
        pub struct Command;
        pub struct KeymappableCommand;
    }
}

mod ui {
    pub mod popup {
        pub mod letters {
            pub struct Command;
            pub struct KeymappableCommand;
        }
    }
    pub mod app {
        pub struct Command;
        pub struct KeymappableCommand;
    }
}

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

declare_commands! {
   ImageUpload(crate::image::action),
   App(ui::app),
   Letters(ui::popup::letters)
}

fn main() {
    let _ =
        Command::ImageUpload(crate::image::action::Command);
    let _ = KeymappableCommand::ImageUpload(
        crate::image::action::KeymappableCommand,
    );

    let _ = Command::App(ui::app::Command);
    let _ = KeymappableCommand::App(
        ui::app::KeymappableCommand,
    );

    let _ = Command::Letters(ui::popup::letters::Command);
    let _ = KeymappableCommand::Letters(
        ui::popup::letters::KeymappableCommand,
    );
}
