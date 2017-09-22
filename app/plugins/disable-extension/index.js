const browser = require('webextension-polyfill')
const utils = require('../../util.js')
const sortBy = require('lodash.sortby')

const plugin = {
  keyword: 'Disable Extension',
  subtitle: 'Disable an active chrome extension',
  valid: false,
  searchScope: 'Disable Extension',
  action: displayActiveExtensions,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}



async function displayActiveExtensions() {
  window.currentSearchSuggestions = []

  if (!plugin.valid) {
    window.searchInput.value = `${plugin.searchScope} `
    window.searchResultsList.innerHTML = ""

    const extensionsAndApps = await browser.management.getAll()
    let extensions = extensionsAndApps.filter((extensionOrApp) => {
      return extensionOrApp.type === 'extension' &&
        extensionOrApp.name !== "Cato" &&
        extensionOrApp.enabled
    })

    extensions = sortBy(extensions, ['name'])

    window.currentSearchSuggestions = extensions.map((extension) => {
      const action = {
        keyword: `${extension.name}`,
        action: async () => {
          await browser.management.setEnabled(extension.id, false)
          window.close()
        },
        icon: {
          path: utils.useAvalableExtensionIcon(extension)
        }
      }
      return action
    })

    // display a message if nothing found
    if (window.currentSearchSuggestions.length === 0) {
      const noInactiveExtensionMessage = {
        keyword: 'No Other Active Extensions Found.',
        icon: {
          path: 'images/chrome-icon.svg'
        }
      }
      window.currentSearchSuggestions.push(noInactiveExtensionMessage)
      utils.renderSuggestions(window.currentSearchSuggestions)
    }
    else {
      utils.renderSuggestions(window.currentSearchSuggestions)
      window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
    }

  }
}

module.exports = plugin
