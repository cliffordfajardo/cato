const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Back",
  subtitle: 'Go back a page.',
  autocomplete: false,
  valid: true,
  action: goPageBack,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function goPageBack() {
  await browser.tabs.executeScript(null, {code: `window.history.back()`})
  window.close()
}

module.exports = plugin
