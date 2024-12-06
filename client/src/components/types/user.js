const USER_CONNECTION_STATUS = {
    OFFLINE: "offline",
    ONLINE: "online",
};

class User {
    constructor(username, roomId) {
        this.username = username; // string
        this.roomId = roomId;     // string
    }
}

// RemoteUser class extending User with additional properties
class RemoteUser extends User {
    constructor(username, roomId, status, cursorPosition, typing, currentFile, socketId) {
        super(username, roomId); // Call the parent constructor
        this.status = status;              // USER_CONNECTION_STATUS
        this.cursorPosition = cursorPosition; // number
        this.typing = typing;                // boolean
        this.currentFile = currentFile;      // string
        this.socketId = socketId;            // string
    }
}

// Enum equivalent for USER_STATUS using a plain object
const USER_STATUS = {
    INITIAL: "initial",
    CONNECTING: "connecting",
    ATTEMPTING_JOIN: "attempting-join",
    JOINED: "joined",
    CONNECTION_FAILED: "connection-failed",
    DISCONNECTED: "disconnected",
};

// Exporting the constants and classes
export { USER_CONNECTION_STATUS, USER_STATUS, RemoteUser, User };
