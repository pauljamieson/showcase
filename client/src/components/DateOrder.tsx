import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function OrderBar() {
  const [params, setParams] = useSearchParams();
  const [checked, setChecked] = useState<boolean>(false);

  function handleChange(e: any) {
    const order = e.target.checked ? "asc" : "desc";
    params.set("order", order);
    setParams(params);
    setChecked(e.target.checked);
  }

  return (
    <div className="order-container">
      <div className="toggle-container">
        <label className="toggle">
          <input onChange={handleChange} type="checkbox" />
          <span className="toggler"></span>
        </label>
        <span>{checked ? "Oldest" : "Newest"}</span>
      </div>
    </div>
  );
}
