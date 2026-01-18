import { useParams } from "react-router-dom";
import useTreeStructureStore from "../../../store/treeStructureStore";
import { useEffect } from "react";

export const TreeStructure = () => {
  const { projectId } = useParams();
  const { treeStructure, setTreeStructure } = useTreeStructureStore();
  useEffect(() => {
    if (!treeStructure) setTreeStructure();
    else console.log("treeStructureData", treeStructure);
  }, [projectId, setTreeStructure]);
  return <h1>TreeStructure</h1>;
};
