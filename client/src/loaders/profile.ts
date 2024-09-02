export default async () => {
  try {
    const apiUrl = new URL(`${import.meta.env.VITE_API_URL}/profile/`);
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

    if (result.status === "success")
      return { status: "success", profile: result.data.profile };
    throw "Failed to get profile from api.";
  } catch (error: any) {
    console.error(error);
    return { status: "failure", error };
  }
};
