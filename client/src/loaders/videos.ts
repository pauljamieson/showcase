export default async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    //const limit = url.searchParams.get("limit") || "8";
    const apiUrl = new URL(`${import.meta.env.VITE_API_URL}/videos`);
    url.searchParams.forEach((v, k) => apiUrl.searchParams.append(k, v));
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
    const { status, data } = await resp.json();
    if (status === "success") return { files: data.files, count: data.count };
    throw "Failed to get files from api.";
  } catch (error: any) {
    console.error(error);
    return { files: [], count: 0 };
  }
};
