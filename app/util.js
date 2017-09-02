const utils = {}
const {h} = require('dom-chef')
const fuzzaldrinPlus = require('fuzzaldrin-plus')
const mathexp = require('math-expression-evaluator')
const browser = require('webextension-polyfill')

//DOM utilities
utils.userQuery = () => window.userQuery || window.searchInput.value
//todo create an alternative...we should have utils.userInputText
//utils userQuery
utils.clearSearchInput = () => window.searchInput = ""
utils.clearSearchResults = () => window.searchResultsList.innerHTML = ""
utils.highlightTopSuggestion = () => window.searchResultsList.children[0].classList.add("selected")



utils.createSuggestionElement = function(suggestion) {
  const element = (
    <li className="cPalette__search-result" onClick={suggestion.action}>
      <img className="cPalette__search-result-icon" src={suggestion.icon.path} />
      <div className="cPalette__search-result-title-info">
        <div
          className="cPalette__search-result-title"
          dangerouslySetInnerHTML={{__html: suggestion.textWithMatchedChars || suggestion.keyword}}>
        </div>
        <div
          class="cPalette__search-result-subtitle"
          dangerouslySetInnerHTML={{__html: suggestion.subtitle}}>
        </div>
      </div>
    </li>
  )

  return element
}



utils.renderSuggestions = function (suggestions) {
  suggestions.forEach((suggestion) => {
    const searchResult = utils.createSuggestionElement(suggestion)
    window.searchResultsList.appendChild(searchResult)
  })
  utils.highlightTopSuggestion()
}





utils.getMatches = function(userInput, suggestions) {
  const matches = fuzzaldrinPlus
    .filter(suggestions, userInput, {key: 'keyword', maxResults: 20})
    .map((matchedResult) => {
      matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.keyword, utils.userQuery())
      return matchedResult
    })
  return matches
}


utils.getFallbackSuggestions = function(userInput) {
  const fallbackSuggestions = []
  //Check if input is a math expression
  if(utils.isValidMathExpression(userInput)) {
    const mathResult = utils.evalMathExpression(userInput).toString()
    fallbackSuggestions.push(utils.displayValidMathResult(mathResult))
  }
  if(utils.isIncompleteMathExpression(userInput)) {
    fallbackSuggestions.push(utils.displayIncompleteMathError)
  }

  if(window.searchInput.value !== '') {
    utils.fallbackWebSearches.forEach((fallbackSearch) => {
      fallbackSuggestions.push(fallbackSearch())
    })
  }

  return fallbackSuggestions
}










//****************************Math utilities********************************/
utils.evalMathExpression = function(string) {
  return mathexp.eval(string)
}

utils.isValidMathExpression = function(string) {
  try {
    mathexp.eval(string)
    return true
  }
  catch(exception) {
    return false
  }
}

utils.isIncompleteMathExpression = function(string) {
  try {
    mathexp.eval(string)
    return false
  }
  catch(exception) {
    if(exception.message === "complete the expression" && string !== '') {
      return true
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


/**
 * Resets the appearance of the launcher to the default color (page only.)
 *@returns {void}
 */
utils.resetFakeAppTheme = () => {
  //update root variables on the page.
  for (const key in utils.defaultThemeConfig) {
    if (utils.defaultThemeConfig.hasOwnProperty(key)) {
      utils.updateCSSVariable(key, utils.defaultThemeConfig[key])
    }
  }
}

utils.resetThemeInputValue = (input) => {
  const themeProperty = input.dataset.cssvariable
  let themeConfigValue = utils.defaultThemeConfig[themeProperty]

  if (input.type === 'number') {
    themeConfigValue = themeConfigValue.slice(0, -2) // 500px -> 500
  }
  //update the value attribute in the markup to reflect changes (not the live value)
  input.setAttribute('value', themeConfigValue)
  //update the value 'property' on the element (contains live value)
  input.value = themeConfigValue
}

/**
 * Updates a CSS variable's value.
 * @param  {string} propertyName
 * @param  {string} value
 * @param  {HTMLElement} element
 * @returns {void}
 */
utils.updateCSSVariable = function updateCSSVariable(propertyName, value, element = document.documentElement) {
  element.style.setProperty(propertyName, value)
}


/**
 *@description
 Update the 'value' property on an input value on change, then
 update the root variable values on the page.
 */
utils.handleThemeInputValueChanges = (event) => {
  const element = event.target
  const valueSuffix = element.dataset.sizing || ''
  const cssProperty = element.dataset.cssvariable
  const cssPropertyValue = element.value + valueSuffix

  utils.updateCSSVariable(`${cssProperty}`, cssPropertyValue)
}









//****************************CHROME EXTENSION UTILITIES*******************/
utils.isFolder = (node) => 'children' in node
utils.isBookmark = (node) => 'url' in node

utils.useAvalableExtensionIcon = function useAvalableExtensionIcon(extension) {
  if(typeof extension.icons !== 'object') {
    return 'images/blank-page-icon.png'
  }
  const icon = extension.icons[3] || extension.icons[2] || extension.icons[1] || extension.icons[0]
  return icon.url
}

//TODO.........remove
utils.switchToTabById = function switchToTabById(windowId, tabId) {
  // since chrome.tabs.update is limited to switching to tabs only within the current window
  // we need to switch to the window we need first.
  return function closureFunc() {
    chrome.windows.update(windowId, {focused: true}, () => {
      chrome.tabs.update(tabId, {'active': true})
    })
  }
}

utils.uninstallExtension = function uninstallExtension(extension) {
  return function closureFunc() {
    const options = {showConfirmDialog: true}
    chrome.management.uninstall(extension.id, options)
  }
}





























/**
 * Contains the default configuration for the appearance of the command palette.
 * @type {Object}
 */
utils.defaultThemeConfig = {
  //classic #FFFFFF is the default theme

  // element background colors
  "--app-background-color": "#222222",
  "--app-width-size": "500px",
  "--search-input-background-color": "#222222",
  "--search-input-caret-color": "#FFFFFF",
  "--search-results-scrollbar-color": "#FFFFFF",
  "--selected-search-result-item-background-color": "#000000",

  // text sizing
  "--search-input-value-text-size": "30px",
  "--search-result-item-title-text-size": "16px",
  "--search-result-item-subtitle-text-size": "14px",



  //text colors
  "--search-input-value-text-color": "#FFFFFF",
  "--selected-search-result-item-title-text-color": "#FFFFFF",
  "--selected-search-result-item-subtitle-text-color": "#FFFFFF",
  "--selected-search-result-item-character-match-color": "#FFFFFF",
  "--search-result-item-title-text-color": "#FFFFFF",
  "--search-result-item-subtitle--text-color": "#FFFFFF",
  "--search-result-item-character-match-color": "#FFFFFF",

  //spacing
  "--search-results-scrollbar-width": "2px"
}



// This is uglyAF, but it work... MVP!
// Fallback searches should be abstracted out of this file.
utils.fallbackWebSearches = [
  function fallbackSearch() {

    function search(query) {
      return function closureFunc() {
        chrome.tabs.create({url: `https://www.google.com/search?q=${encodeURIComponent(query)}`})
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
]


module.exports = utils
