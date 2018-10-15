require('../popup/popup.scss')
const utils = require('../../util.js')
const browser = require('webextension-polyfill')
const defaultSuggestions = require('../../plugins/plugins.js')
const appHTML = require("../../components/command-palette/command-palette.html")
const fallbackWebSearches = require( '../../plugins/fallback-web-searches/index.js')

/**
 * @description
 * 1. Creates app-used counter in localstorage if undefined, else use existing
 * 2. Creates themeConfig object in localstorage if undefined, else use existing
 */
async function setupLocalStorage() {
  const {themeConfig} = await browser.storage.sync.get('themeConfig')
  if(themeConfig === undefined) {
    await browser.storage.sync.set({themeConfig: utils.defaultThemeConfig})
  }
  // await browser.storage.sync.clear()

}
setupLocalStorage();


/**
 * @description
 * Sets the colors for our app (inside popup window) from our defaultThemeConfig stored in localStorage.
 * We iterate over each key in our defaultThemeConfig, which corresponds to a
 * global CSS variable in our app, and assign the value from our defaultThemeConfig
 * to our global CSS variables.
 * @returns {Promise}
 */
async function setupAppTheme() {
  //we have css variables defined in our css already. Now we just modify them if we have values in our config
  const {themeConfig} = await browser.storage.sync.get('themeConfig')

  for (const key in themeConfig) {
    if (themeConfig.hasOwnProperty(key)) {
      utils.updateCSSVariable(key, themeConfig[key])
    }
  }
}
setupAppTheme()

/**
 * @description
 * Saves the search scopes for some our plugins. For some of our actions like 'Find Bookmark',
 * we prepend the search scope for the action to our input and allow the user
 * to type his/her query after the search scope name. Ex 'Find Bookmark 101 ways to cook'.
 *
 * ['Find Bookmark ', 'Change Tab']
 */
const searchScopes = []

defaultSuggestions.forEach((plugin) => {
  if(plugin.searchScope !== undefined) {
    searchScopes.push(plugin.searchScope.toLowerCase())
  }
})

/* ***********************Bootstrap app markup & set up globals**************************/
window.appElement = document.createElement("div")
window.appElement.innerHTML = appHTML
document.body.appendChild(window.appElement)
window.defaultSuggestions = [...defaultSuggestions];
window.currentSearchSuggestions = [...defaultSuggestions]
window.searchInput = document.querySelector(".cLauncher__search")
window.userQuery = ''
window.searchResultsList = document.querySelector(".cLauncher__suggestions")

function rerenderSuggestions(event) {
  window.isWebSearch = false;
  window.isCalculatorResult = false;
  window.searchResultsList.innerHTML = ""
  if(window.searchInput.value === '') {
    window.currentSearchSuggestions = [...defaultSuggestions]
    window.searchResultsList.innerHTML = ""
  }


  let domain = searchScopes.filter((searchScope) => {
    if (window.searchInput.value.toLowerCase().includes(searchScope)) {
      return searchScope
    }
  })[0]



  //if we have "Find Bookmark apple" in the search input only pass everything after for searching.
  if (domain) {
    //userQuery = 'find bookmark async'
    //trimedQuery for matches = 'async'

    //find the plugin to execute based off the domain.
    let x = defaultSuggestions.filter((plugin) => {
      let regex = new RegExp(domain, 'i')
      if(plugin.searchScope != undefined){
        return plugin.searchScope.match(regex)
      }
    })

    let regex = new RegExp(`${domain  } `, 'i')
    let query = window.searchInput.value.split(regex).filter((x) => x.length !== 0).join()
    window.userQuery = query

    const matches = utils.getMatches(query, window.currentSearchSuggestions)
    utils.renderSuggestions(matches)
  }

  else {
    let matches = utils.getMatches(window.searchInput.value, window.currentSearchSuggestions)

    if(matches.length > 0) {
      utils.renderSuggestions(matches)
    }

    else if(utils.displayPotentialMathResult(window.searchInput.value).length > 0){
      utils.renderSuggestions(utils.displayPotentialMathResult(window.searchInput.value))
      window.isCalculatorResult = true;
      ga('send', 'event', 'calculatorResultShowedUp', 'true')
    }

    else if (matches.length === 0 && window.searchInput.value !== '') {
      const results = fallbackWebSearches.map((webSearch) => webSearch(window.searchInput.value))
      utils.renderSuggestions(results)
    }
  }
  window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
}
window.searchInput.addEventListener("input", rerenderSuggestions)


/**
 * Handles up and down keys when the user has focus on the input field, enabling the user
 * to select the search.
 * @param  {event} event
 * @returns {void}
 */
