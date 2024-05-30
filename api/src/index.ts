import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import SignUpRouter from "./routes/signup";

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use("/signup", SignUpRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + Typescript Server.");
});

app.listen(port, () => {
  console.log(`[server]: Server is now running at http://localhost:${port}`);
});
