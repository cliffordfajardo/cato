const utils = {};
const mathexp = require('math-expression-evaluator');

/**
 * Creates a new tab taking the user to his/her bookmarks.
 * @returns {void}
 */
utils.openBookmarksTab = function openBookmarksTab() {
  chrome.tabs.create({url: "chrome://bookmarks"});
}


/**
 * Creates a new tab taking the user to his/her recent downloads.
 * @returns {void}
 */
utils.openDownloadsTab = function openDownloadsTab() {
  chrome.tabs.create({url: "chrome://downloads"});
}


/**
 * Creates a new tab taking the user to his/her chrome extensions.
 * @returns {void}
 */
utils.openExtensionsTab = function openExtensionsTab() {
  chrome.tabs.create({url: "chrome://extensions"});
}


/**
 * Creates a new teslab taking the user to his/her bookmarks.
 * @returns {void}
 */
utils.openIncognitoWindow = function openIncognitoWindow() {
  chrome.windows.create({'incognito': true});
}


/**
 * Creates a new blank browser tab.
 * @returns {void}
 */
utils.openNewTab = function openNewTab() {
  chrome.tabs.create({});
}


/**
 * Creates a new blank browswer window.
 * @returns {void}
 */
utils.openNewWindow = function openNewWindow() {
  chrome.windows.create({});
}


/**
 * Creates a new tab taking the user to his/her settings.
 * @returns {void}
 */
utils.openSettingsTab = function openSettingsTab() {
  chrome.tabs.create({url: "chrome://settings"});
}


/**
 * Close all tabs except the active one in the current active window.
 * @returns {void}
 */
utils.closeAllButActiveTabInActiveWindow = function closeAllButActiveTabInActiveWindow() {
  chrome.tabs.query({'active': false, currentWindow: true}, (otherTabs) => {
      const otherTabIds = otherTabs.map((tab) => tab.id);
      chrome.tabs.remove(otherTabIds);
  });
}


/**
 * Mutes/unmutes the active tab.
 * @returns {void}
 * @returns {void}
 */
utils.toggleMuteActiveTab = function toggleMuteActiveTab() {
  chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
    const isMuted = tabs[0].mutedInfo.muted;

    chrome.tabs.update({'muted': !isMuted});
  });
}


/**
 * TODO fix..only muting current tab + hitting it again will not unmute it.
 * Mutes/unmutes all tabs
 * @returns {void}
 */
utils.toggleMuteAllTabs = function toggleMuteAllTabs() {
  chrome.windows.getAll({populate: true}, (browserWindows) => {
    browserWindows.forEach((browserWindow) => {

      browserWindow.tabs.forEach((tab) => {
        const isMuted = tab.mutedInfo.muted;
        chrome.tabs.update({'muted': !isMuted});
      });
    });
  });
}


/**
 * Creates a new tab taking the user to his/her browsing history.
 * @returns {void}
 */
utils.openHistoryTab = function openHistoryTab() {
  chrome.tabs.create({url: "chrome://history"});
}


/**
 * reloads the current tab.
 * @returns {void}
 */
utils.reloadActiveTab = function reloadActiveTab() {
  chrome.tabs.reload();
}


/**
 *  Copies the URL from the current tab & add's it to the user's clipboard.
 * @returns {void}
 */
utils.copyActiveTabUrl = function copyActiveTabUrl() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTabUrl = tabs[0].url;

    document.addEventListener('copy', (event) => {
      const text = activeTabUrl;

      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
    }, {once: true});
    // manually call 'copy', but this is usually triggered when user does 'cmd-c'
    document.execCommand('copy');
  });
}


/**
 * duplicates the current tab in a new tab.
 * @returns {void}
 */
utils.duplicateActiveTab = function duplicateActiveTab() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTabUrl = tabs[0].url;

    chrome.tabs.create({url: activeTabUrl});
  });
}


/**
 * Copies the current tab's URL & creates a new incognito window with the URL of the old tab.
 * @returns {void}
 */
