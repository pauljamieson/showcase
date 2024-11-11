require("./lib/bigint");
require("./tasks/importFiles");
require("./tasks/convertFiles");
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./routes/auth/auth";
import AdminRouter from "./routes/admin/admin";
import TagRouter from "./routes/tag/tag";
import TagsRouter from "./routes/tags/tags";
import VideosRouter from "./routes/videos/videos";
import VideoRouter from "./routes/video/video";
import PersonRouter from "./routes/person/person";
import PeopleRouter from "./routes/people/people";
import ProfileRouter from "./routes/profile/profile";
import MigrateRouter from "./routes/migrate/migrate";
import MainteanceRouter from "./routes/maintenance/maintenance";
import PlaylistRouter from "./routes/playlist/playlist";
import PlaylistsRouter from "./routes/playlists/playlists";

import { middleWare } from "./middleware/middleware";
const compression = require("compression");
dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(
  cors({
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use("/migrate", MigrateRouter);
app.use("/migrate/video", MigrateRouter);
app.use("/maintenance", MainteanceRouter);

app.use(middleWare);
app.use(express.json());
app.use(express.static("app_data/videos"));
app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);
app.use("/tag", TagRouter);
app.use("/tags", TagsRouter);
app.use("/person", PersonRouter);
app.use("/people", PeopleRouter);
app.use("/videos", VideosRouter);
app.use("/video", VideoRouter);
app.use("/profile", ProfileRouter);
app.use("/playlist", PlaylistRouter);
app.use("/playlists", PlaylistsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`[server]: Server is now running at http://localhost:${port}`);
});
