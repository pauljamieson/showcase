import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ViewsOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [checked, setChecked] = useState<boolean>(
    searchParams.get("size") === "asc" ? false : true
  );
  const [active, setActive] = useState<boolean>(searchParams.has("size"));
  function handleChange(e: any) {
    setChecked(!checked);
    if (active) {
      const size = e.target.checked ? "desc" : "asc";
      searchParams.set("size", size);
      setSearchParams(searchParams);
    }
  }

  function handleClick(e: any) {
    if (!active) {
      searchParams.set("size", checked ? "desc" : "asc");
      setSearchParams(searchParams);
    } else {
      searchParams.delete("size");
      setSearchParams(searchParams);
    }
    setActive(!active);
  }

  return (
    <div className="order-container">
      <div className="toggle-container">
        <label className="toggle">
          <input onChange={handleChange} type="checkbox" checked={checked} />
          <span className="toggler"></span>
        </label>
        <span className={active ? "active" : ""} onClick={handleClick}>
          {checked ? "Big Boys" : "Smol"}
        </span>
      </div>
    </div>
  );
}
