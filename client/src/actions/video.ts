import { redirect } from "react-router-dom";
import apiRequest from "../lib/api";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    const body =
      intent === "delete" || intent === "regen" || intent === "convert"
        ? {
            intent,
            videoId: formData.get("videoId") as string,
          }
        : intent === "rating"
        ? {
            intent,
            videoId: formData.get("videoId") as string,
            rating: formData.get("rating") as string,
          }
        : { intent };

    const { status } = await apiRequest({
      method: "post",
      endpoint: "/video/${body.videoId}/",
      body,
    });

    
    console.log(status, intent);  
    
    return { status, intent };
  } catch (error) {
    localStorage.removeItem("showcase");
    return { status: "failure" };
  }
};
