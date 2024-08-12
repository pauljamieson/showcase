import { SyntheticEvent, useState } from "react";

export default function SizeBar() {
  const [checked, setChecked] = useState(false);

  function handleChange(e: any) {
    setChecked(e.target.checked);
  }
  return (
    <div className="sizebar-container ">
      <div className="toggle-container">
        <label className="toggle">
          <input onChange={handleChange} type="checkbox" />
          <span className="toggler"></span>
        </label>
        <span>{checked ? "" : "B"}</span>
      </div>
    </div>
  );
}
