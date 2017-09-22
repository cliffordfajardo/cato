const browser = require('webextension-polyfill')

const plugin = {
  keyword: "Amazon",
  subtitle: 'Open Amazon.',
  action: openAmazon,
  icon: {
    path: 'images/amazon-icon.svg'
  }
}

async function openAmazon() {
  await browser.tabs.create({url: "https://amazon.com"})
}

module.exports = plugin
