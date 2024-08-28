export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const body = {
      name: formData.get("person-name") as string,
      videoId: formData.get("video-id") as string,
    };

    const resp = await fetch(`http://localhost:5000/person/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    });
    const token = resp.headers.get("Authorization");
    if (!token) throw "JWT header is missing";
    localStorage.setItem("showcase", token.substring(7));
    return { status: "success" };
  } catch (error) {
    return { status: "failure" };
  }
};