utils.cloneTabToIncognitoWindow = function cloneTabToIncognitoWindow() {
  // grab the URL of the current tab
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTabUrl = tabs[0].url;

    chrome.windows.create({incognito: true, url: activeTabUrl});
  });
}


/**
 * Toggles full screen mode for the current tab.
 * @returns {void}
 */
utils.toggleFullscreenForActiveWindow = function toggleFullscreenForActiveWindow() {
  chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (activeWindow) => {
    const isFullScreen = activeWindow.state === 'fullscreen';

    if (isFullScreen) {
      chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: "normal"});
    }
    else {
      chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: "fullscreen"});
    }
  });
}


/**
 * brings up the print window for a webpage.
 * @returns {void}
 */
utils.printActiveTab = function printActiveTab() {
  chrome.tabs.executeScript(null, {code: `window.print();`});
}


/**
 * Closes the active tab.
 * @returns {void}
 */
utils.closeActiveTab = function closeActiveTab() {
  chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];

    chrome.tabs.remove(activeTab.id);
  });
}


/**
 * Creates a new tab to gmail.
 * @returns {void}
 */
utils.openGmailTab = function openGmailTab() {
  chrome.tabs.create({url: "https://mail.google.com"});
}


/**
 * Creates a new tab to gmail.
 * @returns {void}
 */
utils.openGoogleDriveTab = function openGoogleDriveTab() {
  chrome.tabs.create({url: "https://drive.google.com"});
}


/**
 * Creates a new tab to google calendar.
 * @returns {void}
 */
utils.openGoogleCalendarTab = function openGoogleCalendarTab() {
  chrome.tabs.create({url: "https://calendar.google.com"});
}


/**
 * Given a windowId & tabId, changes a user's current tab to another tab (in same window or out).
 * @param  {string} windowId
 * @param  {number} tabId
 * @returns {void}
 */
utils.switchToTabById = function switchToTabById(windowId, tabId) {
  // since chrome.tabs.update is limited to switching to tabs only within the current window
  // we need to switch to the window we need first.
  return function closureFunc() {
    chrome.windows.update(windowId, {focused: true}, () => {
      chrome.tabs.update(tabId, {'active': true});
    })
  }
}


/**
 * Searches Wikipedia with the query provided by a user in a new tab.
 * @param  {string} query
 * @returns {void}
 */
utils.openWikiSearchInNewTab = function openWikiSearchInNewTab(query) {
  return function closureFunc() {
    chrome.tabs.create({url: `http://en.wikipedia.org/wiki/${encodeURI(query)}`});
  }
}


/**
 * Searches YouTube with the query provided by a user in a new tab.
 * @param  {string} query
 * @returns {void}
 */
