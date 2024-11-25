import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/admin/configuration/",
      searchParams: url.searchParams,
    });
    if (status === "success") return { data };
    throw "Failed request to api.";
  } catch (error: any) {
    console.error(error);
    return { tags: [] };
  }
};
