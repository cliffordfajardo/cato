const sortBy = require('lodash.sortby');
const domain = require('getdomain');

module.exports = {
  keyword: "Sort tabs and Merge Windows",
  subtitle: 'Move all tabs to the current window and sort them.',
  valid: true,
  autcomplete: false,
  action: function() {
    chrome.windows.getCurrent((activeWindow) => {
      let allTabs = [];
      let index = 0;

      chrome.windows.getAll({populate: true}, (browserWindows) => {

        browserWindows.forEach((browserWindow) => {

          browserWindow.tabs.forEach((tab) => {
            allTabs.push({id: tab.id, domain: domain.origin(tab.url)})
          });
          allTabs = sortBy(allTabs, ['domain']);

          allTabs.forEach((tab) => {
            chrome.tabs.move(tab.id, {windowId: activeWindow.id, index});
            index += 1;
          });
        });

      });
      window.close();
    })
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
