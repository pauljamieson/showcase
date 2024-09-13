import apiRequest from "../lib/api";

export default async () => {
  try {
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/admin/incoming/",
    });

    if (status === "success") {
      return { status: "success", files: data.files };
    } else if (data.status === "failure") throw data.error;
  } catch (error: any) {
    return { status: "failure", files: [] };
  }
};
