import { Request, Response } from "express";
import prisma from "../../lib/prisma";

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
        where: {
          name: v,
        },
        create: {
          name: v,
          userId: 1,
        },
      };
    });

    const peopleList = (people ? people.split(",") : []).map((v: string) => {
      return {
        where: {
          name: v,
        },
        create: {
          name: v,
          userId: 1,
        },
      };
    });

    await prisma.videoFile.update({
      where: {
        id: file.id,
      },
      data: {
        views: +views,
        tags: {
          connectOrCreate: tagList,
        },
        people: {
          connectOrCreate: peopleList,
        },
      },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { POST };
