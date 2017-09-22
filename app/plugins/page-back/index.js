const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Back",
  subtitle: 'Go back a page.',
  action: goPageBack,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function goPageBack() {
  await browser.tabs.executeScript(null, {code: `window.history.back()`})
  window.close()
}

module.exports = plugin
