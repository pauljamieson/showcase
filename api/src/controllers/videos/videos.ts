import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { getVideoFiles, getVideoFilesCount } from "../../database/database";

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

async function POST(req: Request, res: Response) {
  try {
    const { terms, people, tags } = req.body;
    const data = {
      where: {
        AND: [
          tags.map((t: string) => {
            return { tags: { some: { tag: { name: t } } } };
          }),
          people.map((p: string) => {
            return { people: { some: { person: { name: p } } } };
          }),
          terms.split(" ").map((word: string) => {
            return { filename: { contains: word, mode: "insensitive" } };
          }),
        ].flat(),
      } as Prisma.VideoFileWhereInput,
    };
    const count: number = await getVideoFilesCount(data.where);
    const randomVideo = Math.floor(Math.random() * count + 1);
    const videoFiles = await getVideoFiles({
      where: data.where,
      skip: randomVideo,
      take: 1,
    });
    res.json({ status: "success", data: { id: videoFiles[0].id } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET, POST };
