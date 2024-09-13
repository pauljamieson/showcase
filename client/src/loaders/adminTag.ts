import apiRequest from "../lib/api";

export default async () => {
  try {
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/tags/",
    });
    if (status === "success") return { tags: data.tags };
    throw "Failed to get files from api.";
  } catch (error: any) {
    console.error(error);
    return { files: [], count: 0 };
  }
};
