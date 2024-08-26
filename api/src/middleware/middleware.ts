import { RequestHandler, Request, Response, NextFunction } from "express";
import { buildJwtToken, readJwtToken } from "../lib/jwt";
const SECRET = process.env.SECRET || "This is not good enough";

type Payload = {
  sub: string;
  name: string;
  admin: boolean;
  exp: number;
  iat: number;
};

export const middleWare: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // matches for thumbs
  if (req.url.match(/[0-9]+\/[0-9]+\/thumbs/)) return next();

  // gets the route class
  const routeClass = getRouteClass(req.url);

  // Skip checks for public pages
  if (routeClass === "PUBLIC") return next();

  // Check for token on client
  const token = req.get("authorization")?.slice(7) || "";
  if (token?.length < 5) {
    res.locals.isLogged = false;
    return next();
  }

  if (token) {
    try {
      const decrypted: Payload = JSON.parse(readJwtToken(token));

      if (decrypted.exp < Date.now() / 1000) {
        throw "Expired Token.";
      }

      const newToken = buildJwtToken(
        decrypted.sub,
        decrypted.name,
        604800,
        decrypted.admin
      );
      res.setHeader("Authorization", `Bearer ${newToken}`);

      res.locals.isLogged = true;
      res.locals.user = decrypted.sub;
      res.locals.isAdmin = decrypted.admin;
      if (routeClass === "ADMIN" && !res.locals.isAdmin) throw "Not Admin";
    } catch (error) {
      console.error(error);
    } finally {
      return next();
    }
  }
};

type RouteClass = {
  path: string;
  type: "ADMIN" | "USER" | "PUBLIC" | "NOTFOUND";
};

const routes: RouteClass[] = [
  { path: "", type: "PUBLIC" },
  { path: "auth", type: "PUBLIC" },
  { path: "admin", type: "ADMIN" },
  { path: "tag", type: "USER" },
  { path: "tags", type: "USER" },
  { path: "person", type: "USER" },
  { path: "people", type: "USER" },
  { path: "video", type: "USER" },
  { path: "videos", type: "USER" },
];

function getRouteClass(url: string) {
  const route = routes.find((v) => v.path === url.split("/")[1]);
  if (route) return route.type;
  else return "NOTFOUND";
}
