module.exports = {
  keyword: "New Window",
  subtitle: 'Open a new browser window.',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.windows.create({});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
