import { useParams } from "react-router-dom";
import EditorComponent from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import useTreeStructureStore from "../store/treeStructureStore";
import { useEffect } from "react";

const ProjectPlayground = () => {
  const { projectId: projectIdFromURL } = useParams();
  const { projectId, setProjectId } = useTreeStructureStore();

  useEffect(() => {
    setProjectId(projectIdFromURL);
  }, [projectIdFromURL, setProjectId]);

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
          <EditorButton fileName="File.ts" isActive={true} />
          <EditorButton fileName="File.tsx" />
          <EditorButton fileName="File.jsx" isActive={true} />
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
      </div>
    </div>
  );
};
export default ProjectPlayground;
