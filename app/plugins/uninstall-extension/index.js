const utils = require('../../util');
const sortBy = require('lodash.sortby');

module.exports = {
  keyword: "Uninstall Extension",
  subtitle: 'Uninstall one of your installed chrome extensions.',
  autcomplete: false,
  valid: true,
  action: function() {
    window.searchInput.value = ''
    window.searchResultsList.innerHTML = "";
    window.searchInput.setAttribute('placeholder', 'Uninstall an extension');

    chrome.management.getAll((extensionsAndApps) => {
      let extensions = extensionsAndApps
        .filter((extensionOrApp) => {
          return extensionOrApp.type === 'extension' &&
            extensionOrApp.name !== "Awesome Task Launcher"
        })
        extensions = sortBy(extensions, ['name']);

        window.currentSearchSuggestions = extensions.map((extension) => {
          const action = {
            'keyword': `${extension.name}`,
            'action': utils.uninstallExtension(extension),
            'icon': {
              path: utils.useAvalableExtensionIcon(extension)
            }
          };
          return action;
        });
        utils.renderSuggestions(window.currentSearchSuggestions);
    });
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
