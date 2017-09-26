const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Reload All Tabs",
  subtitle: 'Reload all tabs in the current window.',
  action: reloadAllTabs,
  icon: {
    path: 'images/chrome-icon.svg'
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
