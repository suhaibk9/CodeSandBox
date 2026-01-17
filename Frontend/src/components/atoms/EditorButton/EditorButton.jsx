import "./EditorButton.css";

const getFileExtension = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  return ext || "js";
};

const getIconLabel = (ext) => {
  const labels = {
    js: "JS",
    ts: "TS",
    jsx: "JS",
    tsx: "TS",
    css: "{ }",
    html: "<>",
  };
  return labels[ext] || ext?.toUpperCase();
};

export const EditorButton = ({
  fileName = "File.js",
  isActive = false,
  onClick,
  onClose,
}) => {
  const ext = getFileExtension(fileName);

  return (
    <button
      className={`editor-button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <span className={`editor-button-icon ${ext}`}>{getIconLabel(ext)}</span>
      <span>{fileName}</span>
      <span
        className="editor-button-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
      >
        ×
      </span>
    </button>
  );
};
