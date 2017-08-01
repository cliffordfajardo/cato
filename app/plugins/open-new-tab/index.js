module.exports = {
  keyword: "New Tab",
  subtitle: 'Open a new tab in the current window.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
