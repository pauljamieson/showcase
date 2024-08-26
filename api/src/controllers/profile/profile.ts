import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const profile = await prisma.user.findFirst({
      where: { id: +res.locals.user },
      select:{
        displayname: true,
        id:true,
        role:true,
        createdAt:true,
      }
    });
 
    res.json({ status: "success", data: { profile } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function PATCH(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { update, id }: { update: string; id: string } = req.body;
    let data = {};
    if (update === "views") data = { views: { increment: 1 } };

    await prisma.videoFile.update({
      where: { id: parseInt(id) },
      data: data,
    });

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, PATCH };
