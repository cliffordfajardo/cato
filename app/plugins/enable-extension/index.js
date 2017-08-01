const utils = require('../../util.js');
const sortBy = require('lodash.sortby');

module.exports = {
  keyword: "Enable an Extension",
  subtitle: 'Enable one of your disabled chrome extensions.',
  autcomplete: false,
  valid: true,
  action: function() {
    window.searchInput.value = '';
    window.searchResultsList.innerHTML = "";
    window.searchInput.setAttribute('placeholder', 'Enable an extension');

    chrome.management.getAll((extensionsAndApps) => {
      let extensions = extensionsAndApps
        .filter((extensionOrApp) => {
          return extensionOrApp.type === 'extension' &&
            extensionOrApp.name !== "Awesome Task Launcher" &&
            !extensionOrApp.enabled;
        })

      extensions = sortBy(extensions, ['name'])

      window.currentSearchSuggestions = extensions.map((extension) => {
        const suggestion = {
          keyword: `${extension.name}`,
          action: () => chrome.management.setEnabled(extension.id, true),
          icon: {
            path: utils.useAvalableExtensionIcon(extension)
          }
        };
        return suggestion;
      });

      // display a message nothing found
      if(window.currentSearchSuggestions.length === 0) {
        const noInactiveExtensionMessage = {
          keyword: 'No Disabled Extensions Found',
          icon: {
            path: 'images/chrome-icon.png'
          }
        }
        window.currentSearchSuggestions.push(noInactiveExtensionMessage);
        utils.renderSuggestions(window.currentSearchSuggestions);
      }
      else {
        utils.renderSuggestions(window.currentSearchSuggestions);
      }
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
