import axiosInstance from "../config/axiosConfig";

export const projectsApi = async (language = "js") => {
  try {
    const res = await axiosInstance.post("/api/v1/projects", { language });
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
