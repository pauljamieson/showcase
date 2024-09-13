import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { rm } from "fs/promises";
import Ffmpeg from "fluent-ffmpeg";
import path from "path";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
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
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { update, id }: { update: string; id: string } = req.body;
    let data = {};
    if (update === "views") data = { views: { increment: 1 } };

    await prisma.videoFile.update({
      where: { id: +id },
      data: data,
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
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
              console.error(`Encoding Error: ${error.message}`)
            )
            .on("end", () => resolve(true));
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";

    const {
      intent,
      videoId,
      rating,
    }: { intent: string; videoId: string; rating: string } = req.body;
    const filePath = `./app_data/videos/${Math.floor(+videoId / 1000)}/${
      +videoId % 1000
    }`;
    if (intent === "delete") {
      if (!res.locals.isAdmin) throw "Not authorized to take this action.";
      await rm(filePath, { recursive: true, force: true });
      await prisma.videoFile.delete({ where: { id: +videoId } });
      // TODO on delete remove tags\persons that dont have other matches
    }
    if (intent === "regen") {
      if (!res.locals.isAdmin) throw "Not authorized to take this action.";
      await createThumbs(+videoId, `${filePath}/thumbs`);
    }

    if (intent === "rating") {
      await prisma.videoFile.update({
        where: { id: +videoId },
        data: { rating: +rating },
      });
    }

    if (!intent) throw "No intent made.";
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, PATCH, POST };
