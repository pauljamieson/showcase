import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { tagId, videoId }: { tagId: string; videoId: string } = req.body;

    const result = await prisma.tag.update({
      where: { id: +tagId },
      data: {
        videoFiles: {
          delete: { videoId_tagId: { videoId: +videoId, tagId: +tagId } },
        },
      },
      include: { _count: true },
    });

    if (result._count.videoFiles === 0) {
      const result = await prisma.tag.delete({ where: { id: +tagId } });
    }
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { POST };
