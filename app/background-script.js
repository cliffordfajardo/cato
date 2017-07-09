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

//Focus the input to prompt user for an action.
window.searchInput.focus()




/**
 * Creates & appends the matched search result to the results list.
 * @param  {array} matchedSearchResults
 * @returns {void}
 */
window.renderMatchedSearchResults = function renderMatchedSearchResults(matchedSearchResults) {
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


window.searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13) {
    return;
  }
  const userQuery = window.searchInput.value.trim();

  if(userQuery === "") {
    window.searchResultsList.innerHTML = "";
    return
  }
  // our focus event will trigger keydown and thus render all of our search results. We don't want that.
  // on every key down, re-rnder all results.
  window.searchResultsList.innerHTML = "";
  const matchedSearchResults = fuzzaldrinPlus
    .filter(window.currentSearchSuggestions, userQuery, {key: 'keyword', maxResults: 20})
    .map((matchedResult) => {
      matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.keyword, userQuery);
      return matchedResult;
    });
    // calculate math expressions regardless (works w00t)..try it with this tab: http://www.101ways.com/
    //* ****Fallback searches if didn't get any matches**//
    const foundMatches = matchedSearchResults.length > 0;
    // check if input is a valid math expression
    const userQueryIsMathExpression = utils.isValidMathExpression(userQuery);

    if(userQueryIsMathExpression) {
      const mathResult = utils.evalMathExpression(userQuery).toString();

      matchedSearchResults.push({
        'subtext': 'Copy this number to your clipboard.',
        'text': userQuery,
        // need to copy to clipboard

        'icon': 'images/calculator-icon.png',
        // need to fix this is hacky
        textWithMatchedChars: mathResult
      });
    }

    // fallback searches (google)
    if(!foundMatches) {
      matchedSearchResults.push(
        {
          'action': utils.openGoogleSearchInNewTab(userQuery),
          icon: 'images/google-search-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search Google for: '${userQuery}'`
        },
        {
          'action': utils.openWikiSearchInNewTab(userQuery),
          icon: 'images/wikipedia-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search Wikipedia for: '${userQuery}'`
        },
        {
          'action': utils.openYoutubeSearchInNewTab(userQuery),
          icon: 'images/youtube-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search YouTube for: '${userQuery}'`
        },
        {
          'action': utils.openGoogleDriveSearchInNewTab(userQuery),
          icon: 'images/google-drive-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search Google Drive for: '${userQuery}'`
        },
        {
          'action': utils.openAmazonSearchInNewTab(userQuery),
          icon: 'images/amazon-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search Amazon for: '${userQuery}'`
        },
        {
          'action': utils.openGmailSearchInNewTab(userQuery),
          icon: 'images/gmail-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search Gmail for: '${userQuery}'`
        }
      );
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
 * Handles up and down keys when the user has focus on the input field, enabling the user
 * to select the search.
 * @param  {event} event
 * @returns {void}
 */
function handleInputArrowKeys(event) {
  const resultsList = document.querySelector(".cPalette__search-results");
  const resultsIsEmpty = !(resultsList.children.length > 0);

  if (resultsIsEmpty) {
    return;
  }
  // console.log("search results is populated. Arrow Keys work");
  let highlightedResult = document.querySelector(".cPalette__search-result.selected");

  if (highlightedResult) {
    if (event.keyCode === 40) {
      // Arrow Down
      const nextSibling = highlightedResult.nextElementSibling;

      if (nextSibling) {
        highlightedResult.classList.remove("selected");
        highlightedResult = nextSibling;
        highlightedResult.classList.add("selected");
      }
    } else if (event.keyCode === 38) {
      // Arrow Up
      const nextSibling = highlightedResult.previousElementSibling;

      if (nextSibling) {
        highlightedResult.classList.remove("selected");
        highlightedResult = nextSibling;
        highlightedResult.classList.add("selected");
      }
    } else if (event.keyCode === 13) {
      // enter key
      highlightedResult.click();
      // console.log('enter on -->', highlightedResult);
    }
  }
}

window.searchInput.addEventListener("keyup", handleInputArrowKeys);
