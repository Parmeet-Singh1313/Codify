import { useState } from "react";

const FileSystemItem = {
    id: '', // string
    name: '', // FileName
    type: 'file', // "file" | "directory"
    children: [], // FileSystemItem[]
    content: '', // FileContent
    isOpen: false // boolean
};
// Hook to manage the file system context
const useFileContext = () => {
    // Initial state for file structure, open files, and active file
    const [fileStructure, setFileStructure] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);

    // Set the active file
    const handleSetActiveFile = (file) => {
        setActiveFile(file);
    };

    // Close the specified file by its id
    const closeFile = (fileId) => {
        setOpenFiles(openFiles.filter(file => file.id !== fileId));
    };

    // Toggle the directory open/close state
    const toggleDirectory = (dirId) => {
        const toggleDirHelper = (items) => {
            return items.map(item => {
                if (item.id === dirId) {
                    return { ...item, isOpen: !item.isOpen };
                }
                if (item.children) {
                    return { ...item, children: toggleDirHelper(item.children) };
                }
                return item;
            });
        };
        setFileStructure(toggleDirHelper([fileStructure])[0]);
    };

    // Collapse all directories
    const collapseDirectories = () => {
        const collapseHelper = (items) => {
            return items.map(item => ({
                ...item,
                isOpen: false,
                children: item.children ? collapseHelper(item.children) : [],
            }));
        };
        setFileStructure(collapseHelper([fileStructure])[0]);
    };

    // Create a directory
    const createDirectory = (parentDirId, name) => {
        // Logic to add a directory to the parent directory's children
    };

    // Update the children of a directory
    const updateDirectory = (dirId, children) => {
        // Logic to update the children of a directory by its id
    };

    // Rename a directory
    const renameDirectory = (dirId, newName) => {
        // Logic to rename a directory by its id
    };

    // Delete a directory
    const deleteDirectory = (dirId) => {
        // Logic to delete a directory by its id
    };

    // Create a new file inside a directory
    const createFile = (parentDirId, name) => {
        // Logic to create a file in the specified directory
    };

    // Update the content of a file
    const updateFileContent = (fileId, content) => {
        // Logic to update the content of a file by its id
    };

    // Open a file by its id
    const openFile = (fileId) => {
        const fileToOpen = findFileById(fileStructure, fileId);
        if (fileToOpen) {
            setOpenFiles([...openFiles, fileToOpen]);
            setActiveFile(fileToOpen);
        }
    };

    // Rename a file by its id
    const renameFile = (fileId, newName) => {
        // Logic to rename a file by its id
    };

    // Delete a file by its id
    const deleteFile = (fileId) => {
        // Logic to delete a file by its id
    };

    // Download all files and folders (e.g., as a zip file)
    const downloadFilesAndFolders = () => {
        // Logic to download all files and directories
    };

    // Helper function to find a file by its id within the file structure
    const findFileById = (structure, fileId) => {
        if (structure && structure.id === fileId) {
            return structure;
        }
        if (structure && structure.children) {
            for (let child of structure.children) {
                const result = findFileById(child, fileId);
                if (result) return result;
            }
        }
        return null;
    };

    return {
        fileStructure,
        openFiles,
        activeFile,
        setActiveFile: handleSetActiveFile,
        closeFile,
        toggleDirectory,
        collapseDirectories,
        createDirectory,
        updateDirectory,
        renameDirectory,
        deleteDirectory,
        createFile,
        updateFileContent,
        openFile,
        renameFile,
        deleteFile,
        downloadFilesAndFolders,
    };
};

export { useFileContext , FileSystemItem};