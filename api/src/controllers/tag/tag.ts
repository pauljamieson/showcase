import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { deleteTagById } from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { name, videoId }: { name: string; videoId: string } = req.body;

    if (name === null) return res.json({ status: "failure", message: "Name is required." });
    if (videoId === null) return res.json({ status: "failure",  message: "Video ID is required." });

    const tag = await prisma.tag.upsert({
      where: { name: name },
      create: {
        name: name,
        creator: { connect: { id: +res.locals.user } },
        videoFiles: { create: { videoId: +videoId } },
      },
      update: { videoFiles: { create: { videoId: +videoId } } },
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function DELETE(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { id }: { id: string } = req.body;
    if (id === null) return res.json({ status: "failure" });
    await deleteTagById(+id)
  
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { POST, DELETE };
