const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Reload All Tabs",
  subtitle: 'Reload the current tab.',
  action: reloadAllTabs,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function reloadAllTabs() {
  const allTabs = await browser.tabs.query({currentWindow: true})
  for (const tab of allTabs) {
    await browser.tabs.reload(tab.id)
  }
  window.close()
}

module.exports = plugin
