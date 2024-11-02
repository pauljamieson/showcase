import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
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
