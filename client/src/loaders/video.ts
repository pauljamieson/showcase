import { Params } from "react-router-dom";

export default async ({ params }: { params: Params<"id"> }) => {
  try {
    const apiUrl = new URL(`http://localhost:5000/video/${params.id}`);
    const resp = await fetch(apiUrl, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    });
    const result = await resp.json();

    if (result.status === "success") return { video: result.data.video };
    throw "Failed to get video from api.";
  } catch (error: any) {
    console.log(error);
    return { error };
  }
};
