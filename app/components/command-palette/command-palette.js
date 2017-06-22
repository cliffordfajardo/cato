const fuzzy = require("fuzzy");
const options = { pre: "__<", post: ">__" };
const files = [
  ".DS_Store",
  ".editorconfig",
  ".eslintignore",
  ".eslintrc.js",
  ".gitignore",
  "app.js",
  "index.html",
  "npm-debug.log",
  "package-lock.json",
  "package.json",
  "webpack.config.js"
];

require("./command-palette.scss");

/*Create the commandpalette element*/
const commandPaletteTemplate = require("./command-palette.html");
const appElement = document.createElement("div");
appElement.innerHTML = commandPaletteTemplate;
document.body.appendChild(appElement);
console.log("created app element");

const searchInput = document.querySelector(".command-palette__search");
console.log("called searchINput");

function showResults(e) {
  const resultsList = document.querySelector(
    ".command-palette__search-results"
  );
  const userInput = searchInput.value;
  //on every key down, render all results: we're onyl showing up to 20, so it may not incur a big cost
  resultsList.innerHTML = "";

  //our focus event will trigger keydown and thus render all of our search results. We don't want that.
  if (userInput !== "") {
    console.log("userInput -->", userInput);

    const searchResults = fuzzy
      .filter(userInput, files, options)
      .map(el => el.string); //

    console.log("searchResults->", searchResults);
    searchResults.forEach(result => {
      //searchResults looks like: ["package-__<l>____<o>____<c>____<k>__.json", ...]
      //results looks like: "package-__<l>____<o>____<c>____<k>__.json"
      //convert it result to: package.json
      result = result
        .split(/__|<|>/) //["package-", "", "l", "", "", "", "o", "", "", "", "c", "", "", "", "k", "", ".json"]
        .filter(v => v)
        .join(""); // "package.json"

      const resultItem = document.createElement("li");
      resultItem.classList.add("command-palette__search-result");
      resultItem.innerHTML += result;

      resultsList.appendChild(resultItem);
    });

    //apply selected to the first element in list:
    resultsList.children[0].classList.add("selected");
  }
}

//set up event delegation to add selected to li items & remove them when off
const resultsList = document.querySelector(".command-palette__search-results");
resultsList.addEventListener("mouseover", event => {
  console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    const selectedElement = event.target;
    selectedElement.classList.add("selected");
    selectedElement.addEventListener(
      "mouseout",
      event => {
        selectedElement.classList.remove("selected");
      },
      { once: true }
    );
  }
});

resultsList.addEventListener("mouseLeave", event => {
  console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    event.target.classList.remove("selected");
  }
});

//TODO: the top most result should be given a class of 'selected'

searchInput.addEventListener("keyup", showResults);

const toggleButton = document.querySelector(".toggleButton");
const commandPalette = document.querySelector(".modal");
const toggleCommandPalette = function() {
  const isHidden = commandPalette.classList.contains("hide");
  if (isHidden) {
    searchInput.value = "";
    commandPalette.classList.remove("hide");
    searchInput.focus();
  } else {
    commandPalette.classList.add("hide");
    searchInput.value = "";
  }
};

// toggleButton.addEventListener("click", toggleCommandPalette);

/**create keylogger**/
const bodyElement = document.querySelector("body");

// "cmd(91)-shift(16)-(80)"
const keypresses = [];
function captureKeyCombo(event) {
  // console.log("keydown fired!!!!!!!");
  // if (keypresses.length >= 3) {
  //   keypresses.forEach((key, i) => {
  //     if (keypresses[i].keyCode == 91 && keypresses[i + 1].keyCode == 16 && keypresses[i + 2].keyCode == 80) {
  //       // alert("16,89,91 consequtive!");
  //       toggleCommandPalette();
  //       keypresses = [];
  //     }
  //   });
  // }
  // if(event.which === 80 && event.shiftKey && event.metaKey){
  //   toggleCommandPalette();
  // }
}

/*Doing it on the body isn't wise, what ifç we only have a 10px div on the page? the body would be 10px*/

//hide alfred if the esc key is hit or if our click event is not on alfred.

const modal = document.querySelector(".modal");

function hideOnEscapeKey(event) {
  if (event.keyCode === 27 && !commandPalette.classList.contains("hide")) {
    toggleCommandPalette();
  }
}
bodyElement.addEventListener("keydown", hideOnEscapeKey);

/// TODO: hide on mouse out and escape should be in one nice function.
function hideOnBlur(event) {
  //hide the modal if we clicked outside of it. If the click event's target element is
  //not the modal or a descendant of it, hide it.
  console.log("clickevent", event);
  if (event.srcElement !== modal && !modal.contains(event.srcElement)) {
    //hide the commandPalette
    commandPalette.classList.add("hide");
    resultsList.innerHTML = "";
  }
}
const htmlElement = document.querySelector("html");
htmlElement.addEventListener("click", hideOnBlur);

bodyElement.addEventListener("keydown", event => {
  if (event.keyCode === 27 && !commandPalette.classList.contains("hide")) {
    toggleCommandPalette();
  }

  if (event.which === 80 && event.shiftKey && event.metaKey) {
    toggleCommandPalette();
  }
});
// bodyElement.addEventListener("keyup", captureKeyCombo);
