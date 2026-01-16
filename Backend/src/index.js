import express from "express";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "../routes/index.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", apiRouter);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
