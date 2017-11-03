const browser = require('webextension-polyfill')

const plugin = {
  keyword: "Apps",
  subtitle: 'View your installed browser applications.',
  action: openApps,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function openApps() {
  await browser.tabs.create({url: "chrome://apps"})
}

module.exports = plugin
