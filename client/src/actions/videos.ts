import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();

    const body = {
      videoId: formData.get("videoId") as string,
    };
    
    const { status } = await apiRequest({
      method: "delete",
      endpoint: `/v2/videos/`,
      body,
    });

    return { status };
  } catch (error) {
    return { status: "failure" };
  }
};
