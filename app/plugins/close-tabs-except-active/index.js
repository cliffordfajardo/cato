const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Close Tabs Except Current",
  subtitle: 'Closes all tabs in this window except this active one.',
  action: closeTabsExceptCurrent,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function closeTabsExceptCurrent() {
  const otherTabs = await browser.tabs.query({'active': false, currentWindow: true})
  for(const tab of otherTabs) {
    await browser.tabs.remove(tab.id)
  }
  const popupWindow = await browser.extension.getViews({type: 'popup'})[0]
  popupWindow.close()
}

module.exports = plugin
