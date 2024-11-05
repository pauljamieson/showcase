import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const videoId = req.params.videoId;
    const personId = req.params.personId;

    console.log(videoId, personId);

    await prisma.videoFile.update({
      where: { id: +videoId },
      data: { people: { connect: { id: +personId } } },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
