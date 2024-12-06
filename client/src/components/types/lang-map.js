// langMap.js

const langMap = () => {
    return {
        languages: {
            // Define the language map here
            // Example:
            'js': ['javascript', 'node'],
            'py': ['python'],
            // Add more mappings as needed
        },
        extensions: {
            // Define the extension map here
            // Example:
            'javascript': ['.js', '.jsx'],
            'python': ['.py'],
            // Add more mappings as needed
        },
    };
};

const languages = (extension) => {
    const map = langMap();
    return map.extensions[extension] || [];
};

const extensions = (language) => {
    const map = langMap();
    return map.languages[language] || [];
};

// Exporting the functions and the langMap object
export default Object.assign(langMap, {
    languages,
    extensions,
});
