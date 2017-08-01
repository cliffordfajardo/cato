const domain = require('getdomain');
const sortBy = require('lodash.sortby');

module.exports = {
  keyword: "Sort tabs",
  subtitle: 'Sort tabs by website.',
  valid: true,
  action: function () {
    chrome.windows.getAll({populate: true}, (browserWindows) => {
      browserWindows.forEach((browserWindow) => {
        let browserWindowTabs = [];

        browserWindow.tabs.forEach((tab) => {
          browserWindowTabs.push({id: tab.id, domain: domain.origin(tab.url)})
        });
        browserWindowTabs = sortBy(browserWindowTabs, ['domain']);
        browserWindowTabs.forEach((tab, index) => chrome.tabs.move(tab.id, {index}));
      });
    });
    window.close();
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
