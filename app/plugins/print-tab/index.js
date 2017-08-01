module.exports = {
  keyword: "Print Tab",
  subtitle: 'Display the print menu for the current page.',
  valid: true,
  autocomplete: false,
  action: function() {
    chrome.tabs.executeScript(null, {code: `window.print();`});
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
