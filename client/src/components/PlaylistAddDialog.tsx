import { useEffect, useState, useRef } from "react";
import { useFetcher, useSearchParams } from "react-router-dom";

interface p {
  videoId: number;
}

export default function PlaylistAddDialog({ videoId }: p) {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const ref = useRef<HTMLDialogElement>(null);


  // open and close model based on search params
  useEffect(() => {
    if (searchParams.get("modal") === "playlist") {
      fetcher.load(`/video/${videoId}/playlist`);
      ref.current?.showModal();
    } else ref.current?.close();
  }, [searchParams]);

  // delete modal search param on close
  function handleClick() {
    searchParams.delete("modal");
    setSearchParams(searchParams);
  }

  return (
    <dialog ref={ref} className="playlist-modal">
      <fetcher.Form action={`/video/${videoId}/playlist/`} method="POST">
        <div>
          {fetcher.data?.data?.playlists?.map(
            (playlist: { name: string; id: number }) => (
              <Checkbox
                key={playlist.id}
                {...playlist}
                checked={fetcher.data?.data?.inList.includes(playlist.id)}
              />
            )
          )}
        </div>
        <div className="create-input">
          <input type="text" name="playlist-name" />
          <input type="hidden" name="video-id" value={videoId} />
          <button
            className="btn"
            type="submit"
            name="intent"
            value="create"
            onClick={handleClick}
          >
            Create
          </button>
        </div>
        <div className="center-items">
          <button
            className="btn"
            type="submit"
            name="intent"
            value="add"
            onClick={handleClick}
          >
            Close
          </button>
        </div>
      </fetcher.Form>
    </dialog>
  );
}

function Checkbox({
  id,
  name,
  checked,
}: {
  id: number;
  name: string;
  checked: boolean;
}) {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  return (
    <div className="playlist-item">
      <input
        type="checkbox"
        name="list-item"
        value={id}
        checked={isChecked}
        onChange={() => setIsChecked((old) => !old)}
      />
      <p>
        {name} ({id})
      </p>
    </div>
  );
}
