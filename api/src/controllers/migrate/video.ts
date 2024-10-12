import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { rm } from "fs/promises";
import path from "path";

async function GET(req: Request, res: Response) {
  try {
    const minDuration = (req.query.min as string) || "1";
    const videos = await prisma.videoFile.findMany({
      where: { duration: { lte: +minDuration } },
    });

    videos.map(async ({ id }) => {
      const filePath = `./app_data/videos/${Math.floor(+id / 1000)}/${
        +id % 1000
      }`;
      await prisma.videoFile.delete({ where: { id: +id } });
      await rm(filePath, { recursive: true, force: true });
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
