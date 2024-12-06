import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { PiPencilSimpleFill } from "react-icons/pi";
import { RiFileAddLine, RiFolderAddLine, RiFolderUploadLine } from "react-icons/ri";
import { useAppContext } from "../context/AppContext";
import { useFileSystem } from "../context/FileContext";
import { useViews } from "../context/ViewContext";
import { useContextMenu } from "../hooks/useContextMenu";
import useResponsive from "../hooks/useResponsive";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { ACTIVITY_STATE } from "../types/app";
import { sortFileSystemItem } from "../utils/file";
import { getIconClassName } from "../utils/getIconClassName";
import RenameView from "./RenameView";
function FileStructureView() {
    const { fileStructure, createFile, createDirectory, collapseDirectories } = useFileSystem();
    const explorerRef = useRef(null);
    const [selectedDirId, setSelectedDirId] = useState(null);
    const { minHeightReached } = useResponsive();

    const handleClickOutside = (e) => {
        if (explorerRef.current && !explorerRef.current.contains(e.target)) {
            setSelectedDirId(fileStructure.id);
        }
    };

    const handleCreateFile = () => {
        const fileName = prompt("Enter file name");
        if (fileName) {
            const parentDirId = selectedDirId || fileStructure.id;
            createFile(parentDirId, fileName);
        }
    };

    const handleCreateDirectory = () => {
        const dirName = prompt("Enter directory name");
        if (dirName) {
            const parentDirId = selectedDirId || fileStructure.id;
            createDirectory(parentDirId, dirName);
        }
    };

    const sortedFileStructure = sortFileSystemItem(fileStructure);

    return (
        <div onClick={handleClickOutside} className="flex flex-grow flex-col">
            <div className="view-title flex justify-between">
                <h2>Files</h2>
                <div className="flex gap-2">
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={handleCreateFile}
                        title="Create File"
                    >
                        <RiFileAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={handleCreateDirectory}
                        title="Create Directory"
                    >
                        <RiFolderAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover"
                        onClick={collapseDirectories}
                        title="Collapse All Directories"
                    >
                        <RiFolderUploadLine size={20} />
                    </button>
                </div>
            </div>
            <div
                className={`min-h-[200px] flex-grow overflow-auto pr-2 sm:min-h-0 ${minHeightReached ? "h-[85vh]" : "h-[calc(80vh-170px)]"
                    }`}
                ref={explorerRef}
            >
                {sortedFileStructure.children &&
                    sortedFileStructure.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                        />
                    ))}
            </div>
        </div>
    );
}

function Directory({ item, setSelectedDirId }) {
    const [isEditing, setEditing] = useState(false);
    const dirRef = useRef(null);
    const { coords, menuOpen, setMenuOpen } = useContextMenu({ ref: dirRef });
    const { deleteDirectory, toggleDirectory } = useFileSystem();

    const handleDirClick = (dirId) => {
        setSelectedDirId(dirId);
        toggleDirectory(dirId);
    };

    const handleRenameDirectory = (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        setEditing(true);
    };

    const handleDeleteDirectory = (e, id) => {
        e.stopPropagation();
        setMenuOpen(false);
        const isConfirmed = confirm(`Are you sure you want to delete this directory?`);
        if (isConfirmed) {
            deleteDirectory(id);
        }
    };

    useEffect(() => {
        const dirNode = dirRef.current;

        if (!dirNode) return;

        dirNode.tabIndex = 0;

        const handleF2 = (e) => {
            e.stopPropagation();
            if (e.key === "F2") {
                setEditing(true);
            }
        };

        dirNode.addEventListener("keydown", handleF2);

        return () => {
            dirNode.removeEventListener("keydown", handleF2);
        };
    }, []);

    if (item.type === "file") {
        return <File item={item} setSelectedDirId={setSelectedDirId} />;
    }

    return (
        <div className="overflow-x-auto">
            <div
                className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
                onClick={() => handleDirClick(item.id)}
                ref={dirRef}
            >
                {item.isOpen ? (
                    <AiOutlineFolderOpen size={24} className="mr-2 min-w-fit" />
                ) : (
                    <AiOutlineFolder size={24} className="mr-2 min-w-fit" />
                )}
                {isEditing ? (
                    <RenameView
                        id={item.id}
                        preName={item.name}
                        type="directory"
                        setEditing={setEditing}
                    />
                ) : (
                    <p
                        className="flex-grow cursor-pointer overflow-hidden truncate"
                        title={item.name}
                    >
                        {item.name}
                    </p>
                )}
            </div>
            <div className={`pl-4 ${!item.isOpen ? 'hidden' : 'block'}`}>
                {item.children &&
                    item.children.map((childItem) => (
                        <Directory
                            key={childItem.id}
                            item={childItem}
                            setSelectedDirId={setSelectedDirId}
                        />
                    ))}
            </div>

            {menuOpen && (
                <DirectoryMenu
                    handleDeleteDirectory={(e) => handleDeleteDirectory(e, item.id)} // Pass the correct id
                    handleRenameDirectory={handleRenameDirectory}
                    id={item.id}
                    left={coords.x}
                    top={coords.y}
                />
            )}
        </div>
    );
}

