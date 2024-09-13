import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const body = {
      tagId: formData.get("tagId") as string,
      videoId: formData.get("videoId") as string,
    };
    
    const { status } = await apiRequest({
      method: "post",
      endpoint: "/tag/chip/",
      body,
    });

    return { status };
  } catch (error) {
    return { status: "failure" };
  }
};
