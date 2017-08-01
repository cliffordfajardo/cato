module.exports = {
  keyword: "Forward",
  subtitle: 'Go forward a page.',
  autcomplete: false,
  valid: true,
  action: function() {
    chrome.tabs.executeScript(null, {code: `window.history.forward()`});
    window.close();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
