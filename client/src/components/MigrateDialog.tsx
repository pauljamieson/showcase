import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import { v4 as UUID } from "uuid";
import apiRequest from "../lib/api";

interface Person {
  id: number;
  name: string;
}

export default function MigrateDialog({
  open,
  closeDialog,
  id,
}: {
  open: boolean;
  closeDialog: () => void;
  id: number;
}) {
  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
    open ? dialogRef.current?.showModal() : dialogRef.current?.close();
  }, [open]);

  function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    closeDialog();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInput(e.target.value);
  }

  return (
    <dialog ref={dialogRef} className="dialog">
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
        <datalist id="people" key={UUID()}>
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
