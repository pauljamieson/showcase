import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

async function GET(req: Request, res: Response) {
  try {
    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || 8;
    const search = (req.query.search as string) || "";
    const order = (req.query.order as string) || "desc";
    const files = await prisma.videoFile.findMany({
      skip: page * limit - limit,
      take: limit,
      include: { tags: true, people: true },
      orderBy: { id: order as Prisma.SortOrder },
      where: {
        AND: search.split(" ").map((word) => {
          return { filename: { contains: word, mode: "insensitive" } };
        }),
      },
    });

    const count = await prisma.videoFile.count({
      where: {
        AND: search.split(" ").map((word) => {
          return { filename: { contains: word, mode: "insensitive" } };
        }),
      },
    });
    res.json({ status: "success", data: { files, count } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
