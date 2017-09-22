const browser = require('webextension-polyfill')
const utils = require('../../util')
const sortBy = require('lodash.sortby')

const plugin = {
  keyword: "Uninstall Extension",
  subtitle: 'Uninstall one of your installed chrome extensions.',
  valid: false,
  searchScope: 'Uninstall Extension',
  action: uninstallExtension,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}
async function uninstallExtension() {
  window.searchInput.value = ''
  window.searchResultsList.innerHTML = ""

  if (!plugin.valid) {
    window.searchInput.value = `${plugin.keyword} `
    window.searchResultsList.innerHTML = ""
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
        'action': uninstall(extension),
        'icon': {
          path: utils.useAvalableExtensionIcon(extension)
        }
      }
      return action
    })
    utils.renderSuggestions(window.currentSearchSuggestions)
    window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
  }

}

//Helper
function uninstall(extension) {
  return async function closureFunc() {
    const options = {showConfirmDialog: true}
    await browser.management.uninstall(extension.id, options)
  }
}

module.exports = plugin
