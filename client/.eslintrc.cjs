module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended", // Assuming you're still using React
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.js"],
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
    },
}
