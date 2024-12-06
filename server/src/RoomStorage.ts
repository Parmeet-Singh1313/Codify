// RoomStorage.ts
import fs from 'fs';
import path from 'path';

interface RoomData {
    fileStructure: any;
    openFiles: any[];
    activeFile: any;
}

class RoomStorage {
    private static storageDir = path.join(__dirname, '..', 'roomData');

    static init() {
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
        }
    }

    static saveRoomData(roomId: string, data: RoomData) {
        const filePath = path.join(this.storageDir, `${roomId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data));
    }

    static getRoomData(roomId: string): RoomData | null {
        const filePath = path.join(this.storageDir, `${roomId}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
        return null;
    }
}

export default RoomStorage;