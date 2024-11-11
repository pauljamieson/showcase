import { Request, Response } from "express";
import { createPerson } from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { name, videoId }: { name: string; videoId: string } = req.body;

    if (name === null) return res.json({ status: "ok" });
    if (videoId === null) return res.json({ status: "ok" });

    await createPerson(name, +videoId, +res.locals.user);

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

function GET(req: Request, res: Response) {
  res.json({ status: "success" });
}

export default { GET, POST };
