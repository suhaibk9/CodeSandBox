import { useEffect, useRef } from "react";
import { useContextMenuStore } from "../../../store/fileContextMenuStore";
import useTreeStructureStore from "../../../store/treeStructureStore";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import "./FileContextMenu.css";

export const FileContextMenu = ({ x, y, onRequestCreate }) => {
  const { isOpen, setIsOpen, file } = useContextMenuStore();
  const { editorSocket } = useEditorSocketStore();
  const contextMenuRef = useRef(null);

  const getParentFolder = (filePath) => {
    if (!filePath) return "";
    const parts = filePath.split("/");
    if (parts.length <= 1) return "";
    parts.pop();
    return parts.join("/");
  };

  const handleDelete = (e) => {
    e.preventDefault();
    editorSocket.emit("deleteFile", file);
    setIsOpen(false);
  };

  const handleOpenCreate = (type) => (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onRequestCreate) onRequestCreate(type, getParentFolder(file));
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
