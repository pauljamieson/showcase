import { useEffect, useRef, useState } from "react";
import { useLoaderData, Form, useSearchParams } from "react-router-dom";
import apiRequest from "../lib/api";

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
        tags.map((val) => <Row key={val.id} {...val} />)
      ) : (
        <div className="flex-container-center">
          <p>No tags match.</p>
        </div>
      )}
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
  const [open, setOpen] = useState<boolean>(false);
  const editRef = useRef<HTMLDialogElement | null>(null);

  function closeMigrateDialog() {
    setOpen(false);
  }

  function handleClick() {
    setOpen(true);
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
        <button className="btn" onClick={() => editRef.current!.showModal()}>
          Edit
        </button>
        <button className="btn" onClick={handleClick}>
          Migrate
        </button>
      </div>
      {/* Edit dialog box */}
      <dialog className="edit-modal" ref={editRef}>
        <div>
          Edit
          <Form method="post">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="name" value={name} />

            <input type="text" name="newName" placeholder="New Name" />
            <div className="btn-bar ">
              <button className="btn" type="submit" name="intent" value="Edit">
                Edit
              </button>
              <button className="btn" onClick={() => editRef.current!.close()}>
                Close
              </button>
            </div>
          </Form>
        </div>
      </dialog>
      {/* Migrate dialog box */}
      <MigrationDialog
        id={id}
        name={name}
        open={open}
        handleClose={closeMigrateDialog}
      />
    </>
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
  const [options, setOptions] = useState<Tag[]>([]);
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
      apiRequest({ endpoint: "/tags/", method: "get", searchParams }).then(
        ({ status, data }) => {
          status === "success" && setOptions(data.tags);
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
            <input type="hidden" name="name" value={name} />
            <input
              className="search-input"
              type="text"
              list="tags"
              name="migrateName"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <datalist id="tags">
              {options.map((val) => (
                <option value={val.name} key={val.id} />
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
