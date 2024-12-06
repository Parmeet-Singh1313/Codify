// This file is used to declare types for various asset imports in a Vite application.

import { defineConfig } from 'vite';

// For SVG imports
export default (src) => {
    if (src.endsWith('.svg')) {
        return { default: src };
    }
};

