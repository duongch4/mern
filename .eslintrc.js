const path = require("path");

module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "react"
    ],
    env: {
        browser: true,
        jest: true
    },
    parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        },
        // extraFileExtensions: ["json", "html", "scss"]
    },
    extends: [
        "plugin:@typescript-eslint/recommended", // recommended rules from @typescript-eslint/eslint-plugin
        // "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:react/recommended", // recommended rules from @eslint-plugin-react
        // "prettier/react", // disables react-specific linting rules that conflict with prettier
        // "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        // Overwrite rules specified from the extended configs e.g. 
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": "off",

        // These rules don"t add much value, are better covered by TypeScript and good definition files
        "react/no-direct-mutation-state": "off",
        "react/no-deprecated": "off",
        "react/no-string-refs": "off",
        "react/require-render-return": "off",

        "react/jsx-filename-extension": [
            "warn",
            {
                extensions: [".js", ".jsx", ".ts", ".tsx"]
            }
        ], // also want to use with ".tsx"
        // "import/no-extraneous-dependencies": [
        //     "warn",
        //     {
        //         devDependencies: ["./client/**/test.tsx", "./server/**/test.ts"] 
        //     }
        // ],
        "react/prop-types": "off" // Is this incompatible with TS props type?
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {},
        },
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    ignorePatterns: ["webpack.*.js", "node_modules/", "dist/"],
}
