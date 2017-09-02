const browser = require('webextension-polyfill')
const plugin = {
  keyword: "App Options/Settings",
  subtitle: 'View the settings page for Winfred (this app).',
  valid: true,
  autocomplete: false,
  action: openApplicationOptions,
  icon: {
    path: 'images/chrome-icon.png'
  }
}

async function openApplicationOptions() {
  await browser.runtime.openOptionsPage()
}

module.exports = plugin
