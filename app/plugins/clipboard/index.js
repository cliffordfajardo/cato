//since all our plugins will get required at 'plugins/index.js' the path to utils is the following:
const utils = require('../../util.js');

function myFunc(query) {
  window.searchInput.value = '';
  window.searchResultsList.innerHTML = "";
  window.searchInput.setAttribute('placeholder', 'Select or Search your Clipboard.');
  window.currentSearchSuggestions = [];
  let clipboardHistory = [];

  clipboardHistory = window.db
    .get('browserClipboard')
    .value()
    .reverse();

  // TODO: add time to clipboard
  clipboardHistory.forEach((copiedItem) => {
    const suggestion = {
      keyword: copiedItem.copiedContent,
      subtitle: '',
      icon: copiedItem.iconUrl,
      action: () => {
        document.addEventListener('copy', (event) => {
          event.preventDefault();
          event.clipboardData.setData('text/plain', copiedItem.content);
        }, {once: true});
        document.execCommand('copy');
      },
      preview: copiedItem.copiedContent
    }
    window.currentSearchSuggestions.push(suggestion);

  });
  debugger;
  utils.renderSuggestions(window.currentSearchSuggestions);

}

module.exports = {
  keyword: "Clipboard",
  subtitle: 'View your browser clipboard history.',
  valid: true,
  autcomplete: false,
  // TODO change to query
  action: myFunc,
  icon: {
    path: 'images/chrome-icon.png'
  }
}
