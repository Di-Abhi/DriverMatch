import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import routes from "./routes/index";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ENDPOINT,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
