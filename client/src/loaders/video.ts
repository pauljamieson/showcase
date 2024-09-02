import { Params } from "react-router-dom";

export default async ({ params }: { params: Params<"id"> }) => {
  try {
    const apiUrl = new URL(`${import.meta.env.VITE_API_URL}/video/${params.id}`);
    const resp = await fetch(apiUrl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    });
    const token = resp.headers.get("Authorization");
    if (!token) throw "JWT header is missing";
    localStorage.setItem("showcase", token.substring(7));
    const result = await resp.json();

    if (result.status === "success") return { video: result.data.video };
    throw "Failed to get video from api.";
  } catch (error: any) {
    console.error(error);
    return { error };
  }
};
