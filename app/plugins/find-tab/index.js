const browser = require('webextension-polyfill')
const utils = require('../../util.js')

const plugin = {
  keyword: "Change Tab",
  subtitle: 'Find an open tab and change to it.',
  valid: false,
  searchScope: 'Change Tab',
  action: findTab,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function findTab() {
  window.currentSearchSuggestions = []
  let allTabs = []

  if (!plugin.valid) {
    window.searchInput.value = `${plugin.searchScope} `
    window.searchResultsList.innerHTML = ""
    console.log('chrome.windows is', chrome.windows)

    chrome.windows.getAll({populate: true}, function(browserWindow) {
      console.log('all windows?', browserWindow)
      browserWindow.forEach((browserWindow) => {
        console.log('browserWindow', browserWindow)
        allTabs = allTabs.concat(browserWindow.tabs); console.log('alltabs is now: ', allTabs);

        allTabs.forEach((tab) => {
          const suggestion = {
            // 'action': switchToTabById(tab.windowId, tab.id),
            'action': switchToTabById(tab.windowId, tab.id),
            'icon': {
              path: tab.favIconUrl || 'images/blank-page-icon.svg'
            },
            'keyword': `${tab.title}`,
            subtitle: `${tab.url}`
          }
          window.currentSearchSuggestions.push(suggestion)
        })

      })
      utils.renderSuggestions(window.currentSearchSuggestions)
      window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
    })

    // const allWindows = await browser.windows.getAll({populate: true})
    // allWindows.forEach((browserWindow) => {
    //   allTabs = allTabs.concat(browserWindow.tabs)
    // })
    //
    // allTabs.forEach((tab) => {
    //   const suggestion = {
    //     'action': switchToTabById(tab.windowId, tab.id),
    //     'icon': {
    //       path: tab.favIconUrl || 'images/blank-page-icon.svg'
    //     },
    //     'keyword': `${tab.title}`,
    //     subtitle: `${tab.url}`
    //   }
    //   window.currentSearchSuggestions.push(suggestion)
    // })

    // utils.renderSuggestions(window.currentSearchSuggestions)
    // window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
  }
}

//Helper
// function switchToTabById(windowId, tabId) {
//   // tabs.update is limited to switching to tabs only within the current window, thus switch to the window we need first.
//   return async function closureFunc() {
//     await browser.windows.update(windowId, {focused:true})
//     await browser.tabs.update(tabId, {'active': true})
//   }
// }
//
//
function switchToTabById(windowId, tabId) {
  // since chrome.tabs.update is limited to switching to tabs only within the current window
  // we need to switch to the window we need first.
  return function closureFunc() {
    chrome.windows.update(windowId, {focused: true}, () => {
      chrome.tabs.update(tabId, {'active': true});
    })
  }
}

module.exports = plugin
