import axiosInstnace from "../config/axiosConfig";
const pingApi = async () => {
  try {
    const res = await axiosInstnace.get("/api/v1/ping");
    console.log(res["msg"]);
  } catch (err) {
    console.error(err);
  }
};
export { pingApi };
