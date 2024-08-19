import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

async function GET(req: Request, res: Response) {
  try {
    const searchParams = new URLSearchParams(req.url.slice(1));
    const people = searchParams.getAll("people");
    const tags = searchParams.getAll("tags");
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 8;
    const search = searchParams.get("search") || "";
    const order = searchParams.get("order") || "desc";
    const views = searchParams.get("views");
    const duration = searchParams.get("duration");

    const x = [
      tags.map((t) => {
        return { tags: { some: { name: t } } };
      }),
      people.map((p) => {
        return { people: { some: { name: p } } };
      }),
      search.split(" ").map((word) => {
        return { filename: { contains: word, mode: "insensitive" } };
      }),
    ].flat() as Prisma.VideoFileWhereInput[];

    const files = await prisma.videoFile.findMany({
      skip: +page * +limit - +limit,
      take: +limit,

      orderBy: [
        views ? { views: views as Prisma.SortOrder } : {},
        duration ? { duration: duration as Prisma.SortOrder } : {},
        { id: order as Prisma.SortOrder },
      ],

      where: {
        AND: [
          tags.map((t) => {
            return { tags: { some: { name: t } } };
          }),
          people.map((p) => {
            return { people: { some: { name: p } } };
          }),
          search.split(" ").map((word) => {
            return { filename: { contains: word, mode: "insensitive" } };
          }),
        ].flat() as Prisma.VideoFileWhereInput[],
      },
    });

    const count = await prisma.videoFile.count({
      where: {
        AND: [
          tags.map((t) => {
            return { tags: { some: { name: t } } };
          }),
          people.map((p) => {
            return { people: { some: { name: p } } };
          }),
          search.split(" ").map((word) => {
            return { filename: { contains: word, mode: "insensitive" } };
          }),
        ].flat() as Prisma.VideoFileWhereInput[],
      },
    });

    res.json({ status: "success", data: { files, count } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
