import { redirect } from "react-router-dom";

export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    const body =
      intent === "delete" || intent === "regen"
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

    const resp = await fetch(
      `${import.meta.env.VITE_API_URL}/video/${body.videoId}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("showcase"),
        },
      }
    );
    const token = resp.headers.get("Authorization");
    if (!token) throw "JWT header is missing";
    localStorage.setItem("showcase", token.substring(7));
    if (body.intent === "delete") return redirect("/");
    return { status: "success" };
  } catch (error) {
    return { status: "failure" };
  }
};
