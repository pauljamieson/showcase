import apiRequest from "../lib/api";

export default async () => {
  try {
    const { status, data } = await apiRequest({
      method: "get",
      endpoint: "/profile/",
    });

    if (status === "success") return { status, profile: data.profile };
    throw "Failed to get profile from api.";
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
