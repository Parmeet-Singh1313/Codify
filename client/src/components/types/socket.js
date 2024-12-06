// SocketContext.js

import { Socket } from "socket.io-client";

// SocketId type as a string
// TypeScript's type system is not needed in JavaScript, but we can keep comments for clarity
const SocketId = 'string'; // Placeholder to denote SocketId type

// Enum equivalent using a plain object
const SocketEvent = {
    JOIN_REQUEST: "join-request",
    JOIN_ACCEPTED: "join-accepted",
    USER_JOINED: "user-joined",
    USER_DISCONNECTED: "user-disconnected",
    SYNC_FILE_STRUCTURE: "sync-file-structure",
    DIRECTORY_CREATED: "directory-created",
    DIRECTORY_UPDATED: "directory-updated",
    DIRECTORY_RENAMED: "directory-renamed",
    DIRECTORY_DELETED: "directory-deleted",
    FILE_CREATED: "file-created",
    FILE_UPDATED: "file-updated",
    FILE_RENAMED: "file-renamed",
    FILE_DELETED: "file-deleted",
    USER_OFFLINE: "offline",
    USER_ONLINE: "online",
    SEND_MESSAGE: "send-message",
    RECEIVE_MESSAGE: "receive-message",
    TYPING_START: "typing-start",
    TYPING_PAUSE: "typing-pause",
    USERNAME_EXISTS: "username-exists",
    REQUEST_DRAWING: "request-drawing",
    SYNC_DRAWING: "sync-drawing",
    DRAWING_UPDATE: "drawing-update",
};

// SocketContext class to represent the context
class SocketContext {
    constructor(socket) {
        this.socket = socket; // instance of Socket
    }
}

// Exporting the enum and context class
export { SocketEvent, SocketContext, SocketId };
