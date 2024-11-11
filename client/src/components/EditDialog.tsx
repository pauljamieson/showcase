import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";

export default function EditDialog({
  open,
  closeDialog,
  id,
}: {
  open: boolean;
  closeDialog: () => void;
  id: number;
}) {
  // Debounce timer
  const [input, setInput] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);

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
