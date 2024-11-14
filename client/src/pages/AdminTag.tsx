import { useEffect, useRef, useState } from "react";
import { useLoaderData, useSearchParams, Form } from "react-router-dom";
import apiRequest from "../lib/api";
import { v4 as UUID } from "uuid";

type LoaderData = {
  status: string;
  tags: [
    {
      id: number;
      name: string;
      userId: number;
      creator: { displayname: string };
    }
  ];
};

export default function AdminTag() {
  const [input, setInput] = useState<string>("");
  const { tags } = useLoaderData() as LoaderData;
  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  // Debounce update search terms
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(undefined);
    }
    const TO = setTimeout(() => {
      searchParams.set("terms", input);
      setSearchParams(searchParams);
    }, 750);
    setTimer(TO);
  }, [input]);

  return (
    <>
      <div className="admin-search">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="search"
          placeholder="Search tags"
          className="search-input"
        />
      </div>
      {tags.length > 0 ? (
        tags.map((val) => <Row key={UUID()} {...val} />)
      ) : (
        <div className="flex-container-center">
          <p>No tags match.</p>
        </div>
      )}
      <EditDialog />
      <MigrationDialog />
    </>
  );
}

type Tag = {
  id: number;
  name: string;
};

function Row({
  id,
  name,
  creator: { displayname },
}: {
  id: number;
  name: string;
  userId: number;
  creator: { displayname: string };
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleOpenEditDialog() {
    searchParams.set("id", id.toString());
    searchParams.set("modal", "edit");
    setSearchParams(searchParams);
  }

  function handleOpenMigrateDialog() {
    searchParams.set("id", id.toString());
    searchParams.set("modal", "migrate");
    setSearchParams(searchParams);
  }

  return (
    <>
      <div className="edit-container">
        <div>
          <div>{name}</div>
          <div className="half-text">Creator: {displayname}</div>
        </div>
        <div className="grow" />

        <Form className="btn-bar" method="post">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="name" value={name} />
          <input className="btn" type="submit" name="intent" value="Delete" />
        </Form>
        <button className="btn" onClick={handleOpenEditDialog}>
          Edit
        </button>
        <button className="btn" onClick={handleOpenMigrateDialog}>
          Migrate
        </button>
      </div>
    </>
  );
}

function EditDialog() {
  const [input, setInput] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") || "";

  useEffect(() => {
    searchParams.has("modal", "edit")
      ? dialogRef.current?.showModal()
      : dialogRef.current?.close();
  }, [searchParams]);

  function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    searchParams.delete("modal");
    searchParams.delete("id");
    setSearchParams(searchParams);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInput(e.target.value);
  }

  return (
    <dialog className="edit-modal" ref={dialogRef}>
      <div>
        Edit
        <Form method="post">
          <input type="hidden" name="id" value={id} />

          <input
            className="search-input"
            type="text"
            name="newName"
            placeholder="New Name"
            value={input}
            onChange={handleChange}
          />
          <div className="btn-bar ">
            <button className="btn" type="submit" name="intent" value="Edit">
              Edit
            </button>
            <button className="btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </Form>
      </div>
    </dialog>
  );
}

function MigrationDialog() {
  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Tag[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") || "";

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    searchParams.has("modal", "migrate")
      ? dialogRef.current?.showModal()
      : dialogRef.current?.close();
  }, [searchParams]);

  // Debounce update search terms
  useEffect(() => {
    if (searchParams.has("modal", "migrate")) {
      if (timer) {
        clearTimeout(timer);
        setTimer(undefined);
      }
      const TO = setTimeout(() => {
        const searchParams = new URLSearchParams();
        searchParams.set("terms", input);
        apiRequest({ endpoint: "/tags/", method: "get", searchParams }).then(
          ({ status, data }) => {
            status === "success" && setOptions(data.tags);
          }
        );
      }, 750);
      setTimer(TO);

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [input]);

  function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    searchParams.delete("modal");
    searchParams.delete("id");
    setInput("");
    setOptions([]);
    setSearchParams(searchParams);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInput(e.target.value);
  }

  return (
    <dialog className="dialog" ref={dialogRef}>
      <div>
        Migrate
        <Form method="post">
          <input
            type="text"
            name="name"
            placeholder="Tag Name"
            value={input}
            onChange={handleChange}
            autoComplete="off"
            list="tags"
          />
          <datalist id="tags">
            {options.map((val) => (
              <option value={val.name} key={UUID()} />
            ))}
          </datalist>
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="migrateId"
            value={options.find((val) => val.name === input)?.id}
          />

          <div className="btn-bar">
            <button type="submit" className="btn" name="intent" value="Migrate">
              Migrate
            </button>
            <button type="button" className="btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </Form>
      </div>
    </dialog>
  );
}
