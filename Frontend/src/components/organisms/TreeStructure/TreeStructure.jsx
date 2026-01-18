import { useParams } from "react-router-dom";
import useTreeStructureStore from "../../../store/treeStructureStore";
import { useEffect } from "react";
import TreeNode from "../../molecules/TreeNode/TreeNode";
export const TreeStructure = () => {
  const { projectId } = useParams();
  const { treeStructure, setTreeStructure } = useTreeStructureStore();
  useEffect(() => {
    if (!treeStructure) setTreeStructure();
    else console.log("treeStructureData", treeStructure);
  }, [projectId, setTreeStructure]);
  if (!treeStructure) return <div>Loading....</div>;
  return (
    <>

      <TreeNode nodeData={treeStructure} />
    </>
  );
};
