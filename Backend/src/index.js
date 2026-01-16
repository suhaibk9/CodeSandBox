import express from "express";
import cors from "cors";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "../routes/index.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://code-sand-box-one.vercel.app"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
