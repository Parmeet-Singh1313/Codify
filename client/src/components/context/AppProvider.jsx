// AppProvider.jsx
import React from "react";
import { AppContextProvider } from "./AppContext.jsx";
import { ChatContextProvider } from "./ChatContext.jsx";
import { FileContextProvider } from "./FileContext.jsx";
import { RunCodeContextProvider } from "./RunCodeContext.jsx";
import { SettingContextProvider } from "./SettingContext.jsx";
import { SocketProvider } from "./SocketContext.jsx";
import { ViewContextProvider } from "./ViewContext.jsx";

function AppProvider({ children }) {
    return (
        <AppContextProvider>
            <SocketProvider>
                <SettingContextProvider>
                    <ViewContextProvider>
                        <FileContextProvider>
                            <RunCodeContextProvider>
                                <ChatContextProvider>
                                    {children}
                                </ChatContextProvider>
                            </RunCodeContextProvider>
                        </FileContextProvider>
                    </ViewContextProvider>
                </SettingContextProvider>
            </SocketProvider>
        </AppContextProvider>
    );
}

export default AppProvider;