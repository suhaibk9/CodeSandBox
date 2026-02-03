import Editor from "@monaco-editor/react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";

import { useEffect } from "react";
import { useActiveFileTabStore } from "../../../store/activeFileTabStore";
const getFileType = (extension) => {
  if (extension === "js") return "javascript";
  else if (extension === "ts") return "typescript";
  else return extension;
};
const EditorComponent = () => {
  const { activeFileTab, setActiveFileTab } = useActiveFileTabStore();

  const { editorSocket } = useEditorSocketStore();

  const handleEditorChange = (value) => {
    if (editorSocket && activeFileTab?.path) {
      editorSocket.emit("writeFile", value, activeFileTab.path);
    }
  };

  useEffect(() => {
    if (editorSocket) {
      editorSocket.on("fileData", (data) => {
        console.log("Received file data:", data);
        const extension = data.filePath.split(".").pop();
        console.log("EXT", extension);
        setActiveFileTab(data.filePath, data.data, extension);
      });
      editorSocket.on("fileWritten", (res) => {
        console.log("recieved res", res);
      });
    }
  }, [editorSocket, setActiveFileTab, handleEditorChange]);
  return (
    <Editor
      height="80vh"
      width="100%"
      language={
        activeFileTab?.extension
          ? getFileType(activeFileTab.extension)
          : "javascript"
      }
      defaultValue="// Start coding here..."
      value={activeFileTab ? activeFileTab.value : "// Start coding here..."}
      theme="vs-dark"
      onChange={handleEditorChange}
      options={{
        fontSize: 16,
        fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
      }}
    />
  );
};

export default EditorComponent;
