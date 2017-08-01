module.exports = {
  keyword: "Bookmarks",
  subtitle: 'View your bookmarks page.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.tabs.create({url: "chrome://bookmarks"});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
