// hooks/useRoomStorage.js
import { useEffect, useState } from 'react';

export const useRoomStorage = (roomId) => {
    const [files, setFiles] = useState(() => {
        const storedFiles = localStorage.getItem(`room-${roomId}`);
        return storedFiles ? JSON.parse(storedFiles) : {};
    });

    useEffect(() => {
        localStorage.setItem(`room-${roomId}`, JSON.stringify(files));
    }, [roomId, files]);

    const updateFile = (fileId, content) => {
        setFiles(prevFiles => ({
            ...prevFiles,
            [fileId]: { ...prevFiles[fileId], content }
        }));
    };

    const deleteFile = (fileId) => {
        setFiles(prevFiles => {
            const { [fileId]: _, ...rest } = prevFiles;
            return rest;
        });
    };

    return { files, updateFile, deleteFile, setFiles };
};