import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const width = innerWidth;
    let limit = width >= 1440 ? 15 : width >= 960 ? 12 : width >= 780 ? 9 : 10;
    const url = new URL(request.url);
    url.searchParams.set("limit", limit.toString());

    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/v2/videos",
      searchParams: url.searchParams,
    });

    const { status: _, data: data2 } = await apiRequest({
      method: "get",
      endpoint: "/admin/configuration",
    });

    const maintenanceMode =
      data2.config.find(
        (c: { key: string; value: string }) => c.key === "maintenance_mode",
      ).value === "true"
        ? true
        : false;

    const showMetadata =
      data2.config.find(
        (c: { key: string; value: string }) => c.key === "show_metadata",
      ).value === "true"
        ? true
        : false;

    if (status === "success")
      return {
        files: data.files,
        count: data.count,
        maintenanceMode,
        showMetadata,
      };
    if (status === "failure") return { data };
  } catch (error: any) {
    return { status: "failure", data: { reason: "Unknown" , err: error } };
  }
};
