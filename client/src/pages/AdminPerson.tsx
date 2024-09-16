import { useEffect, useRef, useState } from "react";
import { useLoaderData, useSearchParams, Form } from "react-router-dom";

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
  const editRef = useRef<HTMLDialogElement | null>(null);
  const migrateRef = useRef<HTMLDialogElement | null>(null);
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
      <dialog className="edit-modal" ref={editRef} open={false}>
        <div>
          <div className="title">Edit</div>
          <Form>
            <div>
              <div>Old Name: {name}</div>
              <input type="text" placeholder="New Name" />
            </div>
            <br />
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
            <input type="text" placeholder="New Name" />
            <div className="btn-bar ">
              <button className="btn" type="submit" name="intent" value="Edit">
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
