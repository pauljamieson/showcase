import React, { useEffect, useState, useRef } from "react";
import { useFetcher, useParams } from "react-router-dom";

type Person = { id: number; name: string };

export default function PersonModal() {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);

  useEffect(() => {
    if (input.length > 0) {
      const apiUrl = new URL(`${import.meta.env.VITE_API_URL}/people`);
      apiUrl.searchParams.set("terms", input.trim());
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

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

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
          <div className="modal-container">
            <span>People</span>
            <fetcher.Form
              className="modal-form"
              method="POST"
              action="/video/:id/person"
            >
              <input
                className="search-input"
                type="text"
                list="people"
                name="person-name"
                value={input}
                onChange={handleChange}
                autoComplete="off"
                ref={ref}
              />
              <datalist id="people">
                {options.map((val) => (
                  <option>{val.name}</option>
                ))}
              </datalist>
              <input type="hidden" name="video-id" value={id} />
              <div className="btn-bar">
                <input className="btn" type="submit" value="Add" />
                <button
                  className="btn"
                  name="intent"
                  value="close"
                  onClick={handleClick}
                >
                  Close
                </button>
              </div>
            </fetcher.Form>
          </div>
        </dialog>
      </div>
    </>
  );
}
