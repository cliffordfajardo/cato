module.exports = {
  keyword: "Reload Tab",
  subtitle: 'Reload the current tab.',
  action: function() {
    chrome.tabs.reload();
    window.close();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
