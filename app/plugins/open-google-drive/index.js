const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Google Drive",
  subtitle: 'Open Google Drive.',
  valid: true,
  autocomplete: false,
  action: openGoogleDrive,
  icon: {
    path: 'images/google-drive-icon.png'
  }
}

async function openGoogleDrive() {
  await browser.tabs.create({url: "https://drive.google.com"})
}

module.exports = plugin
