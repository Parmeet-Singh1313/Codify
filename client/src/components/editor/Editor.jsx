import { autocompletion } from "@codemirror/autocomplete";
import { color } from "@uiw/codemirror-extensions-color";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { scrollPastEnd } from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useFileSystem } from "../context/FileContext";
import { useSettings } from "../context/SettingContext";
import { useSocket } from "../context/SocketContext";
import usePageEvents from "../hooks/usePageEvents";
import useResponsive from "../hooks/useResponsive";
import { editorThemes } from "../resources/Themes";
import { SocketEvent } from "../types/socket";
import { getRoomId } from "../utils/roomUtils";
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip";

function Editor() {
    const { users, currentUser } = useAppContext();
    const { activeFile, setActiveFile, codeChangeUser } = useFileSystem();
    const { theme, language, fontSize } = useSettings();
    const { socket } = useSocket();
    const { viewHeight } = useResponsive();
    const [timeOut, setTimeOut] = useState(setTimeout(() => { }, 0));
    const [htmlContent, setHtmlContent] = useState("");
    const [isLivePreview, setIsLivePreview] = useState(false);
    const [isSplitScreen, setIsSplitScreen] = useState(false);
    const [viewportSize, setViewportSize] = useState("desktop");
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    );
    const [extensions, setExtensions] = useState([]);

    const roomId = getRoomId();

    useEffect(() => {
        if (!activeFile || !roomId) return;

        // Save content to localStorage when it changes
        const storageKey = `fileContent_${roomId}_${activeFile.id}`;
        localStorage.setItem(storageKey, activeFile.content || '');
    }, [activeFile?.content, roomId, activeFile?.id]);

    const htmlBoilerplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- Press Ctrl + Q to open Live Preview window -->
