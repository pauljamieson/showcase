import {
  Playlist,
  Prisma,
  VideoFile,
  VideoRatings,
  Tag,
  Person,
} from "@prisma/client";
import prisma from "../lib/prisma";
import { create } from "domain";

/* PLAYLIST */

export async function getPlaylistsByUserId(id: number) {
  return await prisma.playlist.findMany({
    where: { userId: id },
  });
}

export async function getPlaylistById(id: number) {
  return await prisma.playlist.findFirst({
    where: { id: id },
    include: {
      playlistItems: {
        include: {
          video: {
            select: {
              duration: true,
              filename: true,
              filepath: true,
              id: true,
              views: true,
            },
          },
        },
      },
    },
  });
}

export async function getPlaylistsByUserIdWithVideoId(
  userId: number,
  videoId: number
) {
  return await prisma.playlist.findMany({
    where: { userId, playlistItems: { some: { videoId } } },
  });
}

interface GetPlaylistPanel {
  playlist?: number;
  position: number;
  take: number;
}

export async function getPlaylistPanel({
  playlist,
  position = 0,
  take = 10,
}: GetPlaylistPanel) {
  if (playlist) {
    const list = await prisma.playlist.findFirst({
      where: { id: playlist },
      select: { playlistItems: { select: { position: true, video: true } } },
    });
  } else {
    const count = await prisma.videoFile.count();
    let rand = count;
    const videos = [];
    let total = 0;
    while (total < take) {
      while (rand >= count - 10) {
        rand = Math.floor(Math.random() * count);
      }
      videos.push(rand);
      total += 1;
    }

    return await prisma.videoFile.findMany({
      select: {
        duration: true,
        filename: true,
        filepath: true,
        id: true,
        views: true,
      },
      take,
      skip: rand,
    });
  }
}

export async function deleteVideo(id: number) {
  // get all play lists
  const lists = await getFilePlaylists(id);
  // delete video for all play lists
  for await (let list of lists) await deletePlaylistItem(id, list.playlist.id);
  await prisma.videoFile.delete({ where: { id: id } });
  await deleteTagWithoutVideo();
  await deletePeopleWithoutVideo();
}

export async function getFilePlaylists(id: number): Promise<
  {
    playlist: { id: number };
    position: number;
  }[]
> {
  return await prisma.playlistItem.findMany({
    where: { videoId: id },
    select: {
      playlist: { select: { id: true } },
      position: true,
    },
  });
}

export async function deletePlaylistItem(
  videoId: number,
  playlistId: number
): Promise<{}> {
  const result = await prisma.playlistItem.delete({
    where: {
      videoId_playlistId: {
        videoId,
        playlistId,
      },
    },
    select: {
      playlistId: true,
      position: true,
    },
  });
  await fixPlaylistPositions(result.playlistId, result.position);
  return {};
}

export async function fixPlaylistPositions(id: number, position: number) {
  // get items that come in playlist after deleted item
  const items = await prisma.playlistItem.findMany({
    where: { playlistId: id, position: { gte: position } },
    orderBy: { position: "asc" },
  });

  // decrement position by 1 to back fill positions
  for await (let item of items)
    await prisma.playlistItem.update({
      where: { id: item.id },
      data: { position: { decrement: 1 } },
    });
}

export async function createPlaylist(name: string, user: number) {
  return await prisma.playlist.create({
    data: {
      name: name,
      user: { connect: { id: user } },
    },
  });
}

export async function createPlaylistItem(playlistId: number, videoId: number) {
  //get last position in playlist
  const {
    _max: { position },
  } = await prisma.playlistItem.aggregate({
    where: { playlistId: playlistId },
    _max: { position: true },
  });

  // create new playlist item if not already in list
  return await prisma.playlistItem.upsert({
    where: { videoId_playlistId: { videoId, playlistId } },
    create: {
      playlistId: playlistId,
      videoId: videoId,
      position: position! + 1,
    },
    update: {},
  });
}
/* TAGS */

export async function getTagByName(name: string) {
  return await prisma.tag.findFirst({ where: { name: name } });
}

export async function getTagById(id: number) {
  return await prisma.tag.findFirst({ where: { id: id } });
}

export async function getTags() {
  return await prisma.tag.findMany();
}

export async function getTagsByVideoId(id: number) {
  return await prisma.tag.findMany({
    where: { videoFiles: { some: { id: id } } },
  });
}