function handleArrowKeysOnInput(event) {
  window.searchInput.focus()
  window.selectedElement = document.querySelector('.selected')

  if(window.selectedElement) {
    const key = {DOWN: event.keyCode === 40, TAB: event.keyCode === 9, UP: event.keyCode === 38, ENTER: event.keyCode === 13}
    if(!window.selectedElement) return;

    if(key.DOWN || key.TAB) {
      // prevent focus on search input so we can keep tabbing down our suggestions while still being able to type
      event.preventDefault()
      if (selectedElement.nextElementSibling !== null) {
        selectedElement.classList.remove('selected')
        selectedElement = selectedElement.nextElementSibling
        selectedElement.classList.add('selected')
        selectedElement.scrollIntoView(false)
      } else {
        //we've reached the end of the list, select the top element
        selectedElement.classList.remove('selected')
        selectedElement = window.suggestionElements[0]
        selectedElement.classList.add('selected')
        selectedElement.scrollIntoView(true)
      }
    }
    else if(key.UP) {
      if (selectedElement.previousElementSibling !== null) {
        selectedElement.classList.remove('selected')
        selectedElement = selectedElement.previousElementSibling
        selectedElement.classList.add('selected')
        if(isVisibleY(selectedElement) === false) {
          selectedElement.scrollIntoView(true)
        }
      } else {
        //we've reached the top of the list
        selectedElement.classList.remove('selected')
        selectedElement = window.suggestionElements[window.suggestionElements.length - 1]
        selectedElement.classList.add('selected')
        selectedElement.scrollIntoView(false)
      }
    }
    else if(key.ENTER && window.searchInput.value) {
      window.selectedElement.click();
      const searchInputValue = window.searchInput.value.toLowerCase();
      const catoCommandName = window.selectedElement.querySelector('.cLauncher__suggestion-title').innerText.toLowerCase(); //This is not the value inside of the search input box.
      const catoCommandSubtitle = window.selectedElement.querySelector('.cLauncher__suggestion-subtitle').innerText.toLowerCase();
      const isFuzzySearchExecution = catoCommandName === searchInputValue ? 'false' : 'true';                               // testing how often a full command is typed versus using fuzzy search.
      const isWebSearch = /^(http|https|www|search|for)/.test(catoCommandName) || /^(http|https|www|search|for)/.test(catoCommandSubtitle);
      const isCalculatorResult = catoCommandSubtitle.includes("copy number to");
      //https://developers.google.com/analytics/devguides/collection/analyticsjs/events

      if(!isWebSearch && !isCalculatorResult) {
        ga('send', 'event', 'executeCommand', catoCommandName);
        ga('send', 'event', 'fuzzySearch', isFuzzySearchExecution);
      }

      if(isWebSearch) {
        ga('send', 'event', 'webSearchCommand', 'true'); // how often do people use web searches? To readers, we don't track queries, just whether you ran a websearch command or not.
      }

      if(window.isCalculatorResult) {
        ga('send', 'event', 'calculatorCopyCommand', 'true'); // how often do people use the calculator? I have a hypothesis that people use the calculator a lot for quick calculations but don't copy to clipboard
      }

      window.suggestionElements.forEach((result, index) => {
        if (result.classList.contains('selected')) {
          ga('send', 'event', 'hitPosition', index+1);
        }
      })
    }
    /**
     * Check if an element is visible inside of it's parent container
     * @param  {HTMLelement}  element
     * @return {Boolean}
     */
    function isVisibleY(element) {
      const elementRect = element.getBoundingClientRect()
      const parentElementRect = element.parentElement.getBoundingClientRect()
      if(elementRect.top <= parentElementRect.bottom === false) return false;
      //check if the element is out of view due to a container scrolling.
      if( (elementRect.top + elementRect.height) <= parentElementRect.top ) return false;
      return elementRect.top <= document.documentElement.clientHeight
    }
  }
}

window.searchInput.addEventListener("keydown", handleArrowKeysOnInput)


browser.commands.onCommand.addListener(function(command) {
  if (command == "toggle-feature") {
    console.log("toggling the feature!");
    setTimeout(() => {
      document.focus()
      window.searchInput.focus()
    },1000)
  }
});

/**
* Google Analytics
* Purpose in Cato app:
* - Used as a counter for tracking cato command usage. This does not track what you write inside the application.
*
* - As the app developer of this app, who is building this app in his spare time at no cost to users,
* I'd like to know how useful this app is to users. Measuring how many times the app is launched gives me an idea how often this
* application is being used.
*/

// // Standard Google Universal Analytics code
(function (i, s, o, g, r, a, m) {
i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
  (i[r].q = i[r].q || []).push(arguments)
}, i[r].l = 1 * new Date(); a = s.createElement(o),
  m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

ga('create', 'UA-41444051-3', 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', function () { }); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/popup.html'); // Specify the virtual path
