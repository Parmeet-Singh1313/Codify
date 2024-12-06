// RunContext.js

class Language {
    constructor(language, version, aliases = []) {
        this.language = language;
        this.version = version;
        this.aliases = aliases;
    }
}

class RunContext {
    constructor() {
        this.input = '';
        this.output = '';
        this.isRunning = false;
        this.supportedLanguages = [];
        this.selectedLanguage = null; // Should be an instance of Language
    }

    setInput(input) {
        this.input = input;
    }

    setSelectedLanguage(language) {
        if (language instanceof Language) {
            this.selectedLanguage = language;
        } else {
            throw new Error('Selected language must be an instance of Language');
        }
    }

    runCode() {
        // Implement the logic to run the code based on the input and selected language
        if (this.isRunning) {
            console.log("Code is already running.");
            return;
        }

        this.isRunning = true;

        // Simulate running code
        setTimeout(() => {
            this.output = `Executed code in ${this.selectedLanguage.language} v${this.selectedLanguage.version}`;
            this.isRunning = false;
            console.log(this.output);
        }, 1000); // Simulating a delay for running the code
    }
}

// Exporting the classes
export { Language, RunContext };
