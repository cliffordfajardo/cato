const util = {};

util.debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;

    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

utils.isAlphaNumeric = function(event){
  let input = event.keyCode;
  if(/[a-zA-Z0-9-_ ]/.test(input)){
    return true;
  }
  return false;
}

utils.isUpOrDownArrow = function(event){
  if(event.keyCode == 38 || event.keyCode === 40){
    return true;
  }
  return false;
}

utils.upArrowKey = 38;
utils.downArrowKey = 40;

module.exports = util;