utils.openYoutubeSearchInNewTab = function openYoutubeSearchInNewTab(query) {
  return function closureFunc() {
    chrome.tabs.create({url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`});
  }
}


/**
 * Searches google with the query provided by a user in a new tab.
 * @param  {string} query
 * @returns {void}
 */
utils.openGoogleSearchInNewTab = function openGoogleSearchInNewTab(query) {
  return function closureFunc() {
    chrome.tabs.create({url: `https://www.google.com/search?q=${encodeURIComponent(query)}`});
  }
}


/**
 * Searches gmail with the query provided by a user in a new tab.
 * @param {string} query
 * @returns {void}
 */
 utils.openGmailSearchInNewTab = function openGmailSearchInNewTab(query) {
   return () => {
     chrome.tabs.create({url: `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`});
   }
 }


/**
 * Searches google drive with the query provided by a user in a new tab.
 * @param {string} query
 * @returns {void}
 */
 utils.openGoogleDriveSearchInNewTab = function openGoogleDriveSearchInNewTab(query) {
   return function closureFunc() {
     chrome.tabs.create({url: `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(query)}`});
   }
 }


/**
 * Searches amazon drive with the query provided by a user in a new tab.
 * @param {string} query
 * @returns {void}
 */
 utils.openAmazonSearchInNewTab = function openAmazonSearchInNewTab(query) {
   return function closureFunc() {
     chrome.tabs.create({url: `https://www.amazon.com/s/?url=search-alias%3Daps&field-keywords=${encodeURIComponent(query)}`});
   }
 }


/**
 * Determines if the string is a valid math expression.
 * @param  {string}  userInput
 * @returns {boolean}
 * @example
 * utils.isValidMathExpression('1+1')  //true
 */
utils.isValidMathExpression = function isValidMathExpression(userInput) {
  try {
    mathexp.eval(userInput);
    return true;
  }
  catch(exception) {
    return false;
  }
}

/**
 * Determines if the string is an incomplete math expression
 * @param  {string}  userInput
 * @returns {boolean}
 * @example
 * utils.isIncompleteMathExpression('1+')  //true
 */
utils.isIncompleteMathExpression = function isIncompleteMathExpression(userInput) {
  try {
    mathexp.eval(userInput);
    return false;
  }
  catch(exception) {
    if(exception.message === "complete the expression" && userInput !== '') {
      return true;
    }
  }
}


/**
 * A function that defines the sort order.
 * @param  {any} extension1
 * @param  {any} extension2
 * @returns {array}
 */
utils.sortByName = function sortByName(extension1, extension2) {
  if(extension1.name < extension2.name) {
    return -1
  }
  if(extension1.name > extension2.name) {
    return 1;
  }
  return 0;
}


/**
 * Evaluates a valid math expression.
 * @param  {string} userQuery
 * @returns {number}
 * @example
 * utils.evalMathExpression('1+1') //2
 */
utils.evalMathExpression = function evalMathExpression(userQuery) {
  return mathexp.eval(userQuery);
}


/**
 * disables all extensions except this one.
 * @returns {void}
 */
utils.disableAllExtensions = function disableAllExtensions() {
  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
               extensionOrApp.name !== "Awesome Task Launcher";
      })

    extensions.forEach((extension) => {
      chrome.management.setEnabled(extension.id, false)
    })
  });
}

utils.getAllChromeExtensions = function getAllChromeExtensions() {
  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
               extensionOrApp.name !== "Awesome Task Launcher";
      });

    extensions.forEach((extension) => {
      chrome.management.setEnabled(extension.id, false)
    });
  })
}


/**
 * toggles a chrome extension on/off.
 * @param  {Object} extension ...
 * @returns {void}
 */
utils.toggleExtensionOnOff = function toggleExtensionOnOff(extension) {
  return function closureFunc() {
    let enable = extension.enabled === false;

    chrome.management.setEnabled(extension.id, enable);
    enable = extension.enabled;
  }
}


/**
 * toggles a chrome extension on/off.
 * @param  {Object} extension
 * @returns {void}
 */
utils.uninstallExtension = function uninstallExtension(extension) {
  return function closureFunc() {
    const options = {showConfirmDialog: true};

    chrome.management.uninstall(extension.id, options);
  }
}


/**
 * checks if an extension object has an icon. If it does, we check
 * for the highest available resolution of the icon. If no icon is found for the
 * extension, give a default icon.
 * @param  {object} extension
 * @returns {string}
 */
utils.useAvalableExtensionIcon = function useAvalableExtensionIcon(extension) {
  if(typeof extension.icons !== 'object') {
    return 'images/blank-page-icon.png'
  }
  const icon = extension.icons[3] || extension.icons[2] || extension.icons[1] || extension.icons[0];

  return icon.url;
}


// utils.deleteBookmark = function deleteBookmark(bookmark){
//   // chrome.bookmarks.removeTree(bookmark.id)
// }


/**
 * Go forward in the current tab's history.
 * @returns {void}
 */
utils.goBackAPage = function goBackAPage() {
  chrome.tabs.executeScript(null, {code: `window.history.back()`})
}


/**
 * Go forward in the current tab's history.
 * @returns {void}
 */
utils.goForwardAPage = function goForwardAPage() {
  chrome.tabs.executeScript(null, {code: `window.history.forward()`})
}


