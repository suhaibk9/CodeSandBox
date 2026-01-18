import useTreeStructureStore from "../../../store/treeStructureStore";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
const TreeNode = ({ nodeData }) => {
 console.log("NodeData",nodeData)
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
        {nodeData?.children ? (
          <button>
            <FaChevronRight style={{ width: "10px", height: "10px" }} />{" "}
            {nodeData?.name}
          </button>
        ) : (
          <p>{nodeData?.name}</p>
        )}
      </div>
    </>
  );
};
export default TreeNode;
