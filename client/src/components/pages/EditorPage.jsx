import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SplitterComponent from "../SplitterComponent";
import ConnectionStatusPage from "../common/connection/ConnectionStatusPage";
import { useAppContext } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import useFullScreen from "../hooks/useFullScreen";
import { useRoomStorage } from '../hooks/useRoomStorage'; // Add this import
import useUserActivity from "../hooks/useUserActivity";
import Sidebar from "../sidebar/Sidebar";
import { SocketEvent } from "../types/socket";
import { USER_STATUS } from "../types/user";
import WorkSpace from "../workspace";

function EditorPage() {
    useUserActivity();
    useFullScreen();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { status, setCurrentUser, currentUser } = useAppContext();
    const { socket } = useSocket();
    const location = useLocation();
    const { files, updateFile, deleteFile } = useRoomStorage(roomId); // Add this line

    // Pass these to your components as props
    const workspaceProps = {
        files,
        updateFile,
        deleteFile,
        roomId
    };

    useEffect(() => {
        if (currentUser.username.length > 0) return;
        const username = location.state?.username;
        if (username === undefined) {
            navigate("/", {
                state: { roomId },
            });
        } else if (roomId) {
            const user = { username, roomId };
            setCurrentUser(user);
            socket.emit(SocketEvent.JOIN_REQUEST, user);
        }
    }, [
        currentUser.username,
        location.state?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ]);

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />;
    }

    return (
        <SplitterComponent>
            <Sidebar />
            <WorkSpace {...workspaceProps} />
        </SplitterComponent>
    );
}

export default EditorPage;