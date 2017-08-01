module.exports = {
  keyword: "Back",
  subtitle: 'Go back a page.',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.tabs.executeScript(null, {code: `window.history.back()`});
    window.close();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
