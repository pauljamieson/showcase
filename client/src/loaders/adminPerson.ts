export default async () => {
  try {
    const apiUrl = new URL("http://localhost:5000/people");
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

    const { status, people } = await resp.json();
    console.log(status, people);
    if (status === "success") return { people };
    throw "Failed to get files from api.";
  } catch (error: any) {
    console.log(error);
    return { files: [], count: 0 };
  }
};
