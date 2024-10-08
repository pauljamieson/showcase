import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../../lib/prisma";
import { hash } from "bcrypt";
import { Request, Response } from "express";

const SALT_ROUNDS = 10;

function GET(req: Request, res: Response) {
  res.json({ status: "success" });
}

// create new account if valid
async function POST(req: Request, res: Response) {
  const { email, password, displayName } = req.body;
  try {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const result = await prisma.user.create({
      data: { email: email, password: passwordHash, displayname: displayName },
    });
    res.json({ status: "success" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") console.log("P2002");
      res.json({
        status: "failure",
        error: "Email or Display Name already taken.",
      });
    } else res.json({ status: "failure", error });
  }
}

export default { GET, POST };
