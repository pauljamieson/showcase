import { NextFunction } from "express";
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET || "This is not good enough";

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.get("Authorization") || "";
  const decoded = jwt.verify(token, SECRET, {
    // Never forget to make this explicit to prevent
    // signature stripping attacks
    algorithms: ["HS256"],
  });
  //console.log(decoded);
  next();
}
