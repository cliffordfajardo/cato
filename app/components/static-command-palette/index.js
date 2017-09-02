const {h} = require('dom-chef')
const commandPaletteHTML = require('./static-command-palette.html')
const commandPaletteElement = (<div dangerouslySetInnerHTML={{__html: commandPaletteHTML}}></div>)

module.exports = commandPaletteElement
