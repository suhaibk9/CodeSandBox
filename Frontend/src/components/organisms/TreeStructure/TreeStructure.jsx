import { useParams } from "react-router-dom";
import useTreeStructureStore from "../../../store/treeStructureStore";
import { useEffect, useState } from "react";
import TreeNode from "../../molecules/TreeNode/TreeNode";
import { FolderContextMenu } from "../../molecules/ContextMenu/FolderContextMenu";
import { useContextMenuStore } from "../../../store/fileContextMenuStore";
import { FileContextMenu } from "../../molecules/ContextMenu/FileContextMenu";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { Button, Input, Modal, Space } from "antd";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
export const TreeStructure = () => {
  const { projectId } = useParams();
  const { treeStructure, setTreeStructure } = useTreeStructureStore();
  const { editorSocket } = useEditorSocketStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState("folder");
  const [basePath, setBasePath] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (!treeStructure) setTreeStructure();
    else console.log("treeStructureData", treeStructure);
  }, [projectId, setTreeStructure, treeStructure]);
  const {
    x: fileX,
    y: fileY,
    file,
    isOpen: isFileContextOpen,
  } = useContextMenuStore();
  const {
    x: folderX,
    y: folderY,
    folder,
    isOpen: isFolderContextOpen,
  } = useFolderContextMenuStore();
  const handleRequestCreate = (type, targetBasePath) => {
    setCreateType(type);
    setBasePath(targetBasePath || "");
    setName("");
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const targetPath = basePath ? `${basePath}/${trimmedName}` : trimmedName;
    if (createType === "folder") {
      editorSocket.emit("createFolder", targetPath);
    } else {
      editorSocket.emit("createFile", targetPath);
    }
    setIsCreateOpen(false);
  };

  const handleCancel = () => {
    setIsCreateOpen(false);
  };
  if (!treeStructure) return <div>Loading....</div>;
  return (
    <>
      {fileX && fileY && isFileContextOpen && file && (
        <FileContextMenu
          x={fileX}
          y={fileY}
          file={file}
          onRequestCreate={handleRequestCreate}
        />
      )}
      {folderX && folderY && isFolderContextOpen && folder && (
        <FolderContextMenu
          x={folderX}
          y={folderY}
          folder={folder}
          onRequestCreate={handleRequestCreate}
        />
      )}
      <Modal
        open={isCreateOpen}
        title={createType === "folder" ? "Create New Folder" : "Create New File"}
        onCancel={handleCancel}
        rootClassName="csb-modal"
        styles={{
          mask: { backgroundColor: "rgba(0, 0, 0, 0.65)" },
          content: { padding: "20px" },
        }}
        footer={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              Create
            </Button>
          </Space>
        }
      >
        <Input
          placeholder={
            createType === "folder" ? "Enter folder name" : "Enter file name"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={handleCreate}
          autoFocus
        />
      </Modal>
      <TreeNode nodeData={treeStructure} />
    </>
  );
};
