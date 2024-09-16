import { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  Form,
  useSearchParams,
  useFetcher,
} from "react-router-dom";

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
  const [input, setInput] = useState<string>("");
  const editRef = useRef<HTMLDialogElement | null>(null);
  const migrateRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher();
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
        <button className="btn" onClick={() => migrateRef.current!.showModal()}>
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
      <dialog className="edit-modal" ref={migrateRef} open={false}>
        <div>
          Migrate
          <Form>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="name" value={name} />
            <input
              className="search-input"
              type="text"
              list="tags"
              name="tag-name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              ref={inputRef}
            />
            <datalist id="tags">
              {[{ name: "jack" }].map((val) => (
                <option>{val.name}</option>
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
                onClick={() => migrateRef.current!.close()}
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
