const browser = require('webextension-polyfill')
const utils = require('../../util.js')

const plugin = {
  keyword: "Change Tab",
  subtitle: 'Find an open tab and change to it.',
  valid: false,
  hasSearchScope: true,
  autocomplete: true,
  action: findTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function findTab() {
  window.currentSearchSuggestions = []
  let allTabs = []

  if (!plugin.valid && plugin.autocomplete) {
    window.searchInput.value = `${plugin.keyword} `
    window.searchResultsList.innerHTML = ""

    const allWindows = await browser.windows.getAll({populate: true})
    allWindows.forEach((browserWindow) => {
      allTabs = allTabs.concat(browserWindow.tabs)
    })

    allTabs.forEach((tab) => {
      const suggestion = {
        'action': utils.switchToTabById(tab.windowId, tab.id),
        'icon': {
          path: tab.favIconUrl || 'images/blank-page.png'
        },
        'keyword': `${tab.title}`,
        subtitle: `${tab.url}`
      }
      window.currentSearchSuggestions.push(suggestion)
    })

    utils.renderSuggestions(window.currentSearchSuggestions)
  }
}

module.exports = plugin
