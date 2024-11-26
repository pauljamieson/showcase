import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { createUser, getAllowSignup } from "../../database/database";

const SALT_ROUNDS = 10;

function GET(req: Request, res: Response) {
  res.json({ status: "success" });
}

// create new account if valid
async function POST(req: Request, res: Response) {
  const { email, password, displayName } = req.body;
  try {
    const allowSignups = await getAllowSignup();
    if (allowSignups?.value !== "true")
      return res.json({ status: "failure", error: "Signups are disabled." });
    const passwordHash = await hash(password, SALT_ROUNDS);
    await createUser({
      email,
      password: passwordHash,
      displayname: displayName,
    });
    res.json({ status: "success" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") console.error("P2002");
      res.json({
        status: "failure",
        error: "Email or Display Name already taken.",
      });
    } else res.json({ status: "failure", error });
  }
}

export default { GET, POST };
