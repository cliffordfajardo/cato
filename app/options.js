//inject this into our html page via <style tag>
require('../node_modules/material-design-lite/material.min.css');
require('../node_modules/material-design-lite/material.js');
require('./options.scss');
const $ = require('jquery');
window.$ = $;
const Grapnel = require('grapnel');
const router = new Grapnel();


router.get('appearance', function(request) {
  const $appereancePage = $('#page-appearance');
  const $otherPages =  $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $appereancePage[0]
  });
  $otherPages.hide();
  $appereancePage.show();
});


router.get('general', function(request) {
  const $generalPage = $('#page-general');
  const $otherPages =  $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $generalPage[0]
  });
  $otherPages.hide();
  $generalPage.show();
});

router.get('plugins', function(request) {
  const $pluginsPage = $('#page-plugins');
  const $otherPages =  $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $pluginsPage[0]
  });
  $otherPages.hide();
  $pluginsPage.show();
});


router.get('usage', function(request) {
  const $usagePage = $('#page-usage');
  const $otherPages =  $("div[id^='page-']")
    .filter((i, el) => {
    return el !== $usagePage[0]
  });
  $otherPages.hide();
  $usagePage.show();
});
