const utils = require('../../util.js');

module.exports = {
  keyword: "Find/Change Tab",
  subtitle: 'Find an open tab and change to it.',
  valid: true,
  autcomplete: false,
  action: function() {
    window.searchInput.value = '';
    window.searchResultsList.innerHTML = "";
    window.searchInput.setAttribute('placeholder', 'Search for a Tab');
    window.currentSearchSuggestions = [];

    chrome.windows.getAll({populate: true}, (browserWindows) => {
      browserWindows.forEach((browserWindow) => {
        browserWindow.tabs.forEach((tab) => {
          const suggestion = {
            'action': utils.switchToTabById(tab.windowId, tab.id),
            'icon': {
              path: tab.favIconUrl || 'images/blank-page.png'
            },
            'keyword': `${tab.title}`,
            subtitle: `${tab.url}`
          };
          window.currentSearchSuggestions.push(suggestion);
        })
      });
      utils.renderSuggestions(window.currentSearchSuggestions);
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
