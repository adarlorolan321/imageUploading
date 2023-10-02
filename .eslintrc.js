module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    overrides: [
        {
            files: "*.vue",
            globals: {
                route: "readable",
                can: "readable",
                fieldHasError: "readable",
                clearSelect: "readable",
                goBack: "readable",
            },
        },
    ],
    extends: [
        ".eslintrc-auto-import.json",
        "plugin:vue/vue3-recommended",
        "plugin:import/recommended",
        "plugin:promise/recommended",
        "plugin:sonarjs/recommended",

        // 'plugin:unicorn/recommended',
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        ecmaVersion: 13,
        sourceType: "module",
    },
    plugins: ["vue"],
    ignorePatterns: [
        "resources/js/@iconify/*.js",
        "node_modules",
        "dist",
        "*.d.ts",
    ],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

        // indentation (Already present in TypeScript)
        indent: ["off", 2],

        // Enforce trailing comma (Already present in TypeScript)
        "comma-dangle": ["error", "always-multiline"],

        // Enforce consistent spacing inside braces of object (Already present in TypeScript)
        "object-curly-spacing": ["error", "always"],

        // Disable max-len

        // we don't want it

        // add parens ony when required in arrow function
        "arrow-parens": ["off"],

        // add new line above comment
        "newline-before-return": "error",

        // add new line above comment
        "lines-around-comment": [
            "error",
            {
                beforeBlockComment: true,
                beforeLineComment: true,
                allowBlockStart: true,
                allowClassStart: true,
                allowObjectStart: true,
                allowArrayStart: true,
            },
        ],

        "array-element-newline": ["error", "consistent"],
        "array-bracket-newline": ["error", "consistent"],

        "vue/multi-word-component-names": "off",

        "padding-line-between-statements": [
            "error",
            { blankLine: "always", prev: "expression", next: "const" },
            { blankLine: "always", prev: "const", next: "expression" },
            { blankLine: "always", prev: "multiline-const", next: "*" },
        ],

        // Plugin: eslint-plugin-import
        "import/newline-after-import": ["error", { count: 1 }],

        // Plugin: eslint-plugin-import
        // For omitting extension for ts files
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            },
        ],

        // ignore virtual files
        "import/no-unresolved": [
            2,
            {
                ignore: [
                    "~pages$",
                    "virtual:generated-layouts",

                    // Ignore vite's ?raw imports
                    ".*?raw",
                ],
            },
        ],

        // Thanks: https://stackoverflow.com/a/63961972/10796681
        "no-shadow": "off",
        "promise/no-nesting": "off",

        // Plugin: eslint-plugin-promise
        "promise/always-return": "off",
        "promise/catch-or-return": "off",


        // ESLint plugin vue
        "vue/block-tag-newline": "error",
        "vue/component-api-style": "error",
        "vue/component-name-in-template-casing": [
            "error",
            "PascalCase",
            { registeredComponentsOnly: false },
        ],
        "vue/custom-event-name-casing": [
            "error",
            "camelCase",
            {
                ignores: [
                    "/^(click):[a-z]+((d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/",
                ],
            },
        ],
        "vue/html-comment-content-newline": "error",
        "vue/html-comment-content-spacing": "error",
        "vue/html-comment-indent": "off",
        "vue/match-component-file-name": "error",
        "vue/no-child-content": "error",

        // NOTE this rule only supported in SFC,  Users of the unplugin-vue-define-options should disable that rule: https://github.com/vuejs/eslint-plugin-vue/issues/1886
        // 'vue/no-duplicate-attr-inheritance': 'error',
        "vue/no-empty-component-block": "error",
        "vue/no-multiple-objects-in-class": "error",
        "vue/no-reserved-component-names": "error",
        "vue/no-template-target-blank": "error",
        "vue/no-useless-mustaches": "error",
        "vue/no-useless-v-bind": "error",
        "vue/padding-line-between-blocks": "error",
        "vue/prefer-separate-static-class": "error",
        "vue/prefer-true-attribute-shorthand": "error",
        "vue/attributes-order": "off",
        "vue/v-on-function-call": "error",
        "vue/v-on-event-hyphenation": "off",
        "vue/require-default-prop": "off",
        "vue/html-self-closing": "off",
        "vue/singleline-html-element-content-newline": "off",
        "vue/no-restricted-class": ["off", "/^(p|m)(l|r)-/"],
        "vue/no-undef-properties":"error",
        "vue/prop-name-casing":"off",
        "vue/attribute-hyphenation":"off",
        "vue/max-attributes-per-line": [
            "error",
            {
                singleline: {
                    max: 5,
                },
                multiline: {
                    max: 5,
                },
            },
        ],
        "vue/template-curly-spacing": "error",

        // -- Sonarlint
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/no-nested-template-literals": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/prefer-single-boolean-return": "off",

        // -- Unicorn
        // 'unicorn/filename-case': 'off',
        // 'unicorn/prevent-abbreviations': ['error', {
        //   replacements: {
        //     props: false,
        //   },
        // }],
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [
                    ".ts",
                    ".js",
                    ".tsx",
                    ".jsx",
                    ".mjs",
                    ".png",
                    ".jpg",
                ],
            },
            alias: {
                extensions: [".ts", ".js", ".tsx", ".jsx", ".mjs"],
                map: [
                    ["@", "./resources/js"],
                    ["@themeConfig", "./themeConfig.js"],
                    ["@core", "./resources/js/@core"],
                    ["@layouts", "./resources/js/@layouts"],
                    ["@images", "./resources/images/"],
                    ["@styles", "./resources/styles/"],
                    [
                        "@configured-variables",
                        "./resources/styles/variables/_template.scss",
                    ],
                    ["@axios", "./resources/js/plugins/axios"],
                    ["@validators", "./resources/js/@core/utils/validators"],
                    ["apexcharts", "node_modules/apexcharts-clevision"],
                ],
            },
        },
    },
};
