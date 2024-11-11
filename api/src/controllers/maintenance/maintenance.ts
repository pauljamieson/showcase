import { Request, Response } from "express";

import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (req.query.action === "new") {
      const res = await prisma.videoFile.findMany({
        where: { tags: { none: {} } },
      });
      const newTag = await prisma.tag.findFirst({ where: { name: "New" } });
      if (!newTag) throw "New tag not found.";
      for await (const file of res) {
        await prisma.videoFile.update({
          where: { id: file.id },
          data: { tags: { create: { tagId: newTag.id } } },
        });
      }
    }
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET };
