module.exports = {
    plugins: {
        "postcss-import": {},
        "postcss-preset-env": {},
        "postcss-css-variables": {}, // Get rid of all CSS custom properties when outputing ".css" => old browsers (eg. IE11) compability
        "cssnano": {},
    },
    parser: "postcss-scss" // Allow comments in SCSS
};
