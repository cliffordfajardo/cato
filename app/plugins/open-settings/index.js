module.exports = {
  keyword: "Settings",
  subtitle: 'Open the browser\'s settings page.',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.tabs.create({url: "chrome://settings"});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
