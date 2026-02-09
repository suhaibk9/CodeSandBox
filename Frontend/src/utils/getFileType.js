const extensionMap = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  md: "markdown",
  svg: "xml",
};

export const getFileType = (extension) => {
  return extensionMap[extension] || extension;
};
