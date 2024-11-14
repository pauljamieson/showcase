import { useEffect, useRef, useState } from "react";
import { useLoaderData, useSearchParams, Form } from "react-router-dom";
import { v4 as UUID } from "uuid";
import apiRequest from "../lib/api";

type LoaderData = {
  status: string;
  people: [
    {
      id: number;
      name: string;
      userId: number;
      creator: { displayname: string };
    }
  ];
};

export default function AdminPerson() {
  const { people } = useLoaderData() as LoaderData;
  const [input, setInput] = useState<string>("");
  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  // Debounce update search terms
  useEffect(() => {
    if (searchParams.has("modal", "migrate")) {
      if (timer) {
        clearTimeout(timer);
        setTimer(undefined);
      }
      const TO = setTimeout(() => {
        input.length > 0
          ? searchParams.set("terms", input)
          : searchParams.delete("terms");
        setSearchParams(searchParams);
      }, 750);
      setTimer(TO);
    }
  }, [input]);

  return (
    <>
      <div className="admin-search">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="search"
          placeholder="Search people"
          className="search-input"
        />
      </div>
      {people.length > 0 ? (
        people.map((val) => <Row key={UUID()} {...val} />)
      ) : (
        <div className="flex-container-center">
          <p>No names match.</p>
        </div>
      )}
      <MigrateDialog />
      <EditDialog />
    </>
  );
}

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
      <div className="edit-container" key={UUID()}>
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

interface Person {
  id: number;
  name: string;
}

function MigrateDialog({}: {}) {
  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);
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
        apiRequest({ endpoint: "/people/", method: "get", searchParams }).then(
          ({ status, data }) => {
            if (status === "success") setOptions(data.people);
            console.log(data);
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
    <dialog ref={dialogRef} className="dialog" key={id}>
      <span className="txt-lg">Migrate</span>
      <Form method="post">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={input}
          onChange={handleChange}
          autoComplete="off"
          list="people"
        />
        <datalist id="people">
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
    </dialog>
  );
}

function EditDialog() {
  // Debounce timer
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
    <dialog ref={dialogRef} className="dialog">
      <span className="txt-lg">Edit Name</span>
      <Form method="post">
        <input
          type="text"
          name="newName"
          placeholder="Name"
          value={input}
          onChange={handleChange}
          autoComplete="off"
        />
        <input type="hidden" name="id" value={id} />
        <div className="btn-bar">
          <button type="submit" className="btn" name="intent" value="Edit">
            Edit
          </button>
          <button type="button" className="btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </Form>
    </dialog>
  );
}
