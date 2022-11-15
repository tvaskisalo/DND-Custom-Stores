module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["react", "@typescript-eslint"],
  "settings": {
      "react": {
          "pragma": "React",
          "version": "detect"
      }
  },
  "rules": {
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/explicit-module-boundry-types": 0,
      "react/react-in-jsx-scope": 0,
      "indent": [
          "error",
          2
        ],
        "quotes": [
          "error",
          "single"
        ],
        "semi": [
          "error",
          "never"
        ],
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
          "error", "always"
        ],
        "arrow-spacing": [
          "error", { "before": true, "after": true }
        ],
        "keyword-spacing": "error",
        "comma-spacing": ["error", { "before": false, "after": true }],
        "space-infix-ops": ["error", { "int32Hint": false }]
  },
  "root" : true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": __dirname + "/tsconfig.json"
  }
}