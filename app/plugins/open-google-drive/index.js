const browser = require('webextension-polyfill')
const plugin = {
  keyword: "Google Drive",
  subtitle: 'Open Google Drive.',
  action: openGoogleDrive,
  icon: {
    path: 'images/google-drive-icon.svg.svg'
  }
}

async function openGoogleDrive() {
  await browser.tabs.create({url: "https://drive.google.com"})
}

module.exports = plugin
