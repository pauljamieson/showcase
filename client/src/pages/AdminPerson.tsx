import { useEffect, useState } from "react";
import { useLoaderData, useSearchParams, Form } from "react-router-dom";
import { v4 as UUID } from "uuid";
import MigrateDialog from "../components/MigrateDialog";
import EditDialog from "../components/EditDialog";

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
      input.length > 0
        ? searchParams.set("terms", input)
        : searchParams.delete("terms");
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
        people.map((val) => <Row key={UUID()} {...val} />)
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
  const [migrateDialog, setMigrateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  function handleClickMigrate() {
    setMigrateDialog(true);
  }

  function handleClickEdit() {
    setEditDialog(true);
  }

  function closeMigrateDialog() {
    setMigrateDialog(false);
  }

  function closeEditDialog() {
    setEditDialog(false);
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

      <MigrateDialog
        open={migrateDialog}
        closeDialog={closeMigrateDialog}
        id={id}
      />
      <EditDialog open={editDialog} closeDialog={closeEditDialog} id={id} />
    </>
  );
}
