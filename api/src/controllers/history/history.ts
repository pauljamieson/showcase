import { Request, Response } from "express";
import { createPerson, createUserHistory, getUserHistory } from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { userId, videoId }: { userId: string; videoId: string } = req.body;

    if (userId === null) return res.json({ status: "ok" });
    if (videoId === null) return res.json({ status: "ok" });

    await createUserHistory(+userId, +videoId);

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { userId } = req.query as { userId?: string };

    if (!userId) return res.json({ status: "ok" });

    const history = await getUserHistory(+userId);

    res.json({ status: "success", data: history });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET, POST };