</body>
</html>`;

    const onCodeChange = useCallback((code, view) => {
        if (!activeFile) return;

        let newCode = code;
        if (activeFile.name.endsWith('.html') && code.trim() === '!') {
            newCode = htmlBoilerplate;
            setTimeout(() => {
                view.dispatch({
                    changes: { from: 0, to: view.state.doc.length, insert: newCode },
                    selection: { anchor: newCode.indexOf('<body>') + 7 }
                });
            }, 0);
        }

        const file = { ...activeFile, content: newCode };
        setActiveFile(file);
        setHtmlContent(activeFile.name.endsWith('.html') ? newCode : "");

        if (roomId) {
            const storageKey = `fileContent_${roomId}_${activeFile.id}`;
            localStorage.setItem(storageKey, newCode);
        }
        const cursorPosition = view.state?.selection?.main?.head;
        socket.emit(SocketEvent.TYPING_START, { cursorPosition });
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: newCode,
        });
        clearTimeout(timeOut);

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        );
        setTimeOut(newTimeOut);
    }, [activeFile, setActiveFile, socket, timeOut, roomId]);

    usePageEvents();

    useEffect(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
            autocompletion({
                override: [
                    (context) => {
                        const word = context.matchBefore(/\w*/);
                        if (!word) return null;

                        let completions = [];
                        switch (language.toLowerCase()) {
                            case 'javascript':
                                completions = getJavaScriptSuggestions(word.text);
                                break;
                            case 'python':
                                completions = getPythonSuggestions(word.text);
                                break;
                            case 'java':
                                completions = getJavaSuggestions(word.text);
                                break;
                            case 'cpp':
                                completions = getCPlusPlusSuggestions(word.text);
                                break;
                            case 'c':
                                completions = getCSuggestions(word.text);
                                break;
                            default:
                                completions = [];
                        } return {
                            from: word.from,
                            to: word.to,
                            options: completions.map((c) => ({ label: c })),
                        };
                    }
                ],
            }),
        ];

        const langExt = loadLanguage(language.toLowerCase());
        if (langExt) {
            extensions.push(langExt);
        } else {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            );
        }

        setExtensions(extensions);
    }, [filteredUsers, language, activeFile]);

    const handleLivePreview = useCallback(() => {
        if (activeFile.name.endsWith('.html')) {
            setIsLivePreview(true);
        } else {
            alert("Live preview is only available for HTML files.");
        }
    }, [activeFile]);

    const handleBack = useCallback(() => {
        setIsLivePreview(false);
    }, []);

    const handleSplitScreen = useCallback(() => {
        setIsSplitScreen(!isSplitScreen);
    }, [isSplitScreen]);

    const handleViewportSizeChange = useCallback((size) => {
        setViewportSize(size);
    }, []);

    const getViewportDimensions = () => {
        switch (viewportSize) {
            case "mobile":
                return { width: "375px", height: "600px" };
            case "desktop":
                return { width: "800px", height: "600px" };
            case "tablet":
                return { width: "740px", height: "600px" };
            default:
                return { width: "100%", height: "100%" };
        }
    };

    const handleFileClick = useCallback((file) => {
        setActiveFile(file);
        setHtmlContent(activeFile.name.endsWith('.html') ? file.content : "");
        setIsLivePreview(false);
    }, [activeFile, setActiveFile]);

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'q' && event.ctrlKey) {
            handleLivePreview();
        }
    }, [handleLivePreview]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
    // Add this at the beginning of your component
    useEffect(() => {
        // Add the keyframes style to the document
        const style = document.createElement('style');
        style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
        }
    `;
        document.head.appendChild(style);

        // Cleanup
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div style={{ height: viewHeight }}>
            {codeChangeUser && (
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(57, 197, 62, 0.9)',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        zIndex: 1000,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <div
                        style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            animation: 'pulse 1.5s infinite'
                        }}
                    />
                    {codeChangeUser} is editing...
                </div>
            )}
            {isLivePreview ? (
                <div style={{ height: "100%" }}>
                    <div
                        style={{
                            padding: "15px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#2e2e2e",
                            borderRadius: "8px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                            marginBottom: "20px",
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: "24px", color: "#fdfdfd" }}>Live Preview</h2>
                        <button
                            onClick={handleBack}
                            style={{
                                width: "150px",
                                height: "50px",
                                border: "none",
                                backgroundColor: "#39c53e",
                                color: "white",
                                borderRadius: "5px",
                                fontSize: "16px",
                                cursor: "pointer",
                                transition: "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                                outline: "none",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                marginTop: "10px",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#32a72d";
                                e.target.style.transform = "scale(1.05)";
                                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#39c53e";
                                e.target.style.transform = "scale(1)";
                                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSplitScreen}
                            style={{
                                width: "150px",
                                height: "50px",
                                border: "none",
                                backgroundColor: "#39c53e",
                                color: "white",
                                borderRadius: "5px",
                                fontSize: "16px",
                                cursor: "pointer",
                                transition: "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                                outline: "none",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                marginTop: "10px",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#32a72d";
                                e.target.style.transform = "scale(1.05)";
                                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#39c53e";
                                e.target.style.transform = "scale(1)";
                                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            {isSplitScreen ? "Single Screen" : "Split Screen"}
                        </button>
                        <select
                            value={viewportSize}
                            onChange={(e) => handleViewportSizeChange(e.target.value)}
                            style={{
                                width: "150px",
                                height: "50px",
                                border: "none",
                                backgroundColor: "#39c53e",
                                color: "white",
                                borderRadius: "5px",
                                fontSize: "16px",
                                cursor: "pointer",
                                transition: "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                                outline: "none",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                marginTop: "10px",
                                marginRight: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlignLast: "center",
                                textAlign: "center",
                                appearance: "none",
                                paddingRight: "10px",
                            }}
                        >
                            <option value="desktop" style={{ backgroundColor: "black", color: "#39c53e", textAlign: "center" }}>Desktop</option>
                            <option value="tablet" style={{ backgroundColor: "black", color: "#39c53e", textAlign: "center" }}>Tablet</option>
                            <option value="mobile" style={{ backgroundColor: "black", color: "#39c53e", textAlign: "center" }}>Mobile</option>
                        </select>

                    </div>
                    {isSplitScreen ? (
                        <div style={{ display: "flex", height: "calc(100% - 50px)" }}>
                            <div style={{ width: "50%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" }}>
                                <iframe
                                    title="Live Preview"
                                    srcDoc={htmlContent}
                                    style={{
                                        width: getViewportDimensions().width,
                                        height: getViewportDimensions().height,
                                        border: "none",
                                        borderRadius: "10px",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                        padding: "10px",
                                        margin: "10px",
                                        overflow: "hidden",
                                    }}
                                />
                            </div>
                            <CodeMirror
                                theme={editorThemes[theme]}
                                onChange={onCodeChange}
                                value={activeFile?.content}
                                extensions={extensions}
                                minHeight="100%"
                                style={{
                                    fontSize: fontSize + "px",
                                    height: "100%",
                                    position: "relative",
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0", height: "calc(100% - 50px)" }}>
                            <iframe
                                title="Live Preview"
                                srcDoc={htmlContent}
                                style={{
                                    width: getViewportDimensions().width,
                                    height: getViewportDimensions().height,
                                    border: "none",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                    padding: "10px",
                                    margin: "10px",
                                    overflow: "hidden",
                                }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <CodeMirror
                    theme={editorThemes[theme]}
                    onChange={onCodeChange}
                    value={activeFile?.content}
                    extensions={extensions}
                    minHeight="100%"
                    style={{
                        fontSize: fontSize + "px",
                        height: "100%",
                        position: "relative",
                    }}
                />
            )}
        </div>
    );
}
export default Editor;