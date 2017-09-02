const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Close Tabs Except Current",
  subtitle: 'Closes all tabs in this window except this active one.',
  valid: true,
  action: closeTabsExceptCurrent,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function closeTabsExceptCurrent() {
  const otherTabs = await browser.tabs.query({'active': false, currentWindow: true})
  for(const tab of otherTabs) {
    await browser.tabs.remove(tab.id)
  }
  window.close()
}

module.exports = plugin
