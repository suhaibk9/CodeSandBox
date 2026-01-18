import { useState } from "react";

import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
const TreeNode = ({ nodeData }) => {
  const [visibleObj, setVisibleObj] = useState({});
  const handleToggleVisibility = (currentFolderName) => {
    setVisibleObj((prev) => {
      return { ...prev, [currentFolderName]: !visibleObj[currentFolderName] };
    });
  };

  return (
    <>
      <div
        style={{
          paddingLeft: "15px",
          color: "white",
        }}
      >
        {nodeData?.children ? (
          // Folder
          <button
            onClick={() => handleToggleVisibility(nodeData.name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
              padding: "4px 8px",
              background: "transparent",
              border: "none",
              color: "#cccccc",
              fontSize: "13px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: "4px",
              transition: "background-color 0.1s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            {visibleObj[nodeData.name] ? (
              <FaChevronDown
                style={{ width: "10px", height: "10px", flexShrink: 0 }}
              />
            ) : (
              <FaChevronRight
                style={{ width: "10px", height: "10px", flexShrink: 0 }}
              />
            )}
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nodeData?.name}
            </span>
          </button>
        ) : (
          // Folder
          <p
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              padding: "4px 8px",
              paddingLeft: "24px",
              color: "#cccccc",
              fontSize: "13px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "background-color 0.1s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            {nodeData?.name}
          </p>
        )}
        {visibleObj[nodeData.name] &&
          nodeData.children &&
          nodeData.children.map((child) => {
            return <TreeNode nodeData={child} key={child.name} />;
          })}
      </div>
    </>
  );
};
export default TreeNode;
//Folder - Has Children
//File - No Children
