import { useFetcher } from "react-router-dom";

export default function TagChip({
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
    <fetcher.Form method="POST" action="/video/:id/tag/chip">
      <input type="submit" className="chip" value={name} />
      <input type="hidden" name="tagId" value={id} />
      <input type="hidden" name="videoId" value={videoId} />
    </fetcher.Form>
  );
}
