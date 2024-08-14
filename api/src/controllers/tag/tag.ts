import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function POST(req: Request, res: Response) {
  try {
    const { name, videoId }: { name: string; videoId: string } = req.body;

    await prisma.tag.upsert({
      where: {
        name: name,
      },
      update: {
        videoFiles: { create: { videoFileId: +videoId } },
      },
      create: {
        name: name,
        creator: +res.locals.user,
        videoFiles: { create: { videoFileId: +videoId } },
      },
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
