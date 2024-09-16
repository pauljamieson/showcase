import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  try {
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/tags/",
      searchParams: url.searchParams,
    });
    if (status === "success") return { tags: data.tags };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { tags: [] };
  }
};
