import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const videoId = req.params.videoId;
    const tagId = req.params.tagId;

    console.log(videoId, tagId);

    await prisma.tag.update({
      where: { id: +tagId },
      data: { videoFiles: { create: { videoId: +videoId } } },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
