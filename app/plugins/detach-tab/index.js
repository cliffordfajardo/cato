module.exports = {
  keyword: "Detach Tab",
  subtitle: 'Detach the current tab & place it in new window.',
  valid: true,
  action: function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0];

      chrome.windows.create({tabId: currentTab.id}, (newWindow) => {
        chrome.tabs.move({windowId: newWindow.id, index: -1});
      });
    })
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
