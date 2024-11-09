import { useEffect, useRef, useState } from "react";
import { useLoaderData, useSearchParams, Form } from "react-router-dom";
import apiRequest from "../lib/api";
import { v4 as UUID } from "uuid";

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
          placeholder="Search people"
          className="search-input"
        />
      </div>
      {people.length > 0 ? (
        people.map((val) => <Row key={val.id} {...val} />)
      ) : (
        <div className="flex-container-center">
          <p>No names match.</p>
        </div>
      )}
    </>
  );
}

type Person = {
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
  const [migrateOpen, setMigrateOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  function handleClickMigrate() {
    setMigrateOpen((v) => !v);
  }

  function handleClickEdit() {
    setEditOpen((v) => !v);
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
        <button className="btn" onClick={handleClickEdit}>
          Edit
        </button>
        <button className="btn" onClick={handleClickMigrate}>
          Migrate
        </button>
      </div>
      {/* Edit dialog box */}
      <EditDialog
        id={id}
        name={name}
        open={editOpen}
        handleClose={handleClickEdit}
      />
      {/* Migrate dialog box */}
      <MigrationDialog
        id={id}
        name={name}
        open={migrateOpen}
        handleClose={handleClickMigrate}
      />
    </>
  );
}

function EditDialog({
  id,
  name,
  open,
  handleClose,
}: {
  id: number;
  name: string;
  open: boolean;
  handleClose: () => void;
}) {
  const editRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    open ? editRef.current?.showModal() : editRef.current?.close();
  }, [open]);

  return (
    <dialog className="edit-modal" ref={editRef}>
      <div>
        Edit
        <Form method="post">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="name" value={name} />

          <input
            className="search-input"
            type="text"
            name="newName"
            placeholder="New Name"
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

function MigrationDialog({
  id,
  name,
  open,
  handleClose,
}: {
  id: number;
  name: string;
  open: boolean;
  handleClose: () => void;
}) {
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);
  const migrateRef = useRef<HTMLDialogElement>(null);

  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);

  // Debounce update search terms
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(undefined);
    }

    const TO = setTimeout(() => {
      const searchParams = new URLSearchParams();
      searchParams.set("terms", input);
      apiRequest({ endpoint: "/people/", method: "get", searchParams }).then(
        ({ status, data }) => {
          status === "success" && setOptions(data.people);
        }
      );
    }, 750);
    setTimer(TO);
  }, [input]);

  useEffect(() => {
    open ? migrateRef.current?.showModal() : migrateRef.current?.close();
  }, [open]);

  return (
    <>
      {/* Migrate dialog box */}
      <dialog className="edit-modal" ref={migrateRef} open={false}>
        <div>
          Migrate
          <Form method="post">
            <input type="hidden" name="id" value={id} />
            <input
              type="hidden"
              name="migrateId"
              value={options.find((val) => val.name === input)?.id}
            />
            <input type="hidden" name="name" value={name} />
            <input
              className="search-input"
              type="text"
              list="people"
              name="migrateName"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <datalist id="people" key={UUID()}>
              {options.map((val) => (
                <option value={val.name} key={UUID()} />
              ))}
            </datalist>

            <div className="btn-bar ">
              <button
                className="btn"
                type="submit"
                name="intent"
                value="Migrate"
              >
                Migrate
              </button>
              <button
                className="btn"
                onClick={() => {
                  migrateRef.current!.close();
                  handleClose();
                }}
              >
                Close
              </button>
            </div>
          </Form>
        </div>
      </dialog>
    </>
  );
}
