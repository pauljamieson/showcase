import { Request, Response } from "express";
import { getPeople } from "../../database/database";
import { Prisma } from "@prisma/client";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const terms = (req.query.terms as string) || "";
    const query = {
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
      } as Prisma.PersonWhereInput,
      take: 10,
      orderBy: {
        name: Prisma.SortOrder.asc,
      },
    };

    const result = await getPeople(query);

    res.json({ status: "success", data: { people: result } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
