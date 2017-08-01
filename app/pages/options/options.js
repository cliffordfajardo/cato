//Requiring the CSS we will use on this page.
//Webpack will output `options.css` from all these requires
require('../../../node_modules/material-design-lite/material.min.css');
require('../../../node_modules/material-design-lite/material.js');
require('./options.scss');
require('../../components/command-palette/command-palette.scss');

const utils = require('../../util.js')
const $ = require('jquery');
const Grapnel = require('grapnel');
const router = new Grapnel();
const low = require('lowdb');
let db = low('db');

// debugging easier.
window.db = db;
window.$ = $;


router.get('appearance', function(request) {
  const $appereancePage = $('#page-appearance');
  const $otherPages = $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $appereancePage[0]
  });
  $otherPages.hide();
  $appereancePage.show();
});


router.get('general', function(request) {
  const $generalPage = $('#page-general');
  const $otherPages = $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $generalPage[0]
  });
  $otherPages.hide();
  $generalPage.show();
});


router.get('plugins', function(request) {
  const $pluginsPage = $('#page-plugins');
  const $otherPages = $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $pluginsPage[0]
  });
  $otherPages.hide();
  $pluginsPage.show();
});


router.get('usage', function(request) {
  const $usagePage = $('#page-usage');
  const $otherPages = $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $usagePage[0]
  });
  $otherPages.hide();
  $usagePage.show();

  //show counter, but I need to inform the background script that I need it
  chrome.runtime.sendMessage({type: 'get-app-used-count'}, (response) => {
    const appUsedCount = response;
    $usagePage.append(`You've used the app ${response} times since installing it`);
  });
});



const inputs = document.querySelectorAll('.appearance-controls input');

inputs.forEach(input => input.addEventListener('change', handleUpdate))

//default values
inputs.forEach( (input) => {
  const property = input.dataset.cssvariable;
  debugger;
  let configValue = utils.getCurrentAppearanceSettings()[property];
  if(input.type === 'number'){
    configValue = configValue.slice(0, -2);
  }
  input.setAttribute('value', configValue)
})

//update our mockup on the page with the default values


 function handleUpdate() {
   const valueSuffix = this.dataset.sizing || '';
   const cssProperty = this.dataset.cssvariable;
   const cssPropertyValue = this.value + valueSuffix;

   utils.updateCSSVariable(`${cssProperty}`, cssPropertyValue);
   //update localstorage

   window.db.get('appearanceSettings')
    .assign({[`${cssProperty}`]: cssPropertyValue})
    .write()
  //  update css variable
}

function loadAppearanceConfiguration(){
  //we have css variables defined in our css already. Now we just modify them if we have values in our config
  const appearanceSettings = db.get('appearanceSettings').value();

  for (const key in appearanceSettings) {
    if (appearanceSettings.hasOwnProperty(key)) {
      utils.updateCSSVariable(key, appearanceSettings[key]);
      db.get('appearanceSettings')
        .assign({[`${key}`]: appearanceSettings[key]})
        .write()
    }
  }
}

loadAppearanceConfiguration()

function resetAppearanceConfiguration() {
  utils.resetAppearanceSettings();
}

const resetAppearanceButton = document.getElementById('reset-appearance-settings');
resetAppearanceButton.addEventListener('click', () => {
  resetAppearanceConfiguration();
  // loadAppearanceConfiguration();
});
