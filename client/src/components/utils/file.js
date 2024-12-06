import { v4 as uuidv4 } from "uuid";

const initialCode = `function sayHi() {
    console.log("👋 Hello world");
}

sayHi()`;

export const initialFileStructure = {
    name: "root",
    id: uuidv4(),
    type: "directory",
    children: [
    {
        id: uuidv4(),
        type: "file",
        name: "index.js",
        language: "javascript",
        content: `function sayHi() {
        console.log("👋 Hello world");
        }

        sayHi();`,
    },
    ],
};

export const findParentDirectory = (directory, parentDirId) => {
    // Checking the current directory matches the parentDirId
    if (directory.id === parentDirId && directory.type === "directory") {
        return directory;
    }

    // Recursively searching children if it's a directory
    if (directory.type === "directory" && directory.children) {
        for (const child of directory.children) {
            const found = findParentDirectory(child, parentDirId);
            if (found) {
                return found;
            }
        }
    }

    // Return null if not found
    return null;
};

export const isFileExist = (parentDir, name) => {
    if (!parentDir.children) return false;
    return parentDir.children.some((file) => file.name === name);
};

export const getFileById = (fileStructure, fileId) => {
    const findFile = (directory) => {
        if (directory.id === fileId) {
            return directory;
        } else if (directory.children) {
            for (const child of directory.children) {
                const found = findFile(child);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    return findFile(fileStructure);
};

export const sortFileSystemItem = (item) => {
    // Recursively sort children if it's a directory
    if (item.type === "directory" && item.children) {
        // Separate directories and files
        let directories = item.children.filter(
            (child) => child.type === "directory"
        );
        const files = item.children.filter((child) => child.type === "file");

        // Sort directories by name (A-Z)
        directories.sort((a, b) => a.name.localeCompare(b.name));

        // Recursively sort nested directories
        directories = directories.map((dir) => sortFileSystemItem(dir));

        // Sort files by name (A-Z)
        files.sort((a, b) => a.name.localeCompare(b.name));

        // Combine sorted directories and files
        item.children = [
            ...directories.filter((dir) => dir.name.startsWith(".")),
            ...directories.filter((dir) => !dir.name.startsWith(".")),
            ...files.filter((file) => file.name.startsWith(".")),
            ...files.filter((file) => !file.name.startsWith(".")),
        ];
    }

    return item;
};

// New function to get HTML boilerplate
export const getHtmlBoilerplate = (fileName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
</head>
<body>
    <h1>Welcome to ${fileName}</h1>
</body>
</html>`;
};

// New function to create a new file
export const createNewFile = (parentDir, fileName, fileType) => {
    const newFile = {
        id: uuidv4(),
        type: "file",
        name: fileName,
        language: fileType,
        content: fileType === "html" ? getHtmlBoilerplate(fileName) : "",
    };

    if (!parentDir.children) {
        parentDir.children = [];
    }
    parentDir.children.push(newFile);

    return newFile;
};