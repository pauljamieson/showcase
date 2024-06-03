require("./lib/bigint");
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import AuthRouter from "./routes/auth";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(cors({ exposedHeaders: ["Authorization"] }));
app.use(express.json());
app.use("/auth", AuthRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + Typescript Server!.");
});

app.listen(port, () => {
  console.log(`[server]: Server is now running at http://localhost:${port}`);
});
