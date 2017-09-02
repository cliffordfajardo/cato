const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Close Tab",
  subtitle: 'Close the current tab.',
  autocomplete: false,
  valid: true,
  action: closeTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function closeTab() {
  const activeTab = await browser.tabs.query({active: true, currentWindow: true})
  await browser.tabs.remove(activeTab[0].id)
}

module.exports = plugin
