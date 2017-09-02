require('../popup/popup.scss')
const utils = require('../../util.js')
const defaultPlugins = require('../../plugins/plugins.js')
const appHTML = require("../../components/command-palette/command-palette.html")
const browser = require('webextension-polyfill')


/**
 * @deacription
 * 1. Creates app-used counter in localstorage if undefined, else use existing
 * 2. Creates themeConfig object in localstorage if undefined, else use existing
 */
async function setupLocalStorage() {
  // await browser.storage.sync.set({appUsedCounter: []})
  await browser.storage.sync.set({themeConfig: utils.defaultThemeConfig})

  // const ls = await browser.storage.get('themeConf')
  await browser.storage.sync.clear()
  // await browser.storage.sync.set({themeConfig: {}})
}
setupLocalStorage()


/**
 * @description
 * Sets the colors for our app from our defaultThemeConfig stored in localStorage.
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
 * ['find bookmark ']
 */
const searchScopes = []

defaultPlugins.forEach((plugin) => {
  searchScopes.push()
  if(plugin.hasSearchScope) {
    searchScopes.push(`${plugin.keyword.toLowerCase()}`)
  }
})

/* ***********************Bootstrap app markup & set up globals**************************/
window.appElement = document.createElement("div")
window.appElement.innerHTML = appHTML
document.body.appendChild(window.appElement)
window.currentSearchSuggestions = defaultPlugins
window.searchInput = document.querySelector(".cPalette__search")
window.userQuery = ''
window.searchResultsList = document.querySelector(".cPalette__search-results")
window.searchInput.focus()


function rerenderSuggestions(event) {
  utils.clearSearchResults()
  if(window.searchInput.value === '') {
    window.currentSearchSuggestions = defaultPlugins
  }

  const userQuery = window.searchInput.value.toLowerCase()
  let domain = searchScopes.filter((searchScope) => {
    if (userQuery.includes(searchScope)) {
      return searchScope
    }
  })[0]



  //if we have "Find Bookmark apple" in the search input,
  //only pass everything after for searching.
  if (domain) {
    //userQuery = 'find bookmark async'
    //trimedQuery for matches = 'async'

    //find the plugin to executer based off the domain.
    let x = defaultPlugins.filter((plugin) => {
      let regex = new RegExp(domain, 'i')
      return plugin.keyword.match(regex)
    })

    let regex = new RegExp(`${domain  } `, 'i')
    let query = window.searchInput.value.split(regex).filter((x) => x.length !== 0).join()
    window.userQuery = query

    const matches = utils.getMatches(query, window.currentSearchSuggestions)
    utils.renderSuggestions(matches)
  }
 else {
    let matches = utils.getMatches(window.searchInput.value, window.currentSearchSuggestions)

    if (matches.length === 0) {
      matches = utils.getFallbackSuggestions(window.searchInput.value)
    }
    utils.renderSuggestions(matches)
  }



}
window.searchInput.addEventListener("input", rerenderSuggestions)


/**
 * Deselect any current suggestions, selects a given suggestions.
 * and then scrolls to show selection.
 * @param {HTMLelement} nextSuggestion
 * @returns {void}
 */
function selectSuggestion(nextSuggestion) {
  window.selectedElement.classList.remove('selected')
  nextSuggestion.classList.add('selected')
  window.selectedElement = nextSuggestion

}

/**
 * Rescrolls element
 * @returns {void}
 */
function reScroll() {
    try {
      const scrollElement = window.selectedElement.previousSibling.previousSibling
      scrollElement.scrollIntoView(alignToTop = true)
    }
    catch(err) {}
}


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
    // event.preventDefault();


    if(event.keyCode === 40 || event.keyCode === 9 /* Down arrow OR Tab keyodes */) {
      const newSuggestion = window.selectedElement.nextElementSibling
      if(newSuggestion) {
        selectSuggestion(newSuggestion)
        reScroll()
      }
      else {
        // we've hit the bottom of the list so go all the way back up.
        const newSuggestion = window.searchResultsList.children[0]
        selectSuggestion(newSuggestion)
        reScroll()
      }
    }
    else if(event.keyCode === 38 /* Arrow Up */) {
      event.preventDefault()
      const newSuggestion = window.selectedElement.previousSibling
      if(newSuggestion) {
        selectSuggestion(newSuggestion)
        reScroll()
      }
    }
    else if(event.keyCode === 13 /* Enter key*/) {
      window.selectedElement.click()
    }
    else if(event.which === 8) {
      // Backspace Key
      if(window.searchInput.value === '') {
        // if the user
      }
    }
    // display preview if it has an
      if(window.selectedElement.preview) {
        window.searchResultPreview.innerHTML = window.selectedElement.preview
      }

  }
}

window.searchInput.addEventListener("keydown", handleArrowKeysOnInput) //why does this work?


window.onload = function onload() {
  chrome.storage.sync.get('appUsedCounter', (value) => {
    let counter = value
    console.log('counter----------------', value)
    // counter.push({date: new Date()})

  })
}
