import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  const result = await prisma.tag.findMany();
  console.log(result);
  res.json({ status: "success" });
}

export default { GET };
