module.exports = {
  "parser": "@babel/eslint-parser",
  "parserOptions": { "sourceType": "module", "requireConfigFile": false },
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    // "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
    "new-cap": 0,
  }
};
