import { Form, Navigate, useLoaderData } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useState, useEffect } from "react";
import apiRequest from "../lib/api";
import { Person, Tag } from "./Videos";

type LoaderData = {
  status: string;
  files: [string];
  error: string;
};

export default function Incoming() {
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();
  if (!isLoggedIn || !user?.admin) return <Navigate to="/" />;

  const data: LoaderData = useLoaderData() as LoaderData;

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("activeTags");
      sessionStorage.removeItem("activePeople");
    }
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const msg =
      e.currentTarget.value === "importall"
        ? "Importing all files."
        : "Importing selected files.";
    showToast({
      message: msg,
      type: "success",
      duration: 1500,
    });
  };

  return (
    <>
      <Form className="files-container" method="post">
        <div className="incoming-btn-container">
          <button
            type="submit"
            className="btn"
            name="intent"
            value="importall"
            onClick={handleSubmit}
          >
            Import All
          </button>
          <button
            type="submit"
            className="btn"
            name="intent"
            value="selected"
            onClick={handleSubmit}
          >
            Import Selected
          </button>
          <button
            type="button"
            className="btn"
            onClick={() =>
              (
                document.getElementById("modal-tag") as HTMLDialogElement
              )?.showModal()
            }
          >
            Add Tag to All
          </button>
          <button type="button" className="btn" onClick={() =>
            (
              document.getElementById("modal-person") as HTMLDialogElement
            )?.showModal()
          }>Add Person to All</button>
        </div>
        <input
          type="hidden"
          value={btoa(
            encodeURIComponent(JSON.stringify({ files: data?.files })),
          )}
          name="all"
        />
        {data?.files?.length > 0 && <div>Files : {data.files.length}</div>}
        <div className="file-names">
          {data?.files?.length > 0 ? (
            data?.files?.map((file) => (
              <label key={btoa(encodeURIComponent(file))}>
                <input type="checkbox" name={btoa(encodeURIComponent(file))} />
                {file.slice(file.indexOf("/incoming/") + "/incoming/".length)}
              </label>
            ))
          ) : (
            <div>No Files Found.</div>
          )}
        </div>

      </Form>
      <TagModal />
      <PersonModal />
    </>
  );
}

function TagModal() {

  const { showToast } = useToast();
  const [update, setUpdate] = useState(false);

  const [input, setInput] = useState("");
  const [options, setOptions] = useState([] as { id: number; name: string }[]);
  const [activeTags, setActiveTags] = useState(() => {
    const storedTags = sessionStorage.getItem("activeTags");
    return storedTags ? JSON.parse(storedTags) : [] as Tag[];
  });

  useEffect(() => {
    if (input.trim().length === 0) {
      setOptions([]);
      return;
    }
    if (!update) {
      setUpdate(true);
      const sp = new URLSearchParams();
      sp.set("terms", input.trim());
      apiRequest({ method: "get", endpoint: "/tags", searchParams: sp }).then(
        (resp) => {
          setUpdate(false);
          resp.status === "success" && setOptions(resp.data.tags);
        }
      );
    }

  }, [input]);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
    if (value.length === 0) setOptions([]);
  }

  function handleClose(e: any) {
    e.preventDefault();
    setOptions([]);
    setInput("");
    sessionStorage.setItem("activeTags", JSON.stringify(activeTags));
    (document.getElementById("modal-tag") as HTMLDialogElement)?.close();

  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagName = formData.get("tag-name") as string;
    if (tagName.trim().length === 0) {
      showToast({
        message: "Tag name cannot be empty.",
        type: "error",
        duration: 1500,
      });
      return;
    }
    const tag = options.find((t) => t.name === tagName);
    if (!tag) {
      showToast({
        message: "Please select a valid tag from the list.",
        type: "error",
        duration: 1500,
      });
      return;
    }
    if (activeTags.some((t: { id: number, name: string }) => t.id === tag.id)) {
      showToast({
        message: "Tag already added.",
        type: "error",
        duration: 1500,
      });
      return;
    }
    setActiveTags((prev: Tag[]) => [...prev, { id: tag.id, name: tag.name }]);

  }

  const handleRemoveTag = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const newArr = activeTags.filter((t: { id: number, name: string }) => t.id !== parseInt(e.currentTarget.id));
    setActiveTags(newArr);
  }

  return (
    <dialog id="modal-tag">
      <div className="modal-container">
        <span>Tags</span>
        <div className="active-tags">
          {activeTags.map((t: Tag, idx: number, arr: Tag[]) => (
            <span onClick={handleRemoveTag} key={t.id} id={t.id.toString()} className="active-tag">
              {t.name}{idx < arr.length - 1 && ","}
            </span>
          ))}
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            list="tags"
            name="tag-name"
            value={input}
            onChange={handleChange}
            autoComplete="off"
          />
          <datalist id="tags">
            {options.map((val) => (
              <option key={val.id}>{val.name}</option>
            ))}
          </datalist>
          <div className="btn-bar">
            <button className="btn" type="submit" value="Add" >Add</button>
            <button
              className="btn"
              name="intent"
              value="close"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}


