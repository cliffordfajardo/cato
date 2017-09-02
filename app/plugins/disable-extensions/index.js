const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Disable All Extensions",
  subtitle: 'Disables all active chrome extensions',
  autocomplete: false,
  valid: true,
  action: disableAllExtensions,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function disableAllExtensions() {
  const extensionsAndApps = await browser.management.getAll()
  const extensions = extensionsAndApps
    .filter((extensionOrApp) => {
      return extensionOrApp.type === 'extension' &&
        extensionOrApp.name !== "Awesome Task Launcher"
    })
  extensions.forEach((extension) => browser.management.setEnabled(extension.id, false))
  window.close()
}

module.exports = plugin
