const utils = require('../../util.js');
const sortBy = require('lodash.sortby');

module.exports = {
    keyword: 'Disable Extension',
    subtitle: 'Disable an active chrome extension',
    autocomplete: 'Disable Extension', //hitting enter (for now don't let user tab complete ..use it for scrolling)
    valid: false, //the autocomplete text is populated into Alfred's search field when the user actions the result.
    action: displayActiveExtensions,
    icon: {
      path: 'images/chrome-icon.png'
    }
}

//If the item is set as "valid": false, the auto-complete text is populated into Alfred's search field when the user actions the result.

function displayActiveExtensions() {
  window.searchInput.value = ''
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Disable an extension'); //user should't need to worry about this

  chrome.management.getAll((extensionsAndApps) => {
    let extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
          extensionOrApp.name !== "Awesome Task Launcher" &&
          extensionOrApp.enabled;
      })

    extensions = sortBy(extensions, ['name'])

    window.currentSearchSuggestions = extensions.map((extension) => {
      const action = {
        keyword: `${extension.name}`,
        action: () => chrome.management.setEnabled(extension.id, false),
        icon: {
          path: utils.useAvalableExtensionIcon(extension)
        }
      };
      return action;
    });

    // display a message nothing found
    if(window.currentSearchSuggestions.length === 0) {
      const noInactiveExtensionMessage = {
        keyword: 'No Active Extensions Found',
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
}
