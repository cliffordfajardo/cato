require("./components/command-palette/command-palette.scss");
require('./popup.scss');

const fuzzy = require("fuzzy");
const fuzzyOptions = { pre: "__<", post: ">__", extract: (el) => el.text};

const utils = require('./common/utils')
const searchSuggestions = utils.defaultSeachSuggestions;

const appElement = document.createElement("div");
appElement.innerHTML = require("./components/command-palette/command-palette.html");
document.body.appendChild(appElement);

/************************File Globals**************************/
const searchInput = document.querySelector(".cPalette__search");




function populateSearchSuggestions(){
  //get all tabs & add them to our suggestion list via thier title
  chrome.windows.getAll({populate:true},(browserWindows) => {
    browserWindows.forEach((browserWindow) => {
      browserWindow.tabs.forEach((tab) => {
        searchSuggestions.push({
          'text': `Change tab: ${tab.title}`,
          'action': utils.switchToTabById(tab.windowId, tab.id),
          'icon': tab.favIconUrl || 'images/blank-page.png'
        });
      });
    });
  });
}
populateSearchSuggestions();
// These things only after basic commander is done..
//TODO grab print functionality from cjj extension ...pretty cool how it can delete 4 hrs..45
//TODO define your own search shortcuts...json file wold be nice stylus had that
//TODO zoom see the crz: https://chrome.google.com/webstore/detail/shortkeys-custom-keyboard/logpjaacgmcbpdkdchjiaagddngobkck...good content script command that's 1 liners..
//TODO document.body.style.zoom = 1document.body.style.zoom = 1







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
      .filter(userInput, searchSuggestions, fuzzyOptions)
      .map(el => el);

      console.log('searchResults', searchResults)

    console.log("searchResults->", searchResults);
    searchResults.forEach(result => {
      // searchResults looks like: ["package-__<l>____<o>____<c>____<k>__.json", ...]
      //   //results looks like: "package-__<l>____<o>____<c>____<k>__.json"
      //   //convert it result to: package.json
      var textResult = result.string
        .split(/__|<|>/) //["package-", "", "l", "", "", "", "o", "", "", "", "c", "", "", "", "k", "", ".json"]
        .filter(v => v)
        .join(""); // "package.json"

      const resultItem = document.createElement("li");
      resultItem.onclick = result.original.action;
      resultItem.classList.add("cPalette__search-result");
      resultItem.innerHTML += `
        <img class="cPalette__search-result-icon"src="${result.original.icon}"/>
        <span class="cPalette__search-result-text">${textResult}</span>
      `;

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
    selectedElement.addEventListener("mouseout",event => {selectedElement.classList.remove("selected");},
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




const htmlElement = document.querySelector("html");

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
      highlightedResult.click();
      console.log('enter on -->', highlightedResult);
    }
  }
}


/**
 * code from the content script sending a message to our background script, which does have access to chrome API's
 * **/


  // user selected chrome
  // chrome.runtime.sendMessage({action: 'openGoogleURL'}); // {action: 'openGoogle.}
console.log('*************************************')
