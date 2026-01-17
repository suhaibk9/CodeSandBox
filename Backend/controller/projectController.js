import child_process from "child_process";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
const execPromisified = util.promisify(child_process.exec);
const projectController = async (req, res) => {
  try {
    const { language = "js" } = req.body;
    const template = language === "ts" ? "react-ts" : "react";

    //Create all projects inside projects folder.
    // unique_id -> Porject so it means create a folder with a unique_id inside the projects folder.
    //First create Unique Id folder
    const unique_project_id = uuidv4();
    const projectPath = `./projects/${unique_project_id}`;
    await fs.mkdir(projectPath, { recursive: true });

    //Now create a new Vite Project inside the that newly created folder with the unique folder
    await execPromisified(
      `npm create vite@latest react-playground -- --template ${template}`,
      { cwd: projectPath }
    );
    return res.status(200).json({
      msg: `New React ${language.toUpperCase()} Project Created`,
      projectId: unique_project_id,
      language,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ msg: "Error creating project" });
  }
};

export default projectController;
