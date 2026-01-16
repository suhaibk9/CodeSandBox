import express from "express";
import { PORT } from "./config/serverConfig.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/ping", (req, res) => {
  return res.status(200).json({ msg: "pong" });
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
