import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const terms = req.query.terms as string;
    const result = await prisma.person.findMany({
      select: { id: true, name: true },
      where: {
        AND: terms.split(" ").map((word) => {
          return { name: { contains: word, mode: "insensitive" } };
        }),
      },
    });
    res.json({ status: "success", people: result });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
