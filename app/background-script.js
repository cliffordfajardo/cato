require("./components/command-palette/command-palette.scss");
require('./popup.scss');

const fuzzaldrinPlus = require('fuzzaldrin-plus');
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


function renderResults(event) {
  if (event.keyCode === 38 || event.keyCode == 40 || event.keyCode == 13) {return;} //TODO:w/o this ↑ ↓ won't work smoothly. Fix
  const searchResultsList = document.querySelector(".cPalette__search-results");
  const userQuery = searchInput.value.trim();

  //our focus event will trigger keydown and thus render all of our search results. We don't want that.
    //on every key down, re-rnder all results.
    searchResultsList.innerHTML = "";
    let matchedSearchResults = fuzzaldrinPlus
      .filter(searchSuggestions,userQuery, options={key: 'text', maxResults: 20})
      .map((matchedResult) => {
        matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.text, userQuery);
        return matchedResult;
      });

      // console.log('matchedSearchResults', matchedSearchResults)
      for(let matchedResult of matchedSearchResults) {
        const searchResult = document.createElement("li");
        searchResult.classList.add("cPalette__search-result");
        searchResult.onclick = matchedResult.action;
        searchResultsList.appendChild(searchResult);


        const searchResultIcon = document.createElement('img');
        searchResultIcon.classList.add('cPalette__search-result-icon');
        searchResultIcon.setAttribute('src', matchedResult.icon);
        searchResult.appendChild(searchResultIcon);

        const searchResultText = document.createElement('div');
        searchResultText.classList.add('cPalette__search-result-text');
        searchResultText.innerText = matchedResult.text;
        searchResultText.innerHTML = matchedResult.textWithMatchedChars;
        searchResult.appendChild(searchResultText);
      }
    //apply selected to the first element in list:
    resultsList.children[0].classList.add("selected");
}

//set up event delegation to add selected to li items & remove them when off
const resultsList = document.querySelector(".cPalette__search-results");
resultsList.addEventListener("mouseover", event => {
  console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    const selectedElement = event.target;
    selectedElement.classList.add("selected");
    selectedElement.addEventListener("mouseout", (/*event*/) => {
      selectedElement.classList.remove("selected");},{ once: true }
    );
  }
});

resultsList.addEventListener("mouseLeave", event => {
  console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    event.target.classList.remove("selected");
  }
});


searchInput.addEventListener("keyup", renderResults);


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
console.log('*************************************')
