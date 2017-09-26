require('../popup/popup.scss')
const utils = require('../../util.js')
const browser = require('webextension-polyfill')
const defaultSuggestions = require('../../plugins/plugins.js')
const appHTML = require("../../components/command-palette/command-palette.html")
const fallbackWebSearches = require( '../../plugins/fallback-web-searches/index.js')

/**
 * @deacription
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
setupLocalStorage()


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
    else if(key.ENTER) {
      window.selectedElement.click()
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
