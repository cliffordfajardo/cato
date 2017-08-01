const utils = {};
const {h} = require('dom-chef');
const fuzzaldrinPlus = require('fuzzaldrin-plus');
const mathexp = require('math-expression-evaluator');
const tinycolor = require('tinycolor2');


//DOM utilities
utils.userQuery = () => window.searchInput.value;
utils.clearSearchResults = () => window.searchResultsList.innerHTML = "";
utils.highlightTopSuggestion = () => window.searchResultsList.children[0].classList.add("selected");



utils.createSuggestionElement = function(suggestion) {
  const element = (
    <li className="cPalette__search-result" onClick={suggestion.action}>
      <img className="cPalette__search-result-icon" src={suggestion.icon.path} />
      <div className="cPalette__search-result-text-info">
        <div
          className="cPalette__search-result-text"
          dangerouslySetInnerHTML={{__html: suggestion.textWithMatchedChars || suggestion.keyword}}>
        </div>
        <div
          class="cPalette__search-result-subtitle"
          dangerouslySetInnerHTML={{__html: suggestion.subtitle}}>
        </div>
      </div>
    </li>
  );
  return element;
}



utils.renderSuggestions = function (suggestions) {
  suggestions.forEach((suggestion) => {
    const searchResulthasPreview = suggestion.preview !== undefined;
    const searchResult = utils.createSuggestionElement(suggestion);
    if(searchResulthasPreview){
      searchResult.preview = suggestion.preview;
    }
    window.searchResultsList.appendChild(searchResult);
  })
  utils.highlightTopSuggestion();
}





utils.getMatches = function(userInput, suggestions) {
  const matches = fuzzaldrinPlus
    .filter(suggestions, userInput, {key: 'keyword', maxResults: 20})
    .map((matchedResult) => {
      matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.keyword, utils.userQuery());
      return matchedResult;
    });
  return matches;
}


utils.getFallbackSuggestions = function(userInput) {
  const fallbackSuggestions = [];
  //Check if input is a math expression
  if(utils.isValidMathExpression(userInput)) {
    const mathResult = utils.evalMathExpression(userInput).toString();
    fallbackSuggestions.push(utils.displayValidMathResult(mathResult));
  }
  if(utils.isIncompleteMathExpression(userInput)) {
    fallbackSuggestions.push(utils.displayIncompleteMathError);
  }

  if(window.searchInput.value !== '') {
    utils.fallbackWebSearches.forEach((fallbackSearch) => {
      fallbackSuggestions.push(fallbackSearch())
    });
  }

  return fallbackSuggestions;
}










//****************************Math utilities********************************/
utils.evalMathExpression = function(string) {
  return mathexp.eval(string);
}

utils.isValidMathExpression = function(string) {
  try {
    mathexp.eval(string);
    return true;
  }
  catch(exception) {
    return false;
  }
}

utils.isIncompleteMathExpression = function(string) {
  try {
    mathexp.eval(string);
    return false;
  }
  catch(exception) {
    if(exception.message === "complete the expression" && string !== '') {
      return true;
    }
  }
}

utils.displayValidMathResult = function(value) {
  return {
    keyword: value,
    'subtitle': 'Copy this number to your clipboard.',
    'icon': {
      path: 'images/calculator-icon.png'
    }
  }
}


utils.displayIncompleteMathError = {
  keyword: '...',
  'subtitle': 'Please enter a valid math expression.',
  'icon': {
    path: 'images/calculator-icon.png'
  }
}



//****************************GENERAL UTILITIES********************************/
utils.debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;

    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) {
      func.apply(context, args);
    }
  };
};


utils.getCurrentAppearanceSettings = () => window.db.get('appearanceSettings').value();

/**
 * Resets the appearance of the launcher to the default color.
 *@returns {void}
 */
utils.resetAppearanceSettings = function resetAppearanceSettings(){
  //reset local storage (if the user is viewing the options page, this will not update it.)
  window.db.set('appearanceSettings', utils.defaultAppearanceSettings)
    .write();

    //update root variables
  for (const key in utils.defaultAppearanceSettings) {
    if (utils.defaultAppearanceSettings.hasOwnProperty(key)) {
      utils.updateCSSVariable(key, utils.defaultAppearanceSettings[key])
    }
  }
}

/**
 * Updates a CSS variable's value.
 * @param  {string} propertyName
 * @param  {string} value
 * @param  {HTMLElement} element
 * @returns {void}
 */
utils.updateCSSVariable = function updateCSSVariable(propertyName, value, element=document.documentElement) {
  element.style.setProperty(propertyName, value);
}



/*
Add commands liek so.. what if we get a 10 matches and the one we want is at position 5..we don't want to requeyr
'shortcut': {
        'windows': ['^', 'R'],
        'mac': ['⌘', '1...9']
    }
*/












//****************************CHROME EXTENSION UTILITIES*******************/
utils.isFolder = (node) => 'children' in node
utils.isBookmark = (node) => 'url' in node;

utils.useAvalableExtensionIcon = function useAvalableExtensionIcon(extension) {
  if(typeof extension.icons !== 'object') {
    return 'images/blank-page-icon.png'
  }
  const icon = extension.icons[3] || extension.icons[2] || extension.icons[1] || extension.icons[0];
  return icon.url;
}

utils.switchToTabById = function switchToTabById(windowId, tabId) {
  // since chrome.tabs.update is limited to switching to tabs only within the current window
  // we need to switch to the window we need first.
  return function closureFunc() {
    chrome.windows.update(windowId, {focused: true}, () => {
      chrome.tabs.update(tabId, {'active': true});
    })
  }
}

utils.uninstallExtension = function uninstallExtension(extension) {
  return function closureFunc() {
    const options = {showConfirmDialog: true};
    chrome.management.uninstall(extension.id, options);
  }
}





























/**
 * Contains the default configuration for the appereance of the command palette.
 * @type {Object}
 */
utils.defaultAppearanceSettings = {
  '--command-palette-background-color': '#ffffff',
  '--search-input-background-color': '#ffffff',
  '--search-input-caret-color': '#000000',
  '--search-input-scrollbar-background-color': '#d3d3d3',
  '--search-result-selected-background-color': '#d3d3d3',
  '--search-result-text-keyword-match-color': '#000000',
  '--search-result-text-color': '#000000',
  '--search-input-text-color': '#000000',
  '--search-result-subtitle-color': '#d3d3d3',
  '--search-result-text-size': '15px',
  '--search-result-subtitle-size': '12px',
  '--search-input-text-size': '30px',
  '--search-input-scrollbar-width': '2px'
}



// This is uglyAF, but it work... MVP!
// Fallback searches should be abstracted out of this file.
utils.fallbackWebSearches = [
  function fallbackSearch() {

    function search(query) {
      return function closureFunc() {
        chrome.tabs.create({url: `https://www.google.com/search?q=${encodeURIComponent(query)}`});
      }
    }

    return {
      keyword: `Search Google for: '${utils.userQuery()}'`,
      action: search(utils.userQuery()),
      icon: {
        path: 'images/google-search-icon.png'
      }
    }
  }
];


module.exports = utils;
