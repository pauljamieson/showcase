export default async () => {
  try {
    const fetchData = await fetch(`${import.meta.env.VITE_API_URL}/admin/incoming/`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    });
    const token = fetchData.headers.get("Authorization");
    if (!token) throw "JWT header is missing";
    localStorage.setItem("showcase", token.substring(7));
    const data = await fetchData.json();

    if (data.status === "success") {
      const token = fetchData.headers.get("Authorization");
      if (!token) throw "JWT header is missing";
      localStorage.setItem("showcase", token.substring(7));
      return { status: "success", files: data.data.files };
    } else if (data.status === "failure") throw data.error;
  } catch (error: any) {
    return { status: "failure", files: [] };
  }
};
