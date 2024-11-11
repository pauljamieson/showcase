import { Request, Response } from "express";
import {
  deleteTagById,
  migrateTagById,
  updateTagById,
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
    const { intent, id, name, migrateId, newName }: RequestBody = req.body;
    if (name && name.toLowerCase() === "new")
      throw "Can not modify default tags.";
    switch (intent) {
      case "Delete":
        await deleteTagById(+id);
        break;
      case "Migrate":
        if (!migrateId) throw "Migrate ID not provided.";
        // create new connections to migrate name
        await migrateTagById(+id, +migrateId);
        break;
      case "Edit":
        if (!newName) throw "New name not given.";
        const n = capitalize(newName);
        await updateTagById(+id, n);
        break;
      default:
        break;
    }

    res.json({ status: "success" });
  } catch (error: any) {
    console.log(error);
    if (error?.code === "P2002")
      return res.json({ status: "failure", error: "Tag name already in use." });
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
