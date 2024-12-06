import React from 'react';
import { useAppContext } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { SocketEvent } from "../types/socket";
import { useCallback, useEffect } from "react";
import { Tldraw, useEditor } from "tldraw";
import debounce from "lodash.debounce";

function DrawingEditor() {
    const { isMobile } = useWindowDimensions();

    return (
        <Tldraw
            inferDarkMode
            forceMobile={isMobile}
            defaultName="Editor"
            bounds={{ x: 0, y: 0, width: 800, height: 600 }}
            className="z-0"
        >
            <ReachEditor />
        </Tldraw>
    );
}

const ReachEditor = React.memo(() => {
    const editor = useEditor();
    const { drawingData, setDrawingData } = useAppContext();
    const { socket } = useSocket();

    const debouncedHandleChangeEvent = debounce((change) => {
        if (change instanceof HistoryEntry) {
            const snapshot = change.changes;
            setDrawingData(editor.store.getSnapshot());
            socket.emit(SocketEvent.DRAWING_UPDATE, { snapshot });
        }
    }, 100);

    const handleRemoteDrawing = useCallback(
        ({ snapshot }) => {
            if (snapshot instanceof RecordsDiff) {
                editor.store.mergeRemoteChanges(() => {
                    const { added, updated, removed } = snapshot;

                    Object.keys(added).forEach((key) => {
                        const record = added[key];
                        if (record instanceof TLRecord) {
                            editor.store.put([record]);
                        }
                    });

                    Object.keys(updated).forEach((key) => {
                        const [, to] = updated[key];
                        if (to instanceof TLRecord) {
                            editor.store.put([to]);
                        }
                    });

                    Object.keys(removed).forEach((key) => {
                        const record = removed[key];
                        if (record instanceof TLRecord) {
                            editor.store.remove([record.id]);
                        }
                    });
                });

                setDrawingData(editor.store.getSnapshot());
            }
        },
        [editor.store, setDrawingData]
    );

    useEffect(() => {
        if (drawingData && Object.keys(drawingData).length > 0) {
            editor.store.loadSnapshot(drawingData);
        }
    }, [drawingData, editor.store]);

    useEffect(() => {
        const cleanupFunction = editor.store.listen(debouncedHandleChangeEvent, {
            source: "user",
            scope: "document",
        });
        socket.on(SocketEvent.DRAWING_UPDATE, handleRemoteDrawing);

        return () => {
            cleanupFunction();
            socket.off(SocketEvent.DRAWING_UPDATE);
        };
    }, [editor.store, debouncedHandleChangeEvent, handleRemoteDrawing, socket]);

    return null;
});

export default DrawingEditor;