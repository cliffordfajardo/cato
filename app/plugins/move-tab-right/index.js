module.exports = {
  keyword: "Move Tab Right",
  subtitle: 'Swap places with the tab on the right.',
  autocomplete: 'Move Tab Left',
  valid: true,
  action: function moveActiveTabRight() {
    chrome.tabs.query({'active': true, 'currentWindow': true}, (tabs) => {
      const currentTab = tabs[0];
      chrome.tabs.move(currentTab.id, {index: currentTab.index + 1});
    });
    window.close();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