const File = ({ item, setSelectedDirId }) => {
    const { deleteFile, openFile } = useFileSystem();
    const [isEditing, setEditing] = useState(false);
    const { setIsSidebarOpen } = useViews();
    const { isMobile } = useWindowDimensions();
    const { activityState, setActivityState } = useAppContext();
    const fileRef = useRef(null);
    const { menuOpen, coords, setMenuOpen } = useContextMenu({ ref: fileRef });

    const handleFileClick = (fileId) => {
        if (isEditing) return;
        setSelectedDirId(fileId);

        openFile(fileId);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
        if (activityState === ACTIVITY_STATE.DRAWING) {
            setActivityState(ACTIVITY_STATE.CODING);
        }
    };

    const handleRenameFile = (e) => {
        e.stopPropagation();
        setEditing(true);
        setMenuOpen(false);
    };

    const handleDeleteFile = (e, id) => {
        e.stopPropagation();
        setMenuOpen(false);
        const isConfirmed = confirm(`Are you sure you want to delete file?`);
        if (isConfirmed) {
            deleteFile(id);
        }
    };

    useEffect(() => {
        const fileNode = fileRef.current;

        if (!fileNode) return;

        fileNode.tabIndex = 0;

        const handleF2 = (e) => {
            e.stopPropagation();
            if (e.key === "F2") {
                setEditing(true);
            }
        };

        fileNode.addEventListener("keydown", handleF2);

        return () => {
            fileNode.removeEventListener("keydown", handleF2);
        };
    }, []);

    return (
        <div
            className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
            onClick={() => handleFileClick(item.id)}
            ref={fileRef}
        >
            <Icon
                icon={getIconClassName(item.name)}
                fontSize={22}
                className="mr-2 min-w-fit"
            />
            {isEditing ? (
                <RenameView
                    id={item.id}
                    preName={item.name}
                    type="file"
                    setEditing={setEditing}
                />
            ) : (
                <p
                    className="flex-grow cursor-pointer overflow-hidden truncate"
                    title={item.name}
                >
                    {item.name}
                </p>
            )}

            {/* Context Menu For File */}
            {menuOpen && (
                <FileMenu
                    top={coords.y}
                    left={coords.x}
                    id={item.id}
                    handleRenameFile={handleRenameFile}
                    handleDeleteFile={handleDeleteFile}
                />
            )}
        </div>
    );
}

const FileMenu = ({ top, left, id, handleRenameFile, handleDeleteFile }) => {
    return (
        <div
            className="absolute z-10 w-[150px] rounded-md border border-darkHover bg-dark p-1"
            style={{ top, left }}
        >
            <ul className="list-none p-2">
                <li className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover" onClick={handleRenameFile}>
                    <PiPencilSimpleFill size={16} /> Rename
                </li>
                <li className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-danger hover:bg-darkHover" onClick={(e) => handleDeleteFile(e, id)}>
                    <MdDelete size={16} /> Delete
                </li>
            </ul>
        </div>
    );
};

const DirectoryMenu = ({ left, top, handleDeleteDirectory, handleRenameDirectory }) => {
    return (
        <div
            className="absolute z-10 w-[150px] rounded-md border border-darkHover bg-dark p-1"
            style={{ top, left }}
        >
            <ul className="list-none p-2">
                <li className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover" onClick={handleRenameDirectory}>
                    <PiPencilSimpleFill size={16} /> Rename
                </li>
                <li className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-danger hover:bg-darkHover" onClick={handleDeleteDirectory}>
                    <MdDelete size={16} /> Delete
                </li>
            </ul>
        </div>
    );
};

export default FileStructureView;