import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  const terms = req.query.terms as string;
  const result = await prisma.tag.findMany({
    select: { id: true, name: true },
    where: {
      AND: terms.split(" ").map((word) => {
        return { name: { contains: word, mode: "insensitive" } };
      }),
    },
  });
  res.json({ status: "success", tags: result });
}

export default { GET };
