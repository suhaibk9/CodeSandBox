import Editor from "@monaco-editor/react";

const EditorComponent = () => {
  const handleEditorChange = (value) => {
    console.log("Editor content:", value);
  };

  return (
    <Editor
      height="80vh"
      width="100%"
      defaultLanguage="javascript"
      defaultValue="// Start coding here..."
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
