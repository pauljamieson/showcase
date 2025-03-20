import { Request, Response } from "express";
import {
  getTagByName,
  getVideoFiles,
  updateVideoFile,
} from "../../database/database";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (req.query.action === "new") {
      const files = await getVideoFiles({ where: { tags: { none: {} } } });
      const newTag = await getTagByName("New");
      if (!newTag) throw "New tag not found.";
      for await (const file of files) {
        const update = { tags: { create: { tagId: newTag.id } } };
        await updateVideoFile({ id: file.id, data: update });
      }
    }

    if (req.query.action === "remove") {
      const files = await prisma.videoFile.findMany({
        where: {
          tags: { none: { tag: { name: { notIn: ["New"] } } } },
          people: { none: {} },
        },
      });
      console.log(files.length);
    }

    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
