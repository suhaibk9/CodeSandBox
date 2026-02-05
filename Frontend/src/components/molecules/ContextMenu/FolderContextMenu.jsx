import { useEffect, useRef } from "react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import "./FolderContextMenu.css";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

export const FolderContextMenu = ({ x, y, onRequestCreate }) => {
  const { isOpen, setIsOpen, folder } = useFolderContextMenuStore();
  const { editorSocket } = useEditorSocketStore();

  const contextMenuRef = useRef(null);

  const handleDelete = (e) => {
    e.preventDefault();
    editorSocket.emit("deleteFolder", folder);
    setIsOpen(false);
  };
  const handleOpenCreate = (type) => (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onRequestCreate) onRequestCreate(type, folder);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div
      ref={contextMenuRef}
      className="context-menu"
      style={{ left: x, top: y }}
    >
      <button
        className="context-menu-item"
        onClick={handleOpenCreate("file")}
      >
        New File
      </button>
      <button
        className="context-menu-item"
        onClick={handleOpenCreate("folder")}
      >
        New Folder
      </button>
      <button className="context-menu-item">Rename</button>
      <button className="context-menu-item danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
