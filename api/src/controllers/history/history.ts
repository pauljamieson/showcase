import { Request, Response } from "express";
import { createUserHistory, getHistoryByVideoIds, getUserHistory, getVideoFiles } from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const userId = +res.locals.user;
    const { videoId }: { videoId: string } = req.body;

    if (!userId) return res.json({ status: "ok" });
    if (!videoId) return res.json({ status: "ok" });

    await createUserHistory(userId, +videoId);

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const userId = +res.locals.user;

    if (!userId) return res.json({ status: "ok" });

    const history = await getUserHistory(userId);
    const videos = await getHistoryByVideoIds(history.map((h) => h.videoFileId)); 

    res.json({ status: "success", data: {history , videos } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET, POST };
