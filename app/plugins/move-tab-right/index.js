const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Move Tab Right",
  subtitle: 'Swap places with the tab on the right.',
  autocomplete: 'Move Tab Right',
  valid: true,
  action: moveTabRight,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function moveTabRight() {
  const allTabs = await browser.tabs.query({'active': true, 'currentWindow': true})
  const currentTab = allTabs[0]
  browser.tabs.move(currentTab.id, {index: currentTab.index + 1})
  window.close()
}

module.exports = plugin
