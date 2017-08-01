const utils = require('../../util.js')
module.exports = {
  keyword: "Find Bookmark",
  subtitle: 'Search for a bookmark and open it.',
  valid: true,
  autcomplete: false,
  action: function() {
    debugger;
    window.searchInput.value = '';
    window.searchResultsList.innerHTML = "";
    window.searchInput.setAttribute('placeholder', 'Search for a Bookmark');
    window.currentSearchSuggestions = [];

    chrome.bookmarks.getTree((nodes) => {
      // root node starts of in an array like so: [{}]. You can't add/remove stuff from the node (had id:0)
      // eslint-disable-next-line
      function recurseTree(nodes) {
        for(const node of nodes) {
          debugger;
          if(utils.isBookmark(node)) {
            const suggestion = {
              keyword: node.title,
              subtitle: node.url,
              action: () => chrome.tabs.create({url: node.url}),
              icon: {
                path: `chrome://favicon/${node.url}`
              }
            };
            window.currentSearchSuggestions.push(suggestion);
          }
          else if(utils.isFolder(node)) {
            recurseTree(node.children);
          }
        }
      }
      recurseTree(nodes);

      utils.renderSuggestions(window.currentSearchSuggestions);
    })
  },
  icon: {
    path: 'images/chrome-icon.png'
  }
}