/**
 * Displays all extensions the user has installed and provides the option to uninstall the extension.
 * @returns {void}
 */
utils.displayAllExtensions = function displayAllExtensions() {
  window.searchInput.value = ''
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Uninstall an extension');

  chrome.management.getAll((extensionsAndApps) => {
    let extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
          extensionOrApp.name !== "Awesome Task Launcher"
      })
      .sort(utils.sortByName);

      window.currentSearchSuggestions = extensions.map((extension) => {
        const action = {
          'keyword': `${extension.name}`,
          'action': utils.uninstallExtension(extension),
          'icon': utils.useAvalableExtensionIcon(extension)
        };
        return action;
      });
      window.renderMatchedSearchResults(window.currentSearchSuggestions);
  });
}


/**
 * Displays all extensions the user has installed and provides the option to uninstall the extension.
 * @returns {void}
 */
utils.displayAllExtensions = function displayAllExtensions() {
  window.searchInput.value = ''
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Uninstall an extension');

  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
          extensionOrApp.name !== "Awesome Task Launcher"
      })
      .sort(utils.sortByName);

      window.currentSearchSuggestions = extensions.map((extension) => {
        const action = {
          'keyword': `${extension.name}`,
          'action': utils.uninstallExtension(extension),
          'icon': utils.useAvalableExtensionIcon(extension)
        };
        return action;
      });
      window.renderMatchedSearchResults(window.currentSearchSuggestions);
  });
}


/**
 * Displays all enabled extensions the user has installed and provides the option to disable an extension.
 * @returns {void}
 */
utils.displayActiveExtensions = function displayActiveExtensions() {
  window.searchInput.value = ''
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Disable an extension');

  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
          extensionOrApp.name !== "Awesome Task Launcher" &&
          extensionOrApp.enabled;
      })
      .sort(utils.sortByName);

      window.currentSearchSuggestions = extensions.map((extension) => {
        const action = {
          keyword: `${extension.name}`,
          action: () => chrome.management.setEnabled(extension.id, false),
          icon: utils.useAvalableExtensionIcon(extension)
        };
        return action;
      });
      // display a message nothing found
      if(window.currentSearchSuggestions.length === 0) {
        const noInactiveExtensionMessage = {
          keyword: 'No Active Extensions Found',
          icon: 'images/chrome-icon.png'
        }
        window.currentSearchSuggestions.push(noInactiveExtensionMessage);
        window.renderMatchedSearchResults(window.currentSearchSuggestions);
      }
      else {
        window.renderMatchedSearchResults(window.currentSearchSuggestions);
      }
  });
}


/**
 * Displays all extensions the user has installed and provides the option to uninstall the extension.
 * @returns {void}
 */
utils.displayInactiveExtensions = function displayInactiveExtensions() {
  window.searchInput.value = '';
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Enable an extension');

  chrome.management.getAll((extensionsAndApps) => {
    const extensions = extensionsAndApps
      .filter((extensionOrApp) => {
        return extensionOrApp.type === 'extension' &&
          extensionOrApp.name !== "Awesome Task Launcher" &&
          !extensionOrApp.enabled;
      })
      .sort(utils.sortByName);

      window.currentSearchSuggestions = extensions.map((extension) => {
        const suggestion = {
          keyword: `${extension.name}`,
          action: () => chrome.management.setEnabled(extension.id, true),
          icon: utils.useAvalableExtensionIcon(extension)
        };
        return suggestion;
      });

      // display a message nothing found
      if(window.currentSearchSuggestions.length === 0) {
        const noInactiveExtensionMessage = {
          keyword: 'No Disabled Extensions Found',
          icon: 'images/chrome-icon.png'
        }
        window.currentSearchSuggestions.push(noInactiveExtensionMessage);
        window.renderMatchedSearchResults(window.currentSearchSuggestions);
      }
      else {
        window.renderMatchedSearchResults(window.currentSearchSuggestions);
      }
  });
}


/**
 * Display all open tabs across all windows to the user. Selecting a tab will move the user to that tab.
 * @returns {void}
 */
