"use strict";

module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  "globals": {
    "chrome": true
  },
  extends: ["eslint:recommended"],
  rules: {
    curly: "error",
    "no-console": "off",
    "no-else-return": "error",
    "no-inner-declarations": "off",
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "strict": "error"
  }
};
