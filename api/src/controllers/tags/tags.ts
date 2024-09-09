import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const terms = (req.query.terms as string) || "";
    const result = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        userId: true,
        creator: { select: { displayname: true } },
      },
      where: {
        AND: terms.split(" ").map((word) => {
          return { name: { contains: word, mode: "insensitive" } };
        }),
      },
      take: 10,
    });
    res.json({ status: "success", tags: result });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
