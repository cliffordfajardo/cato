require("./components/command-palette/command-palette.scss");
require('./popup.scss');

const fuzzaldrinPlus = require('fuzzaldrin-plus');
const utils = require('./common/utils')
const searchSuggestions = utils.defaultSeachSuggestions;


const appElement = document.createElement("div");

appElement.innerHTML = require("./components/command-palette/command-palette.html");
document.body.appendChild(appElement);

/** **********************File Globals**************************/
const searchInput = document.querySelector(".cPalette__search");


/**
 * Populates the default search suggestions that a user can search through.
 * @returns {void}
 */
function populateSearchSuggestions() {
  // improve search filtering by including domain.
  // get all tabs & add them to our suggestion list via thier title
  chrome.windows.getAll({populate: true}, (browserWindows) => {
    browserWindows.forEach((browserWindow) => {
      browserWindow.tabs.forEach((tab) => {
        searchSuggestions.push({
          'action': utils.switchToTabById(tab.windowId, tab.id),
          'icon': tab.favIconUrl || 'images/blank-page.png',
          'keyword': `Change tab: ${tab.title}`
        });
      });
    });
  });

  // get all chrome extensions & add them to our list for enabling or disabling
  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => extensionOrApp.type === 'extension' && extensionOrApp.name !== "Awesome Task Launcher");

    for(const extension of extensions) {
      const extensionStatus = extension.enabled ? 'Enabled' : 'Disabled';
      const extensionOption = extensionStatus === 'Enabled' ? 'Disable' : 'Enable';

      searchSuggestions.push({
        'keyword': `${extensionOption} Extension: ${extension.name}`,
        'action': utils.toggleExtensionOnOff(extension),
        'icon': utils.useAvalableExtensionIcon(extension)
      });
    }
  });

  // uninstall option extensions
  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => extensionOrApp.type === 'extension' && extensionOrApp.name !== "Awesome Task Launcher");

    for(const extension of extensions) {
      const action = {
        'action': utils.uninstallExtension(extension),
        'icon': utils.useAvalableExtensionIcon(extension),
        'keyword': `Uninstall Extension: ${extension.name}`
      }

      searchSuggestions.push(action);
    }
  });

}
populateSearchSuggestions();


/**
 * Rerenders the search results on every keydown in our search input.
 * @param  {event} event
 * @returns {void}
 */
function renderResults(event) {
  // This will require fixing at some point, but w/o this our up-down in our input will not work
  if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13) {
    return;
  }

  const searchResultsList = document.querySelector(".cPalette__search-results");
  const userQuery = searchInput.value.trim();

  if(userQuery === "") {
    searchResultsList.innerHTML = "";
    return
  }
  // our focus event will trigger keydown and thus render all of our search results. We don't want that.
    // on every key down, re-rnder all results.
    searchResultsList.innerHTML = "";
    const matchedSearchResults = fuzzaldrinPlus
      .filter(searchSuggestions, userQuery, {key: 'keyword', maxResults: 20})
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
        // {
        //   'action': utils.openWikiSearchInNewTab(userQuery),
        //   icon: 'images/wikipedia-icon.png',
        //   // fix this ugliness
        //   'textWithMatchedChars': `Search Wikipedia for: '${userQuery}'`
        // },
        {
          'action': utils.openYoutubeSearchInNewTab(userQuery),
          icon: 'images/youtube-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search YouTube for: '${userQuery}'`
        },
        // {
        //   'action': utils.openGoogleDriveSearchInNewTab(userQuery),
        //   icon: 'images/google-drive-icon.png',
        //   // fix this ugliness
        //   'textWithMatchedChars': `Search Google Drive for: '${userQuery}'`
        // },
        {
          'action': utils.openAmazonSearchInNewTab(userQuery),
          icon: 'images/amazon-icon.png',
          // fix this ugliness
          'textWithMatchedChars': `Search Amazon for: '${userQuery}'`
        }
        // {
        //   'action': utils.openGmailSearchInNewTab(userQuery),
        //   icon: 'images/gmail-icon.png',
        //   // fix this ugliness
        //   'textWithMatchedChars': `Search Gmail for: '${userQuery}'`
        // }
      );
    }


      // console.log('matchedSearchResults', matchedSearchResults)
      for(const matchedResult of matchedSearchResults) {
        const searchResult = document.createElement("li");

        searchResult.classList.add("cPalette__search-result");
        searchResult.onclick = matchedResult.action;
        searchResultsList.appendChild(searchResult);


        const searchResultIcon = document.createElement('img');

        searchResultIcon.classList.add('cPalette__search-result-icon');
        searchResultIcon.setAttribute('src', matchedResult.icon);
        searchResult.appendChild(searchResultIcon);

        const searchResultTextInfo = document.createElement('div');

        searchResultTextInfo.classList.add('cPalette__search-result-text-info');
        searchResult.appendChild(searchResultTextInfo);

        const resultText = document.createElement('div');

        resultText.classList.add('cPalette__search-result-text');
        resultText.innerHTML = matchedResult.textWithMatchedChars;
        searchResultTextInfo.appendChild(resultText);


        const resultSubtext = document.createElement('div');

        resultSubtext.classList.add('cPalette__search-result-subtext');
        resultSubtext.innerHTML = matchedResult.subtext;
        if(matchedResult.subtext) {
          searchResultTextInfo.appendChild(resultSubtext);
        }
      }
    // apply selected to the first element in list:
    resultsList.children[0].classList.add("selected");
}


// set up event delegation to add selected to li items & remove them when off
const resultsList = document.querySelector(".cPalette__search-results");

resultsList.addEventListener("mouseover", (event) => {
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

resultsList.addEventListener("mouseLeave", (event) => {
  // console.log(event.target);
  if (event.target.classList.value.includes("search-result")) {
    event.target.classList.remove("selected");
  }
});


searchInput.addEventListener("keyup", renderResults);


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

searchInput.addEventListener("keyup", handleInputArrowKeys);
// console.log('*************************************')
