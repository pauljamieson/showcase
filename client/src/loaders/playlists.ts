import apiRequest from "../lib/api";

export default async () => {
  try {
    const { status, data, error } = await apiRequest({
      method: "get",
      endpoint: "/playlists/",
    });

    if (status === "success") return { status, data, error };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
