const browser = require('webextension-polyfill')

const plugin = {
  keyword: "Amazon",
  subtitle: 'Open Amazon.',
  valid: true,
  autocomplete: false,
  action: openAmazon,
  icon: {
    path: 'images/amazon-icon.png'
  }
}

async function openAmazon() {
  await browser.tabs.create({url: "https://amazon.com"})
}

module.exports = plugin
