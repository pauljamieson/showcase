import { buildJwtToken } from "../../lib/jwt";
import prisma from "../../lib/prisma";
import { compare } from "bcrypt";
import { Request, Response } from "express";

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
      `Bearer ${buildJwtToken(
        String(user.id),
        user.displayname || "noname",
        604800,
        user.role === "ADMIN"
      )}`
    );
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failure", error });
  }
}

export default { POST };
