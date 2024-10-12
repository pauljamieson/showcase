import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;
    const playlistName = formData.get("playlist-name") as string;
    const videoId = formData.get("video-id") as string;
    const lists = formData.getAll("list-item") as string[];

    let body = { intent, videoId };

    if (intent === "create") {
      if (playlistName.length === 0) throw "No playlist name specified.";
      body = { ...{ name: playlistName }, ...body };
    }
    if (intent === "add") {
      body = { ...{ lists }, ...body };
    }

    const { status, data } = await apiRequest({
      method: "post",
      endpoint: `/video/${videoId}/playlist`,
      body,
    });

    return { status, data };
  } catch (error) {
    return { status: "failure" };
  }
};
