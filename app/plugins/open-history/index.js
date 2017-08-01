module.exports = {
  keyword: "History",
  subtitle: 'Open your search history.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "chrome://history"});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
