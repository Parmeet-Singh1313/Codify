import React, { useState } from "react";

const useChatContext = () => {
    // Initialize the messages as an empty array
    const [messages, setMessages] = useState([]);
    
    // Boolean for tracking new message status
    const [isNewMessage, setIsNewMessage] = useState(false);
    
    // Track the last scroll height for some chat UI logic
    const [lastScrollHeight, setLastScrollHeight] = useState(0);

    return {
        messages,
        setMessages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    };
};


export { useChatContext };
