import React, { useEffect, useState, useRef } from "react";
import {
  useFetcher,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import apiRequest from "../lib/api";
import { useToast } from "../hooks/useToast";

type Person = { id: number; name: string };

export default function PersonModal() {
  const { showToast } = useToast();
  const [searchParams, _] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const fetcher = useFetcher();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);

  useEffect(() => {
    if (input.length > 0) {
      const sp = new URLSearchParams();
      sp.set("terms", input.trim());
      apiRequest({ method: "get", endpoint: "/people", searchParams: sp }).then(
        (resp) => {
          resp.status === "success" && setOptions(resp.data.people);
        }
      );
    }
  }, [input]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  useEffect(() => {
    searchParams.has("modal", "people") ? setOpen(true) : setOpen(false);
  }, [searchParams]);

  useEffect(() => {
    if (fetcher.data?.status === "success") {
      showToast({
        message: `${input} name added successfully.`,
        type: "success",
        duration: 1500,
      });
    } else if (fetcher.data?.status === "failure") {
      showToast({
        message: `${input} name failed to save.`,
        type: "error",
        duration: 1500,
      });
    }
  }, [fetcher.data]);

  function handleClick(e: any) {
    e.preventDefault();
    setOptions([]);
    setInput("");
    searchParams.delete("modal");
    navigate(location.pathname, { replace: true });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
    if (value.length === 0) setOptions([]);
  }

  return (
    <>
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