utils.displayOpenTabs = function displayOpenTabs() {
  window.searchInput.value = '';
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Search for a Tab');
  window.currentSearchSuggestions = [];

  chrome.windows.getAll({populate: true}, (browserWindows) => {
    browserWindows.forEach((browserWindow) => {
      browserWindow.tabs.forEach((tab) => {
        const suggestion = {
          'action': utils.switchToTabById(tab.windowId, tab.id),
          'icon': tab.favIconUrl || 'images/blank-page.png',
          'keyword': `${tab.title}`
        };
        window.currentSearchSuggestions.push(suggestion);
      })
    });
    window.renderMatchedSearchResults(window.currentSearchSuggestions.sort(utils.sortByName));
  });
}

/**
 * Displays the result of a valid math expression.
 * @param  {string} value
 * @returns {object}
 */
utils.displayValidMathResult = function displayValidMathResult(value) {
  return {
    'subtext': 'Copy this number to your clipboard.',
    'icon': 'images/calculator-icon.png', // need to fix this is hacky
    textWithMatchedChars: value
  }
}

/**
 * Display this message if the user input is a partially complete math expression.
 */
utils.displayIncompleteMathError = {
  'subtext': 'Please enter a valid expression',
  'icon': 'images/calculator-icon.png', // need to fix this is hacky
  textWithMatchedChars: '...'
}

utils.togglePlayVideo = function togglePlayVideo() {
  chrome.tabs.executeScript(null, {
    code: `
      function togglePlayVideo(){
        let video = document.querySelector('video');
        if(video){
          if(video.paused){
            video.play();
          } else {
            video.pause()
          }
        }
      }
      togglePlayVideo()
    `
  })
}

utils.changePlayRate05 = function changePlayRate05() {
  chrome.tabs.executeScript(null, {
    code: `
      function changePlayRate(){
        let video = document.querySelector('video');
        if(video){
          video.playbackRate = 0.5;
        }
      }
      changePlayRate()
    `
  })
}
utils.changePlayRate1 = function changePlayRate1() {
  chrome.tabs.executeScript(null, {
    code: `
      function changePlayRate(){
        let video = document.querySelector('video');
        if(video){
          video.playbackRate = 1;
        }
      }
      changePlayRate()
    `
  })
}


utils.changePlayRate2 = function changePlayRate2() {
  chrome.tabs.executeScript(null, {
    code: `
      function changePlayRate(){
        let video = document.querySelector('video');
        if(video){
          video.playbackRate = 2;
        }
      }
      changePlayRate()
    `
  })
}


/*
Add commands liek so.. what if we get a 10 matches and the one we want is at position 5..we don't want to requeyr
'shortcut': {
        'windows': ['^', 'R'],
        'mac': ['⌘', '1...9']
    }
*/


