import { useParams } from "react-router-dom";
import EditorComponent from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import useTreeStructureStore from "../store/treeStructureStore";
import { useEffect } from "react";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";

import BrowserTerminal from "../components/molecules/Terminal/BrowserTerminal";

const ProjectPlayground = () => {
  const { projectId: projectIdFromURL } = useParams();
  const { projectId, setProjectId } = useTreeStructureStore();
  const { editorSocket, setEditorSocket } = useEditorSocketStore();
  useEffect(() => {
    if (!projectIdFromURL) return;
    setProjectId(projectIdFromURL);
    const editorSocketConntection = io(
      import.meta.env.VITE_API_BASE_URL + "/editor",
      { query: { projectId: projectIdFromURL } },
    );
    setEditorSocket(editorSocketConntection, projectIdFromURL);
    return () => {
      editorSocketConntection.disconnect(); // cleanup when switching again
    };
  }, [projectIdFromURL, setProjectId]);
  useEffect(() => {
    if (editorSocket) {
      // Use editorSocket (connected to /editor namespace) NOT the default socket
      editorSocket.emit("getPort");
    }
  }, [editorSocket]);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#1e1e1e",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      {projectId && (
        <div
          style={{
            width: "250px",
            minWidth: "200px",
            backgroundColor: "#252526",
            borderRight: "1px solid #3c3c3c",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#bbbbbb",
              borderBottom: "1px solid #3c3c3c",
            }}
          >
            Explorer
          </div>
          <TreeStructure />
        </div>
      )}

      {/* Editor Area (Tabs + Editor) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Tabs Bar */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#252526",
            borderBottom: "1px solid #3c3c3c",
            flexShrink: 0,
          }}
        >
          <EditorButton />
          <EditorButton isActive={true} />
        </div>

        {/* Editor */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            backgroundColor: "#1e1e1e",
          }}
        >
          <EditorComponent />
        </div>

        {/* Terminal */}
        <div
          style={{
            height: "200px",
            minHeight: "100px",
            backgroundColor: "#1e1e1e",
            borderTop: "1px solid #3c3c3c",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Terminal Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 12px",
              backgroundColor: "#252526",
              borderBottom: "1px solid #3c3c3c",
              fontSize: "12px",
              color: "#cccccc",
              gap: "12px",
            }}
          >
            <span style={{ fontWeight: 500 }}>TERMINAL</span>
          </div>
          {/* Terminal Body */}
          <div style={{ flex: 1, overflow: "hidden", padding: "4px" }}>
            <BrowserTerminal />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectPlayground;
