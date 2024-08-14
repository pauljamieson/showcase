import { redirect, useFetcher } from "react-router-dom";

export default function Chip({
  name,
  id,
  videoId,
}: {
  name: string;
  id: number;
  videoId: number;
}) {
  const fetcher = useFetcher();
  function handleClick(e: any) {
    const apiUrl = new URL("http://localhost:5000/tag/chip");
    const body = { tagId: id, videoId };
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    })
      .then((resp) => resp.json())
      .then((data) => redirect("/videos"));
  }

  return (
    <fetcher.Form method="POST" action="/video/:id/tag/chip">
      <input type="submit" className="chip" value={name} />
      <input type="hidden" name="tagId" value={id} />
      <input type="hidden" name="videoId" value={videoId} />
    </fetcher.Form>
  );
}
