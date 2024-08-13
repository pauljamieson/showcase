import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function POST(req: Request, res: Response) {
  try {
    const { tagId, videoId }: { tagId: string; videoId: string } = req.body;

    console.log(+tagId, +videoId);
    const result = await prisma.tag.update({
      where: { id: +tagId },
      data: { videoFiles: { disconnect: { id: +videoId } } },
    });
    console.log(result);
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure" });
  }
}

export default { POST };
