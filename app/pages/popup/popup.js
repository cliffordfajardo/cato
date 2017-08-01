//Requiring the CSS we will use on this page.
//Webpack will output `options.css` from all these requires
require("../../components/command-palette/command-palette.scss");
require('./popup.scss');

const utils = require('../../util.js');
const defaultPlugins = require('../../plugins/index.js')
const appHTML = require("../../components/command-palette/command-palette.html");
const low = require('lowdb');
let db = low('db');
window.db = db;
// initialize clipboard db
db.defaults({browserClipboard: []}).write();

// initialize appUsedCounter db. Keep track of how many times the user has used this app/
db.defaults({appUsedCounter: []}).write();


//Default values for our launcher (white theme)
db.defaults({
  appearanceSettings: {
    '--command-palette-background-color': '#ffffff',
    '--search-input-background-color': '#ffffff',
    '--search-input-caret-color': '#000000',
    '--search-input-scrollbar-background-color': '#d3d3d3',
    '--search-result-selected-background-color': '#d3d3d3',
    '--search-result-text-keyword-match-color': '#000000',
    '--search-result-text-color': '#000000',
    '--search-input-text-color': '#000000',
    '--search-result-subtitle-color': '#d3d3d3',
    '--search-result-text-size': '15px',
    '--search-result-subtitle-size': '12px',
    '--search-input-text-size': '30px',
    '--search-input-scrollbar-width': '2px'
  }
}).write();


function loadAppereanceConfiguration() {
  //we have css variables defined in our css already. Now we just modify them if we have values in our config
  const appearanceSettings = window.db
    .get('appearanceSettings')
    .value();

  for (const key in appearanceSettings) {
    if (appearanceSettings.hasOwnProperty(key)) {
      utils.updateCSSVariable(key, appearanceSettings[key]);
    }
  }
}
loadAppereanceConfiguration()



/* ***********************Bootstrap app markup & set up globals**************************/
window.appElement = document.createElement("div");
window.appElement.innerHTML = appHTML;
document.body.appendChild(window.appElement);
window.currentSearchSuggestions = defaultPlugins;
window.searchInput = document.querySelector(".cPalette__search");
window.searchResultsList = document.querySelector(".cPalette__search-results");
window.searchInput.focus();
window.searchResultPreview = document.querySelector('.cPalette__search-results-preview');


function rerenderSuggestions(event) {
  utils.clearSearchResults();
  let matches = utils.getMatches(window.searchInput.value, window.currentSearchSuggestions);
  if(matches.length === 0) {
    matches = utils.getFallbackSuggestions(window.searchInput.value);
  }
  utils.renderSuggestions(matches);
}
window.searchInput.addEventListener("input", rerenderSuggestions);


/**
 * Deselect any current suggestions, selects a given suggestions.
 * and then scrolls to show selection.
 * @param {HTMLelement} nextSuggestion
 * @returns {void}
 */
function selectSuggestion(nextSuggestion) {
  window.selectedElement.classList.remove('selected');
  nextSuggestion.classList.add('selected');
  window.selectedElement = nextSuggestion;

}

/**
 * Rescrolls element
 * @returns {void}
 */
function reScroll() {
    try {
      const scrollElement = window.selectedElement.previousSibling.previousSibling
      scrollElement.scrollIntoView(alignToTop=true);
    }
    catch(err) {
  }
}


/**
 * Handles up and down keys when the user has focus on the input field, enabling the user
 * to select the search.
 * @param  {event} event
 * @returns {void}
 */
function handleInputArrowKeys(event) {
  window.searchInput.focus();
  window.selectedElement = document.querySelector('.selected');

  if(window.selectedElement) {
    // event.preventDefault();
    if(event.keyCode === 40 || event.keyCode === 9 /* Down arrow OR Tab keyodes */) {
      const newSuggestion = window.selectedElement.nextElementSibling;
      if(newSuggestion) {
        selectSuggestion(newSuggestion);
        reScroll();
      }
      else {
        // we've hit the bottom of the list so go all the way back up.
        const newSuggestion = window.searchResultsList.children[0];
        selectSuggestion(newSuggestion);
        reScroll();
      }
    }
    else if(event.keyCode === 38 /* Arrow Up */) {
      event.preventDefault();
      const newSuggestion = window.selectedElement.previousSibling;
      if(newSuggestion) {
        selectSuggestion(newSuggestion);
        reScroll();
      }
    }
    else if(event.keyCode === 13 /* Enter key*/) {
      window.selectedElement.click();
    }
    else if(event.which === 8) {
      // Backspace Key
      if(window.searchInput.value === '') {
        // if the user
      }
    }
    // display preview if it has an
      if(window.selectedElement.preview){
        window.searchResultPreview.innerHTML = window.selectedElement.preview;
      }

  }
}

// window.searchInput.addEventListener("keyup", handleInputArrowKeys); //BLOG POST & stackoverflow
window.searchInput.addEventListener("keydown", handleInputArrowKeys); //why does this work?


window.onload = function onload() {
  console.log('LOADED APP: recieved CS message');
  db.get('appUsedCounter')
    .push({date: new Date()})
    .write();

  console.log('counter state: ', db.get('appUsedCounter'))
  console.log('counter length:', db.get('appUsedCounter').value().length)
}

/**
 * Listen for messages sent from the content script.
 *
 * Typical use cases: listening for a clipboard copy event on webpage, sending the copied text to background-script,
 * saving data to popup.html's storage.
 */
chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {

  // When the user copies something to their clipboard
  if (request.type === "webpage-copy-event") {
    console.log('BG: recieved CS message');
    db.get('browserClipboard')
      .push(request)
      .write();
  }



  // When the user copies something to their clipboard
  if (request.type === "get-app-used-count") {
    console.log('BG: got your count message ');
    const appUsedCount = db.get('appUsedCounter')
      .value()
      .length;
    sendResponse(appUsedCount);
  }


});
