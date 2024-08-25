import { Params } from "react-router-dom";

export default async ({ params }: { params: Params<"id"> }) => {
  try {
    const apiUrl = new URL(`http://localhost:5000/profile/`);
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

    if (result.status === "success") return { profile: result.data.profile };
    throw "Failed to get profile from api.";
  } catch (error: any) {
    console.log(error);
    return { error };
  }
};
