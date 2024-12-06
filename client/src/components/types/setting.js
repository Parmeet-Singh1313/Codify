// SettingsContext.js

class Settings {
    constructor(theme, language, fontSize, fontFamily, showGitHubCorner) {
        this.theme = theme || 'light'; // Default theme
        this.language = language || 'en'; // Default language
        this.fontSize = fontSize || 14; // Default font size
        this.fontFamily = fontFamily || 'Arial, sans-serif'; // Default font family
        this.showGitHubCorner = showGitHubCorner !== undefined ? showGitHubCorner : true; // Default to true
    }
}

class SettingsContext extends Settings {
    constructor(theme, language, fontSize, fontFamily, showGitHubCorner) {
        super(theme, language, fontSize, fontFamily, showGitHubCorner);
    }

    setTheme(theme) {
        this.theme = theme;
    }

    setLanguage(language) {
        this.language = language;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
    }

    setShowGitHubCorner(showGitHubCorner) {
        this.showGitHubCorner = showGitHubCorner;
    }

    resetSettings() {
        this.theme = 'light'; // Reset to default
        this.language = 'en'; // Reset to default
        this.fontSize = 14; // Reset to default
        this.fontFamily = 'Arial, sans-serif'; // Reset to default
        this.showGitHubCorner = true; // Reset to default
    }
}

// Exporting the classes
export { Settings, SettingsContext };
