const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Disable All Extensions",
  subtitle: 'Disables all active chrome extensions',
  action: disableAllExtensions,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function disableAllExtensions() {
  const extensionsAndApps = await browser.management.getAll()
  const extensions = extensionsAndApps
    .filter((extensionOrApp) => {
      return extensionOrApp.type === 'extension' &&
        extensionOrApp.name !== "Cato"
    })
  extensions.forEach((extension) => browser.management.setEnabled(extension.id, false))
  window.close()
}

module.exports = plugin
