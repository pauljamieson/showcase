import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function POST(req: Request, res: Response) {
  try {
    const { name, videoId }: { name: string; videoId: string } = req.body;

    if (name === null) return res.json({ status: "ok" });
    if (videoId === null) return res.json({ status: "ok" });

    await prisma.person.upsert({
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

function GET(req: Request, res: Response) {
  res.json({ status: "success" });
}

export default { GET, POST };
