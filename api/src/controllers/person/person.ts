import { Request, Response } from "express";
import { createPerson } from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { name, videoId }: { name: string; videoId: string } = req.body;

    if (name === null || name === "") return res.json({ status: "ok" });
    if (videoId === null || videoId === "") return res.json({ status: "ok" });

    
    const names = name.split(",").map((n) => n.trim());
    
    for (const n of names) {
      await createPerson(n, +videoId, +res.locals.user);
    } 

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