export async function createTag(name: string, videoId: number, userId: number) {
  return await prisma.tag.upsert({
    where: { name: name },
    create: {
      name: name,
      creator: { connect: { id: userId } },
      videoFiles: { create: { videoId } },
    },
    update: { videoFiles: { create: { videoId } } },
  });
}

export async function deleteTagById(id: number) {
  return await prisma.tag.delete({ where: { id: id } });
}

export async function deleteTagByName(name: string) {
  return await prisma.tag.delete({ where: { name: name } });
}

export async function deleteTagWithoutVideo() {
  return await prisma.tag.deleteMany({
    where: { videoFiles: { none: {} } },
  });
}

export async function updateTagById(id: number, name: string) {
  return await prisma.tag.update({ where: { id }, data: { name } });
}

export async function getVideoFilesByTagId(id: number) {
  return await prisma.videoFile.findMany({
    where: { tags: { some: { tagId: id } } },
  });
}

export async function migrateTagById(id: number, migrateId: number) {
  // get all video files with tag
  const videoFiles = await getVideoFilesByTagId(id);
  // create new connections
  await Promise.allSettled(
    videoFiles.map((v) => {
      return prisma.videoTag.upsert({
        where: { videoId_tagId: { videoId: v.id, tagId: migrateId } },
        create: { videoId: v.id, tagId: migrateId },
        update: { videoId: v.id, tagId: migrateId },
      });
    })
  );
  // delete old tag
  await deleteTagById(id);
}

/* People */

export async function getPersonByName(name: string) {
  return await prisma.person.findFirst({ where: { name: name } });
}

export async function getPersonById(id: number) {
  return await prisma.person.findFirst({ where: { id: id } });
}

export async function getPeople(query: {
  select?: Prisma.PersonSelect;
  where?: Prisma.PersonWhereInput;
  take?: number;
  skip?: number;
  orderBy?: { name: Prisma.SortOrder };
}) {
  return await prisma.person.findMany(query);
}

export async function deletePeopleWithoutVideo() {
  return await prisma.person.deleteMany({
    where: { videoFiles: { none: {} } },
  });
}

export async function migratePersonById(id: number, migrateId: number) {
  // get all video files with person
  const videoFiles = await getVideoFilesByPersonId(id);
  // create new connections
  await Promise.allSettled(
    videoFiles.map((v) => {
      return prisma.videoPerson.upsert({
        where: { videoId_personId: { videoId: v.id, personId: migrateId } },
        create: { videoId: v.id, personId: migrateId },
        update: { videoId: v.id, personId: migrateId },
      });
    })
  );
  // delete old person
  await deletePersonById(id);
}

export async function getVideoFilesByPersonId(id: number) {
  return await prisma.videoFile.findMany({
    where: { people: { some: { personId: id } } },
  });
}

export async function deletePersonById(id: number) {
  return await prisma.person.delete({ where: { id: id } });
}

export async function updatePersonById(query: {
  where: Prisma.PersonWhereUniqueInput;
  data: Prisma.PersonUpdateInput;
  include?: Prisma.PersonInclude;
  select?: Prisma.PersonSelect;
}): Promise<Person> {
  return await prisma.person.update(query);
}

export async function countPersonConnectionsById(id: number): Promise<number> {
  return await prisma.videoPerson.count({ where: { personId: id } });
}

export async function createPerson(
  name: string,
  videoId: number,
  userId: number
) {
  return await prisma.person.upsert({
    where: { name: name },
    create: {
      name: name,
      creator: { connect: { id: userId } },
      videoFiles: { create: { videoId } },
    },
    update: { videoFiles: { create: { videoId } } },
  });
}

/* Video File */

interface CreateVideoFile {
  filename: string;
  filepath: string;
  duration: number;
  width: number;
  height: number;
  videoCodec: string;
  audioCodec: string;
  size: number;
  userId?: number;
}

export async function createVideoFile({
  filename,
  filepath,
  duration,
  width,
  height,
  videoCodec,
  audioCodec,
  size,
  userId,
}: CreateVideoFile): Promise<VideoFile> {
  const { id } = await prisma.tag.upsert({
    where: { name: "New" },
    update: {},
    create: { name: "New", userId: userId ? userId : 1 },
  });
  return await prisma.videoFile.create({
    data: {
      filename: filename,
      filepath: filepath,
      duration: duration,
      width: width,
      height: height,
      videoCodec: videoCodec,
      audioCodec: audioCodec,
      size: size,
      tags: {
        connectOrCreate: {
          where: { videoId_tagId: { videoId: 0, tagId: id } },
          create: { tagId: id },
        },
      },
    },
  });
}

