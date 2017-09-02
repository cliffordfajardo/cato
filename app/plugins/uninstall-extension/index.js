const browser = require('webextension-polyfill')
const utils = require('../../util')
const sortBy = require('lodash.sortby')

const plugin = {
  keyword: "Uninstall Extension",
  subtitle: 'Uninstall one of your installed chrome extensions.',
  autocomplete: false,
  valid: true,
  action: uninstallExtension,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function uninstallExtension() {
  window.searchInput.value = ''
  window.searchResultsList.innerHTML = ""
  window.searchInput.setAttribute('placeholder', 'Uninstall an extension')

  const extensionsAndApps = await browser.management.getAll()
  let extensions = extensionsAndApps
    .filter((extensionOrApp) => {
      return extensionOrApp.type === 'extension' &&
        extensionOrApp.name !== "Awesome Task Launcher"
    })

    extensions = sortBy(extensions, ['name'])

  window.currentSearchSuggestions = extensions.map((extension) => {
    const action = {
      'keyword': `${extension.name}`,
      'action': utils.uninstallExtension(extension),
      'icon': {
        path: utils.useAvalableExtensionIcon(extension)
      }
    }
    return action
  })
  utils.renderSuggestions(window.currentSearchSuggestions)

}

module.exports = plugin
