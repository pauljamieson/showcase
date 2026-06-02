import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const width = innerWidth;
    let limit = width >= 1440 ? 15 : width >= 960 ? 12 : width >= 780 ? 9 : 10;
    const url = new URL(request.url);
    url.searchParams.set("limit", limit.toString());
    
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/videos",
      searchParams: url.searchParams,
    });
    if (status === "success") return { files: data.files, count: data.count };
    if (status === "failure") return { data };
  } catch (error: any) {
    return { status: "failure", data: { reason: "Unknown" } };
  }
};
