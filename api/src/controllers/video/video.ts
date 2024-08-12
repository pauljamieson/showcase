import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { rm } from "fs/promises";
import Ffmpeg from "fluent-ffmpeg";
import path from "path";

async function GET(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const video = await prisma.videoFile.findFirst({
      where: { id: parseInt(id) },
      include: { tags: true, people: true },
    });

    res.json({ status: "success", data: { video } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function PATCH(req: Request, res: Response) {
  const { update, id }: { update: string; id: string } = req.body;
  try {
    let data = {};
    if (update === "views") data = { views: { increment: 1 } };

    await prisma.videoFile.update({
      where: { id: parseInt(id) },
      data: data,
    });

    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure", error });
  }
}

function createThumbs(videoId: number, outputPath: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileInfo = await prisma.videoFile.findFirst({
        where: { id: videoId },
      });
      for (let x = 0; x < 10; x++) {
        const time = Math.floor((Number(fileInfo!.duration) / 10) * x);
        try {
          Ffmpeg(fileInfo!.filename, { niceness: 15 })
            .screenshot({
              size: "640x?",
              count: 1,
              timemarks: [time],
              filename: `${path.basename(
                fileInfo!.filename,
                path.extname(fileInfo!.filename)
              )}-${x + 1}.jpg`,
              folder: outputPath,
            })
            .on("error", (error: any) =>
              console.log(`Encoding Error: ${error.message}`)
            )
            .on("end", () => resolve(true));
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}

async function POST(req: Request, res: Response) {
  const { intent, videoId }: { intent: string; videoId: string } = req.body;
  try {
    const filePath = `./app_data/videos/${Math.floor(+videoId / 1000)}/${
      +videoId % 1000
    }`;
    if (intent === "delete") {
      await rm(filePath, { recursive: true, force: true });
      await prisma.videoFile.delete({ where: { id: +videoId } });
    }
    if (intent === "regen") {
      await createThumbs(+videoId, `${filePath}/thumbs`);
    }

    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, PATCH, POST };
