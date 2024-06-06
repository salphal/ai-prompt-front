module.exports = {
  'extends': [
    'stylelint-config-standard',
    'stylelint-prettier/recommended',
    'stylelint-config-rational-order',
    'stylelint-config-standard-scss',
  ],
  rules: {
    "at-rule-no-unknown": [],
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "layer",
          "apply",
          "variants",
          "responsive",
          "screen"
        ]
      }
    ],
  }
};
