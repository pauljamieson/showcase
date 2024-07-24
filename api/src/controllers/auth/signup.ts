import prisma from "../../lib/prisma";
import { hash } from "bcrypt";
import { Request, Response } from "express";

const SALT_ROUNDS = 10;

function GET(req: Request, res: Response) {
  res.json({ status: "success" });
}

// create new account if valid
async function POST(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const result = await prisma.user.create({
      data: { email: email, password: passwordHash },
    });
    res.json({ status: "success" });
  } catch (error) {
    
    res.json({ status: "failure", error });
  }
}

export default { GET, POST };
