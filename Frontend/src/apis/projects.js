import axiosInstance from "../config/axiosConfig";

export const projectsApi = async ({
  language = "js",
  projectName = "react-playground",
}) => {
  try {
    const res = await axiosInstance.post("/api/v1/projects", {
      language,
      projectName,
    });
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const getProjectTree = async (projectId) => {
  try {
    const res = await axiosInstance.get(`/api/v1/projects/${projectId}/tree`);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
