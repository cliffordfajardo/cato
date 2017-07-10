require("./components/command-palette/command-palette.scss");
require('./popup.scss');


const fuzzaldrinPlus = require('fuzzaldrin-plus');
const utils = require('./common/utils');
const appHTML = require("./components/command-palette/command-palette.html");

/* ***********************Bootstrap app markup & set up globals**************************/
window.appElement = document.createElement("div");
window.appElement.innerHTML = appHTML;
document.body.appendChild(window.appElement);

window.currentSearchSuggestions = utils.defaultSeachSuggestions;
window.searchInput = document.querySelector(".cPalette__search");
window.searchResultsList = document.querySelector(".cPalette__search-results");
// Focus the input to prompt user for an action.
window.searchInput.focus();


/**
 * Creates & appends the matched search result to the results list.
 * @param  {array} matchedSearchResults
 * @returns {void}
 */
window.renderMatchedSearchResults = function renderMatchedSearchResults(matchedSearchResults) {
  // this can be simplied with JSX and make it easier to understand.
  for(const matchedResult of matchedSearchResults) {
    const searchResult = document.createElement("li");

    searchResult.classList.add("cPalette__search-result");
    searchResult.onclick = matchedResult.action;
    window.searchResultsList.appendChild(searchResult);


    const searchResultIcon = document.createElement('img');

    searchResultIcon.classList.add('cPalette__search-result-icon');
    searchResultIcon.setAttribute('src', matchedResult.icon);
    searchResult.appendChild(searchResultIcon);

    const searchResultTextInfo = document.createElement('div');

    searchResultTextInfo.classList.add('cPalette__search-result-text-info');
    searchResult.appendChild(searchResultTextInfo);

    const resultText = document.createElement('div');

    resultText.classList.add('cPalette__search-result-text');
    resultText.innerHTML = matchedResult.textWithMatchedChars || matchedResult.keyword;
    searchResultTextInfo.appendChild(resultText);


    const resultSubtext = document.createElement('div');

    resultSubtext.classList.add('cPalette__search-result-subtext');
    resultSubtext.innerHTML = matchedResult.subtext;
    if(matchedResult.subtext) {
      searchResultTextInfo.appendChild(resultSubtext);
    }
  }
  window.searchResultsList.children[0].classList.add("selected");
}


window.searchInput.addEventListener("input", (event) => {
  window.searchResultsList.innerHTML = "";
  const matchedSearchResults = fuzzaldrinPlus
    .filter(window.currentSearchSuggestions, window.searchInput.value, {key: 'keyword', maxResults: 20})
    .map((matchedResult) => {
      matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.keyword, window.searchInput.value);
      return matchedResult;
    });

    if(utils.isValidMathExpression(window.searchInput.value)) {
      const mathResult = utils.evalMathExpression(window.searchInput.value).toString();
      matchedSearchResults.push(utils.displayValidMathResult(mathResult))
    }
    if(utils.isIncompleteMathExpression(window.searchInput.value)) {
      matchedSearchResults.push(utils.displayIncompleteMathError);
    }
    if(matchedSearchResults.length === 0 && window.searchInput.value !== '') {
      utils.fallbackWebSearches.forEach((fallbackSearch) => {
        matchedSearchResults.push(fallbackSearch())
      });
    }
  window.renderMatchedSearchResults(matchedSearchResults);
});

window.searchResultsList.addEventListener("mouseover", (event) => {
  // console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    const selectedElement = event.target;

    selectedElement.classList.add("selected");
    selectedElement.addEventListener("mouseout", (/* event*/) => {
      selectedElement.classList.remove("selected");
    }, {once: true}
    );
  }
});

window.searchResultsList.addEventListener("mouseLeave", (event) => {
  // console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    event.target.classList.remove("selected");
  }
});

/**
 * Deselect any current suggestions, selects a given suggestions.
 * and then scrolls to show selection.
 * @param {HTMLelement} nextSuggestion
 * @returns {void}
 */
function selectSuggestion(nextSuggestion) {
  window.selectedElement.classList.remove('selected');
  nextSuggestion.classList.add('selected')

}

/**
 * Rescrolls element
 * @returns {void}
 */
function reScroll() {
    try {
      const scrollElement = window.selectedElement.previousSibling.previousSibling
      scrollElement.scrollIntoView(alignToTop=true);
    }
    catch(err) {

    /**/
  }
}


/**
 * Handles up and down keys when the user has focus on the input field, enabling the user
 * to select the search.
 * @param  {event} event
 * @returns {void}
 */
function handleInputArrowKeys(event) {
  window.searchInput.focus();
  window.selectedElement = document.querySelector('.selected');
  if(window.selectedElement) {
    if(event.keyCode === 40 || event.keyCode === 9 /* Down arrow OR Tab keyodes */) {
      event.preventDefault();
      const newSuggestion = window.selectedElement.nextElementSibling;
      if(newSuggestion) {
        selectSuggestion(newSuggestion);
        reScroll();
      }
      else {
        // we've hit the bottom of the list so go all the way back up.
        const newSuggestion = window.searchResultsList.children[0];
        selectSuggestion(newSuggestion);
        reScroll();
      }
    }
    else if(event.keyCode === 38 /* Arrow Up */) {
      event.preventDefault();
      const newSuggestion = window.selectedElement.previousSibling;
      if(newSuggestion) {
        selectSuggestion(newSuggestion);
        reScroll();
      }
    }
    else if(event.keyCode === 13 /* Enter key*/) {
      window.selectedElement.click();
    }
    else if(event.which === 8) {
      // Backspace Key
      if(window.searchInput.value === '') {
        // if the user
      }
    }

  }
}

window.searchInput.addEventListener("keyup", handleInputArrowKeys);
