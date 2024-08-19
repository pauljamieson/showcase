import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ViewsOrder() {
  const [params, setParams] = useSearchParams();
  const [checked, setChecked] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  function handleChange(e: any) {
    if (active) {
      const views = e.target.checked ? "asc" : "desc";
      params.set("views", views);
      setParams(params);
    }
    setChecked(e.target.checked);
  }

  function handleClick(e: any) {
    if (!active) {
      params.set("views", checked ? "asc" : "desc");
      setParams(params);
    } else {
      params.delete("views");
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
          {checked ? "Least Views" : "Most Views"}
        </span>
      </div>
    </div>
  );
}
