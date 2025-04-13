import { Request, Response } from "express";
import {
  deleteVideoFileById,
  getTagByName,
  getVideoFiles,
  updateVideoFile,
} from "../../database/database";
import prisma from "../../lib/prisma";
import { VideoFile } from "@prisma/client";

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
      for await (const file of files) {
        await deleteVideoFileById(file.id);
        console.log(`Deleted file: ${file.id}`);
      }
      const totalSize = files.reduce((acc, file) => acc + Number(file.size), 0);
      console.log(`files: ${files.length}, totalSize: ${sizeOfFiles(files)} `);
    }

    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

function sizeOfFiles(files: VideoFile[]) {
  const total = files.reduce((acc, file) => acc + Number(file.size), 0);
  if (total < 1024) return `${total} bytes`;
  if (total < Math.pow(1024, 2)) return `${(total / 1024).toFixed(2)} KB`;
  if (total < Math.pow(1024, 3))
    return `${(total / Math.pow(1024, 2)).toFixed(2)} MB`;
  if (total < Math.pow(1024, 4))
    return `${(total / Math.pow(1024, 3)).toFixed(2)} GB`;
  return `${(total / Math.pow(1024, 4)).toFixed(2)} TB`;
}
export default { GET };
