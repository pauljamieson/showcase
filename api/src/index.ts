require("./lib/bigint");
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./routes/auth/auth";
import AdminRouter from "./routes/admin/admin";
import TagRouter from "./routes/tag/tag";
import CastRouter from "./routes/cast/cast";

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(cors({ exposedHeaders: ["Authorization"] }));
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);
app.use("/tag", TagRouter);
app.use("/cast", CastRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`[server]: Server is now running at http://localhost:${port}`);
});
