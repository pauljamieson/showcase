import React, { useEffect, useState, useRef } from "react";
import { useFetcher, useParams } from "react-router-dom";

type Tag = { id: number; name: string };

export default function TagModal() {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [open, setOpen] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Tag[]>([]);

  useEffect(() => {
    if (input.length > 0) {
      const apiUrl = new URL("http://localhost:5000/tags");
      apiUrl.searchParams.set("terms", input);
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("showcase"),
        },
      })
        .then((resp) => resp.json())
        .then((data) => setOptions(data.tags));
    }
  }, [input]);

  function handleClick(e: any) {
    e.preventDefault();
    const { value } = e.target;
    if (open === false && value === "open") {
      setOptions([]);
      setInput("");
    }
    setOpen(value === "open" ? true : false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
    if (value.length === 0) setOptions([]);
  }

  return (
    <>
      <button className="btn" name="intent" value="open" onClick={handleClick}>
        +
      </button>

      <dialog className="modal" open={open}>
        <p>TAGS</p>
        <fetcher.Form method="POST" action="/video/:id/tag">
          <input
            type="text"
            list="tags"
            name="tag-name"
            value={input}
            onChange={handleChange}
            autoComplete="off"
          />
          <datalist id="tags">
            {options.map((val) => (
              <option>{val.name}</option>
            ))}
          </datalist>
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