utils.defaultSeachSuggestions = [
  {
    keyword: "Open Bookmarks",
    subtext: "chrome://bookmarks",
    action: utils.openBookmarksTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Open Downloads",
    subtext: 'chrome://downloads',
    action: utils.openDownloadsTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Open Extensions",
    subtext: 'chrome://extensions',
    action: utils.openExtensionsTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Open History",
    subtext: "chrome://history",
    action: utils.openHistoryTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Open Incognito Window",
    action: utils.openIncognitoWindow,
    icon: 'images/incognito-icon.png'
  },
  {
    keyword: "Open New Tab",
    action: utils.openNewTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Open New Window",
    action: utils.openNewWindow,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Open Settings",
    subtext: "chrome://settings",
    action: utils.openSettingsTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Gmail",
    action: utils.openGmailTab,
    icon: 'images/gmail-icon.png'
  },
  {
    keyword: "Drive",
    action: utils.openGoogleDriveTab,
    icon: 'images/google-drive-icon.png'
  },
  {
    keyword: "Open Google Calendar",
    action: utils.openGoogleCalendarTab,
    icon: 'images/google-calendar-icon.png'
  },
  {
    keyword: "Reload Current Tab",
    action: utils.reloadActiveTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Copy Current Tab URL",
    action: utils.copyActiveTabUrl,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Duplicate Tab",
    action: utils.duplicateActiveTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Duplicate Tab to Incognito",
    action: utils.cloneTabToIncognitoWindow,
    icon: 'images/incognito-icon.png'
  },
  {
    keyword: "Toggle Fullscreen",
    action: utils.toggleFullscreenForActiveWindow,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Close Tab",
    action: utils.closeActiveTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Mute/Unmute Tab",
    action: utils.toggleMuteActiveTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Mute/Unmute All Tabs",
    action: utils.toggleMuteAllTabs,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Close Tabs Except Current",
    action: utils.closeAllButActiveTabInActiveWindow,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Print Page",
    action: utils.printActiveTab,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Disable All Chrome Extensions",
    subtext: 'All browser extensions (except this one) will be disabled.',
    action: utils.disableAllExtensions,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Go Back",
    subtext: 'All browser extensions (except this one) will be disabled.',
    action: utils.goBackAPage,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Go Forward",
    subtext: 'All browser extensions (except this one) will be disabled.',
    action: utils.goForwardAPage,
    icon: 'images/chrome-icon.png'
  },
  {
    keyword: "Play/Pause",
    action: utils.togglePlayVideo,
    icon: 'images/youtube-icon.png'
  },
  {
    keyword: "Speed: 0.5",
    action: utils.changePlayRate05,
    icon: 'images/youtube-icon.png'
  },
  {
    keyword: "Speed: 1",
    action: utils.changePlayRate1,
    icon: 'images/youtube-icon.png'
  },
  {
    keyword: "Speed: 2x",
    action: utils.changePlayRate2,
    icon: 'images/youtube-icon.png'
  },
  {
    keyword: 'Uninstall an Extension',
    icon: 'images/chrome-icon.png',
    action: utils.displayAllExtensions
  },
  {
    keyword: 'Disable an Extension',
    icon: 'images/chrome-icon.png',
    action: utils.displayActiveExtensions
  },
  {
    keyword: 'Enable an Extension',
    icon: 'images/chrome-icon.png',
    action: utils.displayInactiveExtensions
  },
  {
    keyword: 'Change Tab',
    icon: 'images/chrome-icon.png',
    action: utils.displayOpenTabs
  }
];

utils.fallbackWebSearches = [
  function fallbackSearch() {
    return {
      textWithMatchedChars: `Search Google for: '${window.searchInput.value}'`,
      action: utils.openGoogleSearchInNewTab(window.searchInput.value),
      icon: 'images/google-search-icon.png'
    }
  },
  function fallbackSearch() {
    return {
      textWithMatchedChars: `Search Wikipedia for: '${window.searchInput.value}'`,
      action: utils.openWikiSearchInNewTab(window.searchInput.value),
      icon: 'images/wikipedia-icon.png'
    }
  },
  function fallbackSearch() {
    return {
      textWithMatchedChars: `Search YouTube for: '${window.searchInput.value}'`,
      action: utils.openYoutubeSearchInNewTab(window.searchInput.value),
      icon: 'images/youtube-icon.png'
    }
  },
  function fallbackSearch() {
    return {
      textWithMatchedChars: `Search Google Drive for: '${window.searchInput.value}'`,
      action: utils.openGoogleDriveSearchInNewTab(window.searchInput.value),
      icon: 'images/google-drive-icon.png'
    }
  },
  function fallbackSearch() {
    return {
      textWithMatchedChars: `Search Amazon for: '${window.searchInput.value}'`,
      action: utils.openAmazonSearchInNewTab(window.searchInput.value),
      icon: 'images/amazon-icon.png'
    }
  },
  function fallbackSearch() {
    return {
      textWithMatchedChars: `Search Gmail for: '${window.searchInput.value}'`,
      action: utils.openGmailSearchInNewTab(window.searchInput.value),
      icon: 'images/gmail-icon.png'
    }
  }
];

module.exports = utils;
