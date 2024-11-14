import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const videoId = req.params.videoId;
    const personId = req.params.personId;

    await prisma.person.update({
      where: { id: +personId },
      data: { videoFiles: { create: { videoId: +videoId } } },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
