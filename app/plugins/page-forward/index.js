const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Forward",
  subtitle: 'Go forward a page.',
  action: goPageForward,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

async function goPageForward() {
  await browser.tabs.executeScript(null, {code: `window.history.forward()`})
  window.close()
}

module.exports = plugin
