const {h} = require('dom-chef')
const utils = require('../../util')
const browser = require('webextension-polyfill')

const themeCustomizerHTML = require('./theme-customizer.html')
const themeCustomizerElement = (<div dangerouslySetInnerHTML={{__html: themeCustomizerHTML}}></div>)
const resetThemeButton = themeCustomizerElement.querySelector('#reset-theme')
const saveThemeButton = themeCustomizerElement.querySelector('#save-theme-settings')

const htmlElement = document.querySelector('html')
const themeControlInputs = themeCustomizerElement.querySelectorAll('.theme-controls__input')

resetThemeButton.addEventListener('click', () => {
  utils.resetFakeAppTheme()
  utils.resetLocalStorageTheme()
  themeControlInputs.forEach((input) => utils.resetThemeInputValue(input))
})



themeControlInputs.forEach((input) => input.addEventListener('change', utils.handleThemeInputValueChanges))

//default values
themeControlInputs.forEach(async (input) => {
  const { themeConfig } = await browser.storage.sync.get('themeConfig')
  const property = input.dataset.cssvariable
  let value = themeConfig[property]
  if (input.type === 'number') {
    value = value.slice(0, -2) // 500px -> 500
  }
  input.setAttribute('value', value)
})

//set the static launcher's color to the values we have in local storage, if any.
themeControlInputs.forEach(async (input) => {
  const {themeConfig} = await browser.storage.sync.get('themeConfig')
  for (const property in themeConfig){
    htmlElement.style.cssText += `${property}: ${themeConfig[property]}`
  }

})




module.exports = themeCustomizerElement
