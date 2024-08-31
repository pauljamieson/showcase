export default async () => {
  try {
    const apiUrl = new URL(`${process.env.REACT_APP_API_URL}/tags`);
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

    const { status, tags } = await resp.json();
    console.log(status, tags);
    if (status === "success") return { tags };
    throw "Failed to get files from api.";
  } catch (error: any) {
    console.log(error);
    return { files: [], count: 0 };
  }
};
