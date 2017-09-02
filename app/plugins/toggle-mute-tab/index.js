const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Mute/Unmute Tab",
  subtitle: 'Mute the tab if it\'s unmuted otherwise unmute it.',
  valid: true,
  action: toggleMuteTab,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function toggleMuteTab() {
  const allTabs = await browser.tabs.query({'active': true, currentWindow: true})
  const activeTab = allTabs[0]
  const isMuted = activeTab.mutedInfo.muted

  browser.tabs.update({'muted': !isMuted})
  window.close()
}

module.exports = plugin
