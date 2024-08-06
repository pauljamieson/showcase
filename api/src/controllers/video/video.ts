import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const video = await prisma.videoFile.findFirst({
      where: { id: parseInt(id) },
      include: { tags: true, people: true },
    });
    console.log(video);
    res.json({ status: "success", data: { video } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function PATCH(req: Request, res: Response) {
  const { update, id }: { update: string; id: string } = req.body;
  try {
    console.log("HERE", update, id);
    let data = {};
    if (update === "views") data = { views: { increment: 1 } };

    await prisma.videoFile.update({
      where: { id: parseInt(id) },
      data: data,
    });

    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, PATCH };
