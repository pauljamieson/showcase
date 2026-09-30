import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    intent: formData.get("intent") as string,
    id: formData.get("id") as string,
  };

  try {
    const { status, data, error } = await apiRequest({
      endpoint: `/playlist/${body.id}`,
      method: "get",
    });

    let fileData: string[] = ["#EXTM3U"];
    for (const item of data.playlist.playlistItems) {
      fileData.push(`#EXTINF:${item.video.duration},${item.video.filename}`);
      fileData.push(
        `file:///S:\\app_data\\showcase\\videos\\${Math.floor(item.video.id / 1000)}\\${item.video.id % 1000}\\${item.video.filename}`,
      );
    }

    return { status, data: fileData.join("\n"), error };
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
