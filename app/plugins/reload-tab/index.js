const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Reload Tab",
  subtitle: 'Reload the current tab.',
  action: reloadTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function reloadTab() {
  await browser.tabs.reload()
  window.close()
}

module.exports = plugin
