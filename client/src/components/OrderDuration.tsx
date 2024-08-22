import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function DurationOrder() {
  const [params, setParams] = useSearchParams();
  const [checked, setChecked] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  function handleChange(e: any) {
    if (active) {
      params.set("duration", e.target.checked ? "asc" : "desc");
      setParams(params);
    }
    setChecked(e.target.checked);
  }

  function handleClick(e: any) {
    if (!active) {
      params.set("duration", checked ? "asc" : "desc");
      setParams(params);
    } else {
      params.delete("duration");
      setParams(params);
    }
    setActive(!active);
  }

  return (
    <div className="order-container">
      <div className="toggle-container">
        <label className="toggle">
          <input onChange={handleChange} type="checkbox" />
          <span className="toggler"></span>
        </label>
        <span className={active ? "active" : ""} onClick={handleClick}>
          {checked ? "Shortest" : "Longest"}
        </span>
      </div>
    </div>
  );
}
