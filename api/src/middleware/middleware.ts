import { RequestHandler, Request, Response, NextFunction } from "express";
import { readJwtToken } from "../lib/jwt";
const SECRET = process.env.SECRET || "This is not good enough";

export const middleWare: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.url.includes("thumbs")) return next();

  const token = req.get("authorization")?.slice(7) || "";
  if (token?.length < 5) {
    res.locals.isLogged = false;
    return next();
  }

  if (token) {
    try {
      const decypted = readJwtToken(token);
      res.locals.isLogged = true;
      res.locals.user = JSON.parse(decypted).sub;
      res.locals.isAdmin = JSON.parse(decypted).admin;
    } catch (error) {
      console.error(error);
    } finally {
      return next();
    }
  }
};
