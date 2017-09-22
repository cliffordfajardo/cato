const browser = require('webextension-polyfill')
const utils = require('../../util.js')
const sortBy = require('lodash.sortby')

const plugin = {
  keyword: "Enable Extension",
  subtitle: 'Enable one of your disabled chrome extensions.',
  searchScope: 'Enable Extension',
  valid: false,
  action: enableExtension,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function enableExtension() {
  window.currentSearchSuggestions = []
  if (!plugin.valid) {
    window.searchInput.value = `${plugin.searchScope} `
    window.searchResultsList.innerHTML = ""

    const extensionsAndApps = await browser.management.getAll()
    let extensions = extensionsAndApps.filter((extensionOrApp) => {
      return extensionOrApp.type === 'extension' &&
             extensionOrApp.name !== "Awesome Task Launcher" &&
            !extensionOrApp.enabled
    })

    extensions = sortBy(extensions, ['name'])

    window.currentSearchSuggestions = extensions.map((extension) => {
      const suggestion = {
        keyword: `${extension.name}`,
        action: async() => {
          await browser.management.setEnabled(extension.id, true)
          window.close()
        },
        icon: {
          path: utils.useAvalableExtensionIcon(extension)
        }
      }
      return suggestion
    })

    // display a message nothing found
    if (window.currentSearchSuggestions.length === 0) {
      const noInactiveExtensionMessage = {
        keyword: 'No Disabled Extensions Found',
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
