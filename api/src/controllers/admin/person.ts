import { Request, Response } from "express";
import {
  deletePersonById,
  migratePersonById,
  updatePersonById,
} from "../../database/database";

type RequestBody = {
  intent: string;
  id: string;
  name: string;
  migrateId: string;
  newName: string;
};

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { intent, id, migrateId, newName }: RequestBody = req.body;
    switch (intent) {
      case "Delete":
        await deletePersonById(+id);
        break;
      case "Migrate":
        if (!migrateId) throw "Migrate ID not provided.";
        await migratePersonById(+id, +migrateId);
        break;
      case "Edit":
        if (!newName) throw "New name not given.";
        const n = capitalize(newName);
        const query = { where: { id: +id }, data: { name: n } };
        await updatePersonById(query);
        break;
      default:
        break;
    }

    res.json({ status: "success" });
  } catch (error: any) {
    console.error(error);
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
