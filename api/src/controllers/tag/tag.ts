import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { name, videoId }: { name: string; videoId: string } = req.body;

    if (name === null) return res.json({ status: "ok" });
    if (videoId === null) return res.json({ status: "ok" });

    const tag = await prisma.tag.upsert({
      where: { name: name },
      create: {
        name: name,
        creator: { connect: { id: +res.locals.user } },
        videoFiles: { connect: { id: +videoId } },
      },
      update: { videoFiles: { connect: { id: +videoId } } },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure" });
  }
}

export default { POST };
