import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const body = {
      personId: formData.get("tag") as string,
      videoId: formData.get("videoId") as string,
    };

    const { status } = await apiRequest({
      method: "post",
      endpoint: "/person/chip/",
      body,
    });

    return { status };
  } catch (error) {
    return { status: "failure" };
  }
};
