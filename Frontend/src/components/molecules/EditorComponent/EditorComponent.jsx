import Editor from "@monaco-editor/react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useDebounce } from "../../../hooks/useDebounce";
import { useActiveFileTabStore } from "../../../store/activeFileTabStore";
import { getFileType } from "../../../utils/getFileType";

const EditorComponent = () => {
  const { activeFileTab } = useActiveFileTabStore();
  const { writeFile } = useEditorSocketStore();

  const handleEditorChange = (value) => {
    if (activeFileTab?.path) {
      writeFile(value, activeFileTab.path);
    }
  };

  const debouncedHandleEditorChange = useDebounce(handleEditorChange, 2000);
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
      onChange={debouncedHandleEditorChange}
      options={{
        fontSize: 16,
        fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
      }}
    />
  );
};

export default EditorComponent;
