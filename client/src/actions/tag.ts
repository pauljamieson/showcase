import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const body = {
      name: (formData.get("tag-name") as string)
        .split(" ")
        .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
        .join(" ")
        .trim(),
      videoId: formData.get("video-id") as string,
    };

    const { status } = await apiRequest({
      method: "post",
      endpoint: "/tag/",
      body,
    });
    
    return { status };
  } catch (error) {
    return { status: "failure" };
  }
};
