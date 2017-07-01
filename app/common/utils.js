const util = {};

util.debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;

    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

utils.isAlphaNumeric = function(event){
  let input = event.keyCode;
  if(/[a-zA-Z0-9-_ ]/.test(input)){
    return true;
  }
  return false;
}

utils.isUpOrDownArrow = function(event){
  if(event.keyCode == 38 || event.keyCode === 40){
    return true;
  }
  return false;
}

utils.upArrowKey = 38;
utils.downArrowKey = 40;

/****************************BROWSWER ACTIONS*****************************
 * The following browser actions can only called from the background script
 * context. Using these functions in our content scripts, which run in the
 * context of web pages, will break our extension.
 ***********************************************************************/

/**
 * @description Creates a new tab taking the user to his/her bookmarks.
 * @example  utils.openBookmarksTab();
 * @return {void}
 */
utils.openBookmarksTab = function openBookmarksTab(){
  chrome.tabs.create({url: "chrome://bookmarks"});
}

/**
 * @description Creates a new tab taking the user to his/her recent downloads.
 * @example * @example utils.openDownloadsTab();
 * @return {void}
 */
utils.openDownloadsTab = function openDownloadsTab(){
  chrome.tabs.create({url: "chrome://downloads"});
}

/**
 * @description Creates a new tab taking the user to his/her chrome extensions.
 * @example * @example utils.openExtensionsTab();
 * @return {void}
 */
utils.openExtensionsTab = function openExtensionsTab(){
  chrome.tabs.create({url: "chrome://extensions"});
}

/**
 * @description Creates a new tab taking the user to his/her bookmarks.
 * @example  utils.openBookmarksTab();
 * @return {void}
 */
utils.openIncognitoWindow = function openIncognitoWindow() {
  chrome.windows.create({'incognito': true});
}

/**
 * @description Creates a new blank browser tab.
 * @example utils.openNewTab();
 * @return {void}
 */
utils.openNewTab = function openNewTab() {
  chrome.tabs.create({});
}

/**
 * @description Creates a new blank browswer window.
 * @example utils.openNewWindow();
 * @return {void}
 */
utils.openNewWindow = function openNewTab() {
    chrome.windows.create({});
}

/**
 * @description Creates a new tab taking the user to his/her settings.
 * @example  utils.openSettingsTab();
 * @return {void}
 */
utils.openSettingsTab = function openExtensionsTab(){
  chrome.tabs.create({url: "chrome://settings"});
}



/**
 * @description a list of search suggestions for our 'fuzzy' module to
 * search and filter through.
 */
utils.searchSuggestions = [
  {
    text: "Open Bookmarks",
    action: function(){chrome.runtime.sendMessage({action: 'openBookmarksTab'})}
  },
  {
    text: "Open Downloads",
    action: function(){chrome.runtime.sendMessage({action: 'openDownloadsTab'})}
  },
  {
    text: "Open Extensions",
    action: function(){chrome.runtime.sendMessage({action: 'openExtensionsTab'})}
  },
  {
    text: "Open Incognito Window",
    action: function(){chrome.runtime.sendMessage({action: 'openIncognitoWindow'})}
  },
  {
    text: "Open New Tab",
    action: function(){chrome.runtime.sendMessage({action: 'openNewTab'})}
  },
  {
    text: "Open New Window",
    action: function(){chrome.runtime.sendMessage({action: 'openNewWindow'})}
  },
  {
    text: "Open Settings",
    action: function(){chrome.runtime.sendMessage({action: 'openSettingsTab'})}
  }
];
module.exports = utils;
