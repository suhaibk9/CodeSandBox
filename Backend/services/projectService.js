import util from "util";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { execPromisified } from "../utils/execUtility.js";
import directoryTree from "directory-tree";

export const createProjectService = async (
  language = "js",
  projectName = "react-playground",
) => {
  const command =
    language === "ts"
      ? process.env.REACT_PROJECT_COMMAND_TS
      : process.env.REACT_PROJECT_COMMAND_JS;

  const unique_project_id = uuidv4();
  const projectPath = `./Projects/${unique_project_id}`;
  await fs.mkdir(projectPath, { recursive: true });

  // Add project name to the vite command
  const fullCommand = `${command} ${projectName} -- --template react${language === "ts" ? "-ts" : ""}`;
  await execPromisified(fullCommand, { cwd: projectPath });

  return {
    projectId: unique_project_id,
    language,
    projectPath,
    projectName,
  };
};

export const getProjectTreeService = async (projectId) => {
  const projectPath = path.resolve("./Projects/" + projectId);
  return directoryTree(projectPath);
};
