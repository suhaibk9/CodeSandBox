import useTreeStructureStore from "../../../store/treeStructureStore";

const TreeNode = () => {
  const { treeStructure } = useTreeStructureStore();
  //Folder - Has Children
  //File - No Children
  return (
    <>
      <div
        style={{
          paddingLeft: "15px",
          color: "white",
        }}
      >
        {nodeData.children?}
      </div>
    </>
  );
};
