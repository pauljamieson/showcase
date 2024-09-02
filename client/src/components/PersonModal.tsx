import React, { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router-dom";

type Person = { id: number; name: string };

export default function PersonModal() {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [open, setOpen] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);

  useEffect(() => {
    if (input.length > 0) {
      const apiUrl = new URL(`${import.meta.env.VITE_API_URL}/people`);
      apiUrl.searchParams.set("terms", input);
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("showcase"),
        },
      })
        .then((resp) => resp.json())
        .then((data) => setOptions(data.people));
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
      <div className="centerpoint">
        <dialog className="modal" open={open}>
          <p>People</p>
          <fetcher.Form method="POST" action="/video/:id/person">
            <input
              type="text"
              list="people"
              name="person-name"
              value={input}
              onChange={handleChange}
              autoComplete="off"
            />
            <datalist id="people">
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
      </div>
    </>
  );
}
