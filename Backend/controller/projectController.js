import {
  createProjectService,
  getProjectTreeService,
} from "../services/projectService.js";

export const projectController = async (req, res) => {
  try {
    const { language = "js" } = req.body;
    const result = await createProjectService(language);

    return res.status(200).json({
      msg: `New React ${language.toUpperCase()} Project Created`,
      projectId: result.projectId,
      language: result.language,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ msg: "Error creating project" });
  }
};
export const getProjectTree = async (req, res) => {
  try {
    const tree = await getProjectTreeService(req.params.projectId);
    return res.status(200).json({
      data: tree,
      success: true,
      msg: "Fetched Tree",
    });
  } catch (error) {
    console.error("Error fetching project tree:", error);
    return res.status(500).json({ msg: "Error fetching project tree" });
  }
};