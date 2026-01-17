import { useParams } from "react-router-dom";
import EditorComponent from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";

const ProjectPlayground = () => {
  const { projectId } = useParams();
  return (
    <>
      <h1> Project Id: {projectId}</h1>
      <EditorComponent />
      <EditorButton />
      <EditorButton isActive={true} />
      <EditorButton fileName="File.ts" isActive={true} />
      <EditorButton fileName="File.tsx" />
    <EditorButton fileName="File.jsx" isActive={true} /></>
  );
};
export default ProjectPlayground;