export async function getVideoFileById(id: number) {
  return await prisma.videoFile.findFirstOrThrow({
    where: { id: id },
    include: {
      tags: { include: { tag: true }, orderBy: { tag: { name: "asc" } } },
      people: {
        include: { person: true },
        orderBy: { person: { name: "asc" } },
      },
    },
  });
}

export async function getVideoRatingsByVideoId(id: number) {
  return await prisma.videoRatings.aggregate({
    where: { videoId: +id },
    _avg: { rating: true },
  });
}

export async function getVideoRatingByVideoIdAndUserId(
  videoId: number,
  userId: number
) {
  return await prisma.videoRatings.findFirst({
    where: { videoId: +videoId, userId: +userId },
  });
}

export async function getVideoFile(data: Prisma.VideoFileWhereInput) {
  return await prisma.videoFile.findFirst({ where: data });
}

interface GetVideoFiles {
  skip?: number;
  take?: number;
  include?: Prisma.VideoFileInclude;
  orderBy?: Prisma.VideoFileOrderByWithRelationInput;
  where?: Prisma.VideoFileWhereInput;
  select?: Prisma.VideoFileSelect;
}

interface GetVideoFileReturn extends VideoFile {
  ratings?: VideoRatings[];
  tags?: Tag[];
  people?: Person[];
}

export async function getVideoFiles({
  skip,
  take,
  include,
  orderBy,
  where,
}: GetVideoFiles): Promise<GetVideoFileReturn[]> {
  return await prisma.videoFile.findMany({
    skip,
    take,
    include,
    orderBy,
    where,
  });
}

export async function getVideoFilesCount(where: Prisma.VideoFileWhereInput) {
  return await prisma.videoFile.count({ where });
}

export async function updateVideoFile({
  id,
  data,
}: {
  id: number;
  data: Prisma.VideoFileUpdateInput;
}) {
  return await prisma.videoFile.update({
    where: { id },
    data: data,
  });
}

export async function deleteVideoFileById(id: number) {
  // delete all playlist entries
  // delete video file
}

/* Video Ratings */

export async function updateVideoRating({
  videoId,
  userId,
  rating,
}: {
  videoId: number;
  userId: number;
  rating: number;
}) {
  return await prisma.videoRatings.upsert({
    where: { videoId_userId: { videoId, userId } },
    create: { videoId, userId, rating },
    update: { rating },
  });
}

/* Incoming File */

export async function deleteIncomingFileById(id: number) {
  return await prisma.incomingFile.delete({ where: { id: id } });
}

export async function createIncomingFile({
  folder,
  filename,
  userId,
}: {
  folder: string;
  filename: string;
  userId: number;
}) {
  await prisma.incomingFile.create({
    data: {
      filename: `./app_data/processing/${folder}/${filename}`,
      user: { connect: { id: userId } },
    },
  });
}

export async function getIncomingFiles() {
  return await prisma.incomingFile.findMany({
    orderBy: { filename: "asc" },
  });
}

/* User */

export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email: email } });
}

export async function getUserById(id: number) {
  return await prisma.user.findFirst({ where: { id: id } });
}

export async function createUser({
  email,
  password,
  displayname,
}: {
  email: string;
  password: string;
  displayname: string;
}) {
  return await prisma.user.create({
    data: {
      email: email,
      password: password,
      displayname: displayname,
    },
  });
}

/* Coverting Video */

export async function createConvertVideo(id: number) {
  return await prisma.convertVideo.create({
    data: {
      videoFileId: id,
    },
  });
}

export async function getConvertVideos(query: {
  select?: Prisma.ConvertVideoSelect;
  where?: Prisma.ConvertVideoWhereInput;
  take?: number;
  skip?: number;
  orderBy?: Prisma.ConvertVideoOrderByWithRelationInput;
}) {
  return await prisma.convertVideo.findMany();
}

export async function deleteConvertVideoById(id: number) {
  return await prisma.convertVideo.delete({ where: { id: id } });
}

/* Configuration */

export async function getConfig() {
  return await prisma.configuration.findMany();
}


export async function _getConfiguration(key: string) {
  return await prisma.configuration.findFirst({ where: { key: key } });
}

export async function updateCongfiguration(key: string, value: string) {
  return await prisma.configuration.upsert({
    where: { key: key },
    create: { key: key, value: value },
    update: { value: value },
  });
}

export async function getAllowSignup() {
  return await _getConfiguration("allow_signup");
}

