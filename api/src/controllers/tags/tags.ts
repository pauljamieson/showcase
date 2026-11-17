import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";

    const terms = (req.query.terms as string) || "";
    const skip = req.query.page
      ? (parseInt(req.query.page as string) - 1) * 10
      : 0;
    const result = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        userId: true,
        creator: { select: { displayname: true } },
        _count: true,
      },
      where: {
        AND: terms.split(" ").map((word) => {
          return { name: { contains: word, mode: "insensitive" } };
        }),
      },
      take: 10,
      skip: skip,
      orderBy: {
        videoFiles: { _count: "desc" },
      },
    });
    const count = await prisma.tag.count({
      where: {
        AND: terms.split(" ").map((word) => {
          return { name: { contains: word, mode: "insensitive" } };
        }),
      },
    });
    res.json({ status: "success", data: { tags: result, count } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
