const utils = {}
const {h} = require('dom-chef')
const fuzzaldrinPlus = require('fuzzaldrin-plus')
const mathexp = require('math-expression-evaluator')
const browser = require('webextension-polyfill')

utils.highlightTopSuggestion = () => {
  window.searchResultsList.children[0].classList.add("selected")
}



utils.createSuggestionElement = function(suggestion) {
  const isObject = Object.prototype.toString.call(suggestion) === '[object Object]' ? true: false
  if(isObject) {
    const element = (
      <li className="cLauncher__suggestion" onClick={suggestion.action}>
        <img className="cLauncher__suggestion-icon" src={suggestion.icon.path} />
        <div className="cLauncher__suggestion-title-info">
          <div
            className="cLauncher__suggestion-title dont-break-out"
            dangerouslySetInnerHTML={{__html: suggestion.textWithMatchedChars || suggestion.keyword}}>
          </div>
          <div
            class="cLauncher__suggestion-subtitle dont-break-out"
            dangerouslySetInnerHTML={{__html: suggestion.subtitle}}>
          </div>
        </div>
      </li>
    )
    return element
  }
}



utils.renderSuggestions = function (suggestions) {
  suggestions.forEach((suggestion) => {
    const searchResult = utils.createSuggestionElement(suggestion)
    if(searchResult !== undefined) {
      window.searchResultsList.appendChild(searchResult)
    }
  })
  utils.highlightTopSuggestion()
}





utils.getMatches = function(query, suggestions) {
  const matches = fuzzaldrinPlus
    .filter(suggestions, query, {key: 'keyword', maxResults: 20})
    .map((matchedResult) => {
      matchedResult.textWithMatchedChars = fuzzaldrinPlus.wrap(matchedResult.keyword, query)
      return matchedResult
    })
  return matches
}



utils.displayPotentialMathResult = function(query) {
  try {
    const mathResult = mathexp.eval(query);
    return [{
      keyword: mathResult,
      subtitle: 'Copy number to your clipboard.',
      action: function copyResult() {
        utils.copyToClipboard(mathResult, ev => {
          window.close();
        });
      },
      icon: {
        path: 'images/calculator-icon.svg'
      }
    }]
  }
  catch(exception) {
    if(exception.message === "complete the expression" && query !== '') {
      return [{
        keyword: '...',
        action: '',
        subtitle: 'Please enter a valid math expression.',
        icon: {
          path: 'images/calculator-icon.svg'
        }
      }]
    }
    else {
      return []
    }
  }
}





/**
 * Contains the default configuration for the appearance of the command palette.
 * @type {Object}
 */
utils.defaultThemeConfig = {
  //classic #FFFFFF is the default theme

  // element background colors
  "--app-background-color": "#FFFFFF",
  "--app-width-size": "500px",
  "--search-input-caret-color": "#222222",
  "--search-results-scrollbar-color": "#222222",
  "--selected-suggestion-background-color": "#222222",

  // text sizing
  "--search-input-value-text-size": "30px",
  "--suggestion-title-text-size": "16px",
  "--suggestion-subtitle-text-size": "14px",



  //text colors
  "--search-input-value-text-color": "#222222",
  "--selected-suggestion-title-text-color": "#FFFFFF",
  "--selected-suggestion-subtitle-text-color": "#FFFFFF",
  "--selected-suggestion-character-match-color": "#FFFFFF",
  "--suggestion-title-text-color": "#222222",
  "--suggestion-subtitle-text-color": "#222222",
  "--suggestion-character-match-color": "#222222",

  //spacing
  "--search-results-scrollbar-width": "2px"
}


/**
 * Resets the appearance of the launcher to the default color (page variables only, not localstorage)
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


/**
 * Resets the theme values in localstorage to our defaults.
 *@returns {void}
 */
utils.resetLocalStorageTheme = async () => {
  await browser.storage.sync.set({themeConfig: utils.defaultThemeConfig})
}


/**
 * Resets the theme input value back to the default value defined in our utilities (page only, not localstorage)
 * @param {HTMLElement} input an input element
 */
utils.resetThemeInputValue = (input) => {
  const themeProperty = input.dataset.cssvariable
  let themeConfigValue = utils.defaultThemeConfig[themeProperty]

  if (input.type === 'number') {
    themeConfigValue = themeConfigValue.slice(0, -2) // 500px -> 500
  }
  //update the value attribute in the markup to reflect changes (not the live value)
  //update the value 'property' on the element (contains live value)
  input.setAttribute('value', themeConfigValue)
  input.value = themeConfigValue
}

/**
 * Updates a CSS variable's value.
 * @param  {string} propertyName
 * @param  {string} value
 * @param  {HTMLElement} element the element we want to append/modify css to.
 */
utils.updateCSSVariable = (propertyName, value, element = document.documentElement) => {
  element.style.setProperty(propertyName, value)
}


/**
 *@description
 *Update the 'value' property on an input value on change, then updates the root css variable values on the page.
 */
utils.handleThemeInputValueChanges = async (event) => {
  const element = event.target
  const valueSuffix = element.dataset.sizing || ''
  const cssProperty = element.dataset.cssvariable
  const cssPropertyValue = element.value + valueSuffix
  const update = {[cssProperty]: cssPropertyValue}

  utils.updateCSSVariable(`${cssProperty}`, cssPropertyValue)
  //update local storage
  const {themeConfig} = await browser.storage.sync.get('themeConfig')
  const newThemeConfig = Object.assign(themeConfig, {[cssProperty]: cssPropertyValue})
  await browser.storage.sync.set({themeConfig: newThemeConfig})

}

utils.useAvalableExtensionIcon = function useAvalableExtensionIcon(extension) {
  if(typeof extension.icons !== 'object') {
    return 'images/blank-page-icon.svg' }
  const icon = extension.icons[3] || extension.icons[2] || extension.icons[1] || extension.icons[0]
  return icon.url
}

utils.copyToClipboard = function copyToClipboard(value, cb = function() {} ) {
  document.addEventListener('copy', (event) => {
      event.preventDefault(); // Prevents the default behavior of copying, ex: pressing Ctrl+C
      // If we didn't prevent the prevent default, the clipboard would be filled with what ever the user had highlighted on the page.
      event.clipboardData.setData('text/plain', value);
      cb(event);
  }, { once: true })
  document.execCommand('copy');  
}

module.exports = utils
