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
const commandPaletteTemplate = require("./command-palette.html");
const appElement = document.createElement("div");
appElement.innerHTML = commandPaletteTemplate;
document.body.appendChild(appElement);

/************************File Globals**************************/
const searchInput = document.querySelector(".cPalette__search");

/*Create the commandpalette element*/

function showResults(e) {
  if (e.keyCode === 38 || e.keyCode == 40 || e.keyCode == 13) {
    return;
  }
  console.log("keydown", e);
  const resultsList = document.querySelector(".cPalette__search-results");
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
      resultItem.classList.add("cPalette__search-result");
      resultItem.innerHTML += result;

      resultsList.appendChild(resultItem);
    });

    //apply selected to the first element in list:
    resultsList.children[0].classList.add("selected");
  }
}

//set up event delegation to add selected to li items & remove them when off
const resultsList = document.querySelector(".cPalette__search-results");
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
  const isHidden = commandPalette.classList.contains("cPalette_is-inactive");
  if (isHidden) {
    searchInput.value = "";
    commandPalette.classList.remove("cPalette_is-inactive");
    searchInput.focus();
  } else {
    commandPalette.classList.add("cPalette_is-inactive");
    searchInput.value = "";
  }
};

// toggleButton.addEventListener("click", toggleCommandPalette);

/**create keylogger**/
const bodyElement = document.querySelector("body");

/*Doing it on the body isn't wise, what ifç we only have a 10px div on the page? the body would be 10px*/

//hide alfred if the esc key is hit or if our click event is not on alfred.

const modal = document.querySelector(".modal");

function hideOnEscapeKey(event) {
  if (
    event.keyCode === 27 &&
    !commandPalette.classList.contains("cPalette_is-inactive")
  ) {
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
    commandPalette.classList.add("cPalette_is-inactive");
    resultsList.innerHTML = "";
  }
}
const htmlElement = document.querySelector("html");
htmlElement.addEventListener("click", hideOnBlur);

bodyElement.addEventListener("keydown", event => {
  if (
    event.keyCode === 27 &&
    !commandPalette.classList.contains("cPalette_is-inactive")
  ) {
    toggleCommandPalette();
  }

  if (event.which === 80 && event.shiftKey && event.metaKey) {
    toggleCommandPalette();
  }
});
// bodyElement.addEventListener("keyup", captureKeyCombo);

searchInput.addEventListener("keyup", handleInputArrowKeys);
function handleInputArrowKeys(event) {
  const resultsList = document.querySelector(".cPalette__search-results");
  const resultsIsEmpty = resultsList.children.length > 0 ? false : true;
  if (resultsIsEmpty) {
    return;
  }
  console.log("search results is populated. Arrow Keys work");
  let highlightedResult = document.querySelector(".cPalette__search-result.selected");
  if (highlightedResult) {
    // Arrow Down
    if (event.keyCode === 40) {
      const nextSibling = highlightedResult.nextElementSibling;
      if (nextSibling) {
        highlightedResult.classList.remove("selected");
        highlightedResult = nextSibling;
        highlightedResult.classList.add("selected");
      }
    } //Arrow Up
    else if (event.keyCode === 38) {
      const nextSibling = highlightedResult.previousElementSibling;
      if (nextSibling) {
        highlightedResult.classList.remove("selected");
        highlightedResult = nextSibling;
        highlightedResult.classList.add("selected");
      }
    }
    //enter key on the selected result
    else if (event.keyCode == 13) {
      console.log('enter on -->', highlightedResult);
    }
  }
}
