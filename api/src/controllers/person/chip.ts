import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { personId, videoId }: { personId: string; videoId: string } = req.body;

    const result = await prisma.person.update({
      where: { id: +personId },
      data: { videoFiles: { disconnect: { id: +videoId } } },
      include: { _count: true },
    });

    if (result._count.videoFiles === 0) {
      const result = await prisma.person.delete({ where: { id: +personId } });
    }
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure" });
  }
}

export default { POST };
