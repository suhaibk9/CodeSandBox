import axiosInstance from "../config/axiosConfig";
const pingApi = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/ping");
    if (res && res?.msg) console.log(res.msg);
  } catch (err) {
    console.error(err);
  }
};
export { pingApi };
