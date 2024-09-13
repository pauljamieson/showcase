import apiRequest from "../lib/api";

export default async () => {
  try {
    const sp = new URLSearchParams();

    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/people",
      searchParams: sp,
    });

    if (status === "success") return { people: data.people };
    
    throw "Failed to get files from api.";
  } catch (error: any) {
    console.error(error);
    return { files: [], count: 0 };
  }
};