function PersonModal() {

  const { showToast } = useToast();
  const [update, setUpdate] = useState(false);

  const [input, setInput] = useState("");
  const [options, setOptions] = useState([] as { id: number; name: string }[]);
  const [activePeople, setActivePeople] = useState(() => {
    const storedPeople = sessionStorage.getItem("activePeople");
    return storedPeople ? JSON.parse(storedPeople) : [] as Tag[];
  });

  useEffect(() => {
    if (input.trim().length === 0) {
      setOptions([]);
      return;
    }
    if (!update) {
      setUpdate(true);
      const sp = new URLSearchParams();
      sp.set("terms", input.trim());
      apiRequest({ method: "get", endpoint: "/people", searchParams: sp }).then(
        (resp) => {
          setUpdate(false);
          resp.status === "success" && setOptions(resp.data.people);
        }
      );
    }

  }, [input]);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
    if (value.length === 0) setOptions([]);
  }

  function handleClose(e: any) {
    e.preventDefault();
    setOptions([]);
    setInput("");
    sessionStorage.setItem("activePeople", JSON.stringify(activePeople));
    (document.getElementById("modal-person") as HTMLDialogElement)?.close();

  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const personName = formData.get("person-name") as string;
    if (personName.trim().length === 0) {
      showToast({
        message: "Person name cannot be empty.",
        type: "error",
        duration: 1500,
      });
      return;
    }
    const person = options.find((p) => p.name === personName);
    if (!person) {
      showToast({
        message: "Please select a valid person from the list.",
        type: "error",
        duration: 1500,
      });
      return;
    }
    if (activePeople.some((p: { id: number, name: string }) => p.id === person.id)) {
      showToast({
        message: "Person already added.",
        type: "error",
        duration: 1500,
      });
      return;
    }
    setActivePeople((prev: Person[]) => [...prev, { id: person.id, name: person.name }]);

  }

  const handleRemovePerson = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const newArr = activePeople.filter((p: Person) => p.id !== parseInt(e.currentTarget.id));
    setActivePeople(newArr);
  }

  return (
    <dialog id="modal-person">
      <div className="modal-container">
        <span>People</span>
        <div className="active-people">
          {activePeople.map((p: Person, idx: number, arr: Person[]) => (
            <span onClick={handleRemovePerson} key={p.id} id={p.id.toString()} className="active-person">
              {p.name}{idx < arr.length - 1 && ","}
            </span>
          ))}
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            list="people"
            name="person-name"
            value={input}
            onChange={handleChange}
            autoComplete="off"
          />
          <datalist id="people">
            {options.map((val) => (
              <option key={val.id}>{val.name}</option>
            ))}
          </datalist>
          <div className="btn-bar">
            <button className="btn" type="submit" value="Add" >Add</button>
            <button
              className="btn"
              name="intent"
              value="close"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
