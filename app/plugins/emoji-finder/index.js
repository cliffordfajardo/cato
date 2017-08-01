const utils = require('../../util.js');
const dango = require('dango');

module.exports = {
  keyword: "Emoji",
  subtitle: "Search for an Emoji",
  autcomplete: false,
  valid: true,
  // TODO: change to query
  action: function() {
    window.searchInput.value = '';
    window.searchResultsList.innerHTML = "";
    window.searchInput.setAttribute('placeholder', 'Search for an Emoji');
    window.currentSearchSuggestions = [];

    function findEmoji(query) {
      if (query === '') {
        return;
      }
      console.log(`CALLING findEmoji(${query})`);
      window.currentSearchSuggestions = [];
      dango(query).then(emojiList => {
        let topSuggestionResult = ''; // merge all the results together for the first result
        emojiList.forEach(emoji => topSuggestionResult += emoji.text);
        const topSuggestion = {
          keyword: topSuggestionResult,
          icon: {
            path: 'images/dango-icon.png'
          },
          action: () => {
            document.addEventListener('copy', (event) => {
              event.preventDefault();
              event.clipboardData.setData('text/plain', topSuggestionResult);
            }, {once: true});
            document.execCommand('copy');
          }
        }
        window.currentSearchSuggestions.push(topSuggestion);

        emojiList.forEach((emoji) => {
          const suggestion = {
            keyword: emoji.text,
            icon: {
              path: 'images/dango-icon.png'
            },
            action: () => {
              //todo: hitting enter on a list item should copy it or invoke it...this should be abstracted away
              document.addEventListener('copy', (event) => {
                event.preventDefault();
                event.clipboardData.setData('text/plain', topSuggestionResult);
              }, {once: true});
              document.execCommand('copy');
            }
          }
          window.currentSearchSuggestions.push(suggestion);
        })

        utils.renderSuggestions(window.currentSearchSuggestions);
      });
    }
    function test() {
      findEmoji.call(null, window.searchInput.value)
    }
    const debouncedFindEmoji = utils.debounce(test, 250);
    window.searchInput.addEventListener('input', debouncedFindEmoji);

  },
  icon: {
    path: 'images/dango-icon.png'
  }
}
