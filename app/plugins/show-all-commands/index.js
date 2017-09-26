const utils = require('../../util')
const plugin = {
  keyword: "Show All Commands",
  subtitle: 'Display all available Cato app commands.',
  action: getAllSuggestions,
  icon: {
    path: 'images/chrome-icon.svg'
  }
}

function getAllSuggestions(){
  window.searchResultsList.innerHTML = ""
  utils.renderSuggestions(window.defaultSuggestions)
  window.searchInput.value = ''
  window.suggestionElements = document.querySelectorAll('.cLauncher__suggestion')
}

module.exports = plugin
