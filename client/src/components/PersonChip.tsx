import { useFetcher } from "react-router-dom";

export default function PersonChip({
  name,
  id,
  videoId,
}: {
  name: string;
  id: number;
  videoId: number;
}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="POST" action="/video/:id/person/chip">
      <input type="submit" className="chip" value={name} />
      <input type="hidden" name="personId" value={id} />
      <input type="hidden" name="videoId" value={videoId} />
    </fetcher.Form>
  );
}
