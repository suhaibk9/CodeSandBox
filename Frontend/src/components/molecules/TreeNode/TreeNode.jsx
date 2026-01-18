import { useState } from "react";
import {
  FaChevronRight,
  FaChevronDown,
  FaFolder,
  FaFolderOpen,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiCss3,
  SiHtml5,
  SiJson,
  SiMarkdown,
  SiReact,
  SiNpm,
} from "react-icons/si";
import { VscFile } from "react-icons/vsc";

const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();
  const iconStyle = { width: "14px", height: "14px", flexShrink: 0 };

  // Special cases for specific filenames
  if (fileName === "package.json") {
    return <SiNpm style={{ ...iconStyle, color: "#cb3837" }} />;
  }
  if (fileName === "package-lock.json") {
    return <SiNpm style={{ ...iconStyle, color: "#888888" }} />;
  }

  const iconMap = {
    js: <SiJavascript style={{ ...iconStyle, color: "#f7df1e" }} />,
    jsx: <SiReact style={{ ...iconStyle, color: "#61dafb" }} />,
    ts: <SiTypescript style={{ ...iconStyle, color: "#3178c6" }} />,
    tsx: <SiReact style={{ ...iconStyle, color: "#3178c6" }} />,
    css: <SiCss3 style={{ ...iconStyle, color: "#264de4" }} />,
    html: <SiHtml5 style={{ ...iconStyle, color: "#e34f26" }} />,
    json: <SiJson style={{ ...iconStyle, color: "#cbcb41" }} />,
    md: <SiMarkdown style={{ ...iconStyle, color: "#083fa1" }} />,
    svg: <VscFile style={{ ...iconStyle, color: "#ffb13b" }} />,
    png: <VscFile style={{ ...iconStyle, color: "#a074c4" }} />,
    jpg: <VscFile style={{ ...iconStyle, color: "#a074c4" }} />,
    gitignore: <VscFile style={{ ...iconStyle, color: "#f14e32" }} />,
  };

  return iconMap[ext] || <VscFile style={{ ...iconStyle, color: "#8c8c8c" }} />;
};

const TreeNode = ({ nodeData }) => {
  const [visibleObj, setVisibleObj] = useState({});
  const handleToggleVisibility = (currentFolderName) => {
    setVisibleObj((prev) => {
      return { ...prev, [currentFolderName]: !visibleObj[currentFolderName] };
    });
  };

  const isFolder = nodeData?.children;
  const isOpen = visibleObj[nodeData.name];

  return (
    <>
      <div
        style={{
          paddingLeft: "15px",
          color: "white",
        }}
      >
        {isFolder ? (
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
            {isOpen ? (
              <FaChevronDown
                style={{ width: "10px", height: "10px", flexShrink: 0 }}
              />
            ) : (
              <FaChevronRight
                style={{ width: "10px", height: "10px", flexShrink: 0 }}
              />
            )}
            {isOpen ? (
              <FaFolderOpen
                style={{
                  width: "14px",
                  height: "14px",
                  flexShrink: 0,
                  color: "#dcb67a",
                }}
              />
            ) : (
              <FaFolder
                style={{
                  width: "14px",
                  height: "14px",
                  flexShrink: 0,
                  color: "#dcb67a",
                }}
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
          // File
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: 0,
              padding: "4px 8px",
              paddingLeft: "28px",
              color: "#cccccc",
              fontSize: "13px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              cursor: "pointer",
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
            {getFileIcon(nodeData?.name)}
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nodeData?.name}
            </span>
          </p>
        )}
        {isOpen &&
          nodeData.children &&
          nodeData.children.map((child) => {
            return <TreeNode nodeData={child} key={child.name} />;
          })}
      </div>
    </>
  );
};
export default TreeNode;
