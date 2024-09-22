import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import person from "../person/person";

type RequestBody = {
  intent: string;
  id: string;
  name: string;
  migrateName: string;
  newName: string;
};

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { intent, id, name, migrateName, newName }: RequestBody = req.body;
    switch (intent) {
      case "Delete":
        await prisma.person.delete({ where: { id: +id } });
        break;
      case "Migrate":
        if (!migrateName) throw "Migrate ID not provided.";

        // get all the files with the original person name
        const videoFiles = await prisma.videoFile.findMany({
          select: { id: true },
          where: { people: { some: { id: +id } } },
        });

        // create new connections to migrate name
        await Promise.allSettled(
          videoFiles.map((v) => {
            if (migrateName) {
              const result = prisma.person.upsert({
                where: { name: migrateName },
                create: {
                  name: migrateName,
                  creator: { connect: { id: +res.locals.user } },
                  videoFiles: { connect: { id: +v.id } },
                },
                update: { videoFiles: { connect: { id: +v.id } } },
              });
              return result;
            }
          })
        );

        // remove the old person after migration
        const deleted = await prisma.person.delete({ where: { name: name } });
        break;
      case "Edit":
        if (!newName) throw "New name not given.";
        const n = capitalize(newName);
        const resp = await prisma.person.update({
          where: { id: +id },
          data: { name: n },
        });
        break;
      default:
        break;
    }

    res.json({ status: "success" });
  } catch (error: any) {
    console.log(error);
    if (error?.code === "P2002")
      return res.json({
        status: "failure",
        error: "Person name already in use.",
      });
    res.json({ status: "failure", error });
  }
}

export default { POST };

function capitalize(text: string) {
  return text
    .split(" ")
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(" ");
}
