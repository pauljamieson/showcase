import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const page = +req.query.page! || 1;
    const limit = +req.query.limit! || 8;
    const files = await prisma.videoFile.findMany({
      skip: page * limit - limit,
      take: limit,
      include: { tags: true, people: true },
    });
    console.log(files);
    res.json({ status: "success", data: { files } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
