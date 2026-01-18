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
    <>
      <h1> Project Id: {projectIdFromURL}</h1>
      {projectId && <TreeStructure />}
      <EditorComponent />
      <EditorButton />
      <EditorButton isActive={true} />
      <EditorButton fileName="File.ts" isActive={true} />
      <EditorButton fileName="File.tsx" />
      <EditorButton fileName="File.jsx" isActive={true} />
    </>
  );
};
export default ProjectPlayground;
