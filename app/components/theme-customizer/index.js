const {h} = require('dom-chef')
const utils = require('../../util')
const browser = require('webextension-polyfill')

const themeCustomizerHTML = require('./theme-customizer.html')
const themeCustomizerElement = (<div dangerouslySetInnerHTML={{__html: themeCustomizerHTML}}></div>)
const resetThemeButton = themeCustomizerElement.querySelector('#reset-theme-settings')
const saveThemeButton = themeCustomizerElement.querySelector('#save-theme-settings')

const themeCustomizerModal = themeCustomizerElement.querySelector('.theme-modal')
const saveThemeNameButton = themeCustomizerElement.querySelector('.theme-modal__button_save')
const cancelThemeNameButton = themeCustomizerElement.querySelector('.theme-modal__button_cancel')
const themeControlInputs = themeCustomizerElement.querySelectorAll('.theme-controls__input')

resetThemeButton.addEventListener('click', () => {
  utils.resetFakeAppTheme()
  themeControlInputs.forEach((input) => utils.resetThemeInputValue(input))
})

saveThemeButton.addEventListener('click', () => {
  themeCustomizerModal.classList.remove('hide')
})

cancelThemeNameButton.addEventListener('click', () => {
  themeCustomizerModal.classList.add('hide')
})


themeControlInputs.forEach((input) => input.addEventListener('change', utils.handleThemeInputValueChanges))

//default values
themeControlInputs.forEach(async (input) => {
  const { themeConfig } = await browser.storage.sync.get('themeConfig')
  const themeProperty = input.dataset.cssvariable
  let themeConfigValue = themeConfig[themeProperty]

  if (input.type === 'number') {
    themeConfigValue = themeConfigValue.slice(0, -2) // 500px -> 500
  }
  input.setAttribute('value', themeConfigValue)
})




module.exports = themeCustomizerElement
