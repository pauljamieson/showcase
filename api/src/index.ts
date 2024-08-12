require("./lib/bigint");
require("./tasks/importFiles");
import express, {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./routes/auth/auth";
import AdminRouter from "./routes/admin/admin";
import TagRouter from "./routes/tag/tag";
import TagsRouter from "./routes/tags/tags";
import CastRouter from "./routes/cast/cast";
import VideosRouter from "./routes/videos/videos";
import VideoRouter from "./routes/video/video";
import { middleWare } from "./middleware/middleware";

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(
  cors({
    exposedHeaders: ["Authorization"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(middleWare);
app.use(express.json());
app.use(express.static("app_data/videos"));
app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);
app.use("/tag", TagRouter);
app.use("/tags", TagsRouter);
app.use("/cast", CastRouter);
app.use("/videos", VideosRouter);
app.use("/video", VideoRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`[server]: Server is now running at http://localhost:${port}`);
});
