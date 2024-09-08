import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import tag from "../tag/tag";
import { userInfo } from "os";
import { Prisma } from "@prisma/client";

async function POST(req: Request, res: Response) {
  const { filename, size, views, rating, tags, people } = req.body;

  try {
    const file = await prisma.videoFile.findFirst({
      where: {
        filename,
        size,
      },
    });
    if (!file) throw "File not found.";

    const tagList = (tags ? tags.split(",") : []).map((v: string) => {
      return {
        create: { name: v, userId: 1 },
        update: {},
        where: { name: v },
      };
    });
    1;
    const peopleList = (people ? people.split(",") : []).map((v: string) => {
      return {
        create: { name: v, userId: 1 },
        update: {},
        where: { name: v },
      };
    });

    await prisma.videoFile.update({
      where: {
        id: file.id,
      },
      data: {
        views: +views,
        rating: +rating,
      },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { POST };
