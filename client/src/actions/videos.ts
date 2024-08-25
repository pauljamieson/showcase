export default async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = {
    intent: formData.get("intent") as string,
    videoId: formData.get("videoId") as string,
  };
  const resp = await fetch(`http://localhost:5000/video/${body.videoId}`, {
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
};
