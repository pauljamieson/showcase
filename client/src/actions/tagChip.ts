export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const body = {
      tagId: formData.get("tagId") as string,
      videoId: formData.get("videoId") as string,
    };

    const resp = await fetch(`http://localhost:5000/tag/chip`, {
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