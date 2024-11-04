import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { getVideoFiles, getVideoFilesCount } from "../../database/database";
import { get } from "http";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in!.";
    const searchParams = new URLSearchParams(req.url.slice(1));
    const people = searchParams.getAll("people");
    const tags = searchParams.getAll("tags");
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 8;
    const search = searchParams.get("search") || "";
    const alpha = searchParams.get("alpha") || "";
    const order = searchParams.get("order") || "desc";
    const views = searchParams.get("views");
    const duration = searchParams.get("duration");
    const size = searchParams.get("size");

    const data = {
      skip: +page * +limit - +limit,
      take: +limit,
      include: {
        tags: { orderBy: { tag: { name: "asc" } } },
        people: { orderBy: { person: { name: "asc" } } },
        ratings: true,
      } as Prisma.VideoFileInclude,
      orderBy: [
        views ? { views: views as Prisma.SortOrder } : {},
        duration ? { duration: duration as Prisma.SortOrder } : {},
        size ? { size: size as Prisma.SortOrder } : {},
        alpha ? { filename: alpha as Prisma.SortOrder } : {},
        { createdAt: order as Prisma.SortOrder },
      ] as Prisma.VideoFileOrderByWithRelationInput,
      where: {
        AND: [
          tags.map((t) => {
            return { tags: { some: { tag: { name: t } } } };
          }),
          people.map((p) => {
            return { people: { some: { person: { name: p } } } };
          }),
          search.split(" ").map((word) => {
            return { filename: { contains: word, mode: "insensitive" } };
          }),
        ].flat(),
      } as Prisma.VideoFileWhereInput,
    };

    /*await prisma.videoFile.findMany({
      where: { AND: [{ tags: { some: { tag: { name: "new" } } } }] },
    });*/

    const files = await getVideoFiles(data);

    const ratedFiles = files.map((v) => {
      return {
        ...v,
        rating: Math.floor(
          (v.ratings ?? []).map((v) => v.rating).reduce((a, c) => a + c, 0) /
            (v.ratings ?? []).length || 0
        ),
      };
    });

    const countWhere = {
      AND: [
        tags.map((t) => {
          return { tags: { some: { tag: { name: t } } } };
        }),
        people.map((p) => {
          return { people: { some: { person: { name: p } } } };
        }),
        search.split(" ").map((word) => {
          return { filename: { contains: word, mode: "insensitive" } };
        }),
      ].flat(),
    } as Prisma.VideoFileWhereInput;

    const count = await getVideoFilesCount(countWhere);

    res.json({ status: "success", data: { files: ratedFiles, count } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
