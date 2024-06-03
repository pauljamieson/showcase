import { buildJwtToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "This is not good enough";

async function POST(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (user === null) throw "Invalid login\\password combination.";
    const isGoodPassword = await compare(password, user!.password);
    if (!isGoodPassword) throw "Invalid login\\password combination.";
    res.setHeader(
      "Authorization",
      `Bearer ${jwt.sign(
        { sub: user.id, admin: user.role === "ADMIN" },
        SECRET,
        { algorithm: "HS256", expiresIn: "1w" }
      )}`
    );
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failure", error });
  }
}

export { POST };
