type Project = {
  name: string;
  finishDate: string;
  features: string[];
  learned: string[];
};

const projects = [
  {
    name: "recipes",
    finishDate: "2024-01-02",
    features: [
      "First time working with HTML.",
      "Defining multiple HTML pages with content.",
      "Using various HTML tags such as <img>, <div>, <ul> and others.",
      "Learned the basics of Git - making first commits and pushing them.",
      "First time using GitHub - pushing first project to the internet.",
    ],
    learned: [
      "Home page where all recipes can be accessed.",
      "Recipe pages displaying Description, Steps and Ingredients.",
      "Each page links to other recipe pages.",
    ],
  },
  {
    name: "landing-page",
    finishDate: "2024-01-03",
    features: [
      "Landing page with several sections made to stand out one from another.",
      "Price tags which have been absolutely positioned next to the rock pictures.",
      "Sections such as call to action, header, footer, etc.",
    ],
    learned: [
      "Learned how to center a div.",
      "Learned flexbox and played with it to create a landing page.",
    ],
  },
  {
    name: "rock-paper-scissors",
    finishDate: "2024-01-07",
    features: [
      "Play rock paper scissors against the computer 5 times and find who will be the winner!",
    ],
    learned: [
      "First time using JavaScript.",
      "Learned to manipulate the DOM for the first time.",
      "Learned how events work and how they can be listened to.",
    ],
  },
  {
    name: "calculator",
    finishDate: "2024-01-11",
    features: [
      "Calculate numbers operation by operation.",
      "Supports various operators such as addition, factorial and others.",
      "Error handling in-case the user tries to divide by 0.",
    ],
    learned: [
      "Learned to make my code cleaner, each function should be responsible for a single thing.",
    ],
  },
  {
    name: "signup-form",
    finishDate: "2024-01-13",
    features: [
      "Sign up form with several fields, allowing the user to enter their name, email, password and other fields.",
    ],
    learned: ["Learned how to create forms with HTML."],
  },
  {
    name: "admin-dashboard",
    finishDate: "2024-01-16",
    features: [
      "Projects section.",
      "Side navigation.",
      "Various other sections.",
    ],
    learned: ["Learned how to use CSS Grid to create fluid grid layouts."],
  },
  {
    name: "library",
    finishDate: "2024-01-19",
    features: [
      "Delete books from the library.",
      "Open books.",
      "Add new books.",
    ],
    learned: [
      "Basics of Object Oriented Programming.",
      "Absolute position.",
      "CSS transitions.",
    ],
  },
  {
    name: "tic-tac-toe",
    finishDate: "2024-01-22",
    features: [
      "Two players each can choose the letter they are playing as, their color and name.",
      "Winner's score increases by one.",
      "Players can finish the game early.",
      "Functionality to reset the game's state.",
    ],
    learned: [
      "Learned principles of immutability by using an immediately invoking function expression (IIFE).",
    ],
  },
  {
    name: "etch-a-sketch",
    finishDate: "2024-01-22",
    features: [
      "Users can choose the size of the canvas.",
      "Hovering over individual cells will apply several random styles to them, allowing users to draw.",
    ],
    learned: [
      "Learned to dynamically manipulate DOM styles through JavaScript.",
    ],
  },
  {
    name: "restaurant-page",
    finishDate: "2024-01-26",
    features: ["Several pages displaying information about the restaurant."],
    learned: [
      "Learned to use a bundler (webpack).",
      "Learned to use a package manager (npm).",
      "Created whole UI dynamically using only JavaScript, without writing almost any HTML.",
    ],
  },
  {
    name: "todo-app",
    finishDate: "2024-01-29",
    features: [
      "The app stores information in local storage, so changes are saved on refresh.",
      "Create and delete todos, mark as complete/favorite and change priority.",
      "Organise your todos into projects.",
    ],
    learned: [
      "How to implement dark and light mode.",
      "Working with JSON data for the first time.",
      "Using media queries to make site responsive.",
      "Using LocalStorage.",
    ],
  },
  {
    name: "weather-app",
    finishDate: "2024-02-02",
    features: [
      "Parallax effect from moving the mouse.",
      "Automatically fetches the user's location if they consent.",
      "Fetch weather data for a place and display it to the user.",
      "Supports both imperial and metric units.",
    ],
    learned: [
      "Asynchronous JavaScript (async/await and promises).",
      "Data fetching.",
      "Handling data.",
      "Using browser's Geolocation API to get the user's current location.",
    ],
  },
  {
    name: "battleship",
    finishDate: "2024-02-19",
    features: [
      "Semi-intelligent AI.",
      "Two player mode.",
      "Drag and drop ships.",
    ],
    learned: [
      "Learned how to unit test.",
      "Learned and used more advanced object-oriented patterns.",
      "Learned how to maintain a proper separation of concerns between code that is responsible for the game logic vs code that is responsible for manipulating the DOM.",
      "Learned how to use the native browser drag and drop API.",
    ],
  },

  {
    name: "responsive-homepage",
    finishDate: "2024-02-21",
    features: [
      "App is responsive and can be viewed on both desktop and mobile screens.",
    ],
    learned: ["Learned how to implement responsive and fluid design."],
  },
  {
    name: "cv-maker",
    finishDate: "2024-03-03",
    features: [
      "Build a CV by filling out the fields.",
      "Change font and color of the CV.",
      "The CV will always maintain the same aspect ratio.",
      "Exportable as a PDF.",
    ],
    learned: [
      "Learned the basics of React and JSX.",
      "Learned how to handle state in React.",
      "Learned to use Vite.",
    ],
  },
  {
    name: "memory-cards",
    finishDate: "2024-03-05",
    features: [
      "Memory game with several difficulty levels.",
      "Clicking the same pokemon twice will lose the game.",
    ],
    learned: [
      "Learned about useEffect.",
      "Data fetching and handling in React.",
    ],
  },
  {
    name: "shopping-cart",
    finishDate: "2024-03-12",
    features: [
      "The website has categories, each category has several shop items.",
      "Each shop item is its own page, with the ability to add to cart.",
      "Cart state is saved across the application.",
    ],
    learned: [
      "Learned to create a single page application by using the React Router.",
      "Learned to set up dynamic routes with React Router.",
    ],
  },
] as const satisfies Project[];

const PREFIX = "odin-project-";
const USERNAME = "nikitarevenco";

const generateLinks = (projectName: (typeof projects)[number]["name"]) => ({
  repoUrl: `https://github.com/${USERNAME}/${PREFIX}${projectName}`,
  pagesUrl: `https://${USERNAME}.github.io/${PREFIX}${projectName}`,
});

export default projects.map((project) => ({
  ...project,
  ...generateLinks(project.name),
}));
