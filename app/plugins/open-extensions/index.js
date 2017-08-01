module.exports = {
  keyword: "Extensions",
  subtitle: 'View your installed browser extensions.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "chrome://extensions"});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
