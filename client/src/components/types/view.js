// ViewContext.js

// Enum equivalent for VIEWS using a plain object
const VIEWS = {
    FILES: "FILES",
    CHATS: "CHATS",
    CLIENTS: "CLIENTS",
    RUN: "RUN",
    SETTINGS: "SETTINGS",
};

// ViewContext class to manage the active view and sidebar state
class ViewContext {
    constructor() {
        this.activeView = VIEWS.FILES; // Default active view
        this.isSidebarOpen = false; // Default sidebar state
        this.viewComponents = {}; // Object to hold view components
        this.viewIcons = {}; // Object to hold view icons
    }

    // Method to set the active view
    setActiveView(activeView) {
        this.activeView = activeView; // Update active view
    }

    // Method to set the sidebar state
    setIsSidebarOpen(isSidebarOpen) {
        this.isSidebarOpen = isSidebarOpen; // Update sidebar state
    }

    // Method to add view components
    addViewComponent(view, component) {
        this.viewComponents[view] = component; // Store the component by view
    }

    // Method to add view icons
    addViewIcon(view, icon) {
        this.viewIcons[view] = icon; // Store the icon by view
    }
}

// Exporting the constants and classes
export { VIEWS, ViewContext };
