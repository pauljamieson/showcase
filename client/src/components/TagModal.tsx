import { useEffect, useState, useRef } from "react";
import { useFetcher, useParams } from "react-router-dom";

export default function TagModal() {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  function handleClick(e: any) {
    e.preventDefault();
    const { value } = e.target;
    if (inputRef.current) inputRef.current.value = "";
    setOpen(value === "open" ? true : false);
  }

  return (
    <>
      <button name="intent" value="open" onClick={handleClick}>
        Tags
      </button>
      <dialog className="modal" open={open}>
        <p>TAGS</p>
        <fetcher.Form method="POST" action="/video/:id/tag">
          <input ref={inputRef} type="text" name="tag-name" />
          <input type="hidden" name="video-id" value={id} />
          <input type="submit" value="Add" />
          <button name="intent" value="close" onClick={handleClick}>
            Close
          </button>
        </fetcher.Form>
      </dialog>
    </>
  );
}
