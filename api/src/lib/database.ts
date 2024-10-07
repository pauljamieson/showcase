import prisma from "./prisma";

export async function deletePlaylistItem({
  playlistId,
  videoId,
}: {
  playlistId: number;
  videoId: number;
}) {
  //Delete playlist item
  const deltedResults = await prisma.playlistItem.delete({
    where: {
      videoId_playlistId: {
        playlistId,
        videoId,
      },
    },
  });

  //Get playlist items later in the playlist
  const findFirstResults = await prisma.playlist.findFirst({
    where: { id: playlistId },
    include: {
      playlistItems: {
        where: { position: { gt: deltedResults.position } },
        orderBy: { position: "asc" },
      },
    },
  });

  //Reduce position by 1 of playlist items later in playlist
  //Can not be done as updateMany because unique field
  for (const item of findFirstResults?.playlistItems!) {
    await prisma.playlistItem.update({
      where: { id: item.id },
      data: { position: { decrement: 1 } },
    });
  }

  //Count number of items in playlist
  const count = await prisma.playlistItem.aggregate({
    where: { playlistId: playlistId },
    _count: { playlistId: true },
  });

  //Delete playlist if empty
  if (count._count.playlistId == 0)
    await prisma.playlist.delete({ where: { id: playlistId } });
}
