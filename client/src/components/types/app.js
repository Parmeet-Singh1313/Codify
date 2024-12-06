import React, { useState } from "react";
import { RemoteUser, User, USER_STATUS } from "./user";

const ACTIVITY_STATE = {
    CODING: 'coding',
    DRAWING: 'drawing',
};

// Initially set DrawingData to null (you will replace it with actual drawing data later)
const DrawingData = null;

// AppContext as a functional hook to manage state (or you can use React's Context API for global state management)
const useAppContext = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); // You can initialize with an empty User object if needed
    const [status, setStatus] = useState(USER_STATUS.INITIAL);
    const [activityState, setActivityState] = useState(ACTIVITY_STATE.CODING);
    const [drawingData, setDrawingData] = useState(DrawingData); // Replace with actual drawing data when needed

    return {
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        status,
        setStatus,
        activityState,
        setActivityState,
        drawingData,
        setDrawingData,
    };
};

// Exporting the constants and the custom hook
export { DrawingData, ACTIVITY_STATE, useAppContext};