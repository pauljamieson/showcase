import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  name: string;
  options: string[];
  alwaysOn: Boolean;
}

export default function SortOrder({ name, options, alwaysOn = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState<boolean>(
    alwaysOn ? true : searchParams.has(name)
  );
  const [checked, setChecked] = useState<boolean>(
    searchParams.get(name) === "asc" ? true : false
  );

  function handleChange(e: any) {
    setChecked(!checked);
    if (active) {
      const direction = e.target.checked ? "asc" : "desc";
      searchParams.set(name, direction);
      setSearchParams(searchParams);
    }
  }

  function handleClick() {
    if (alwaysOn) return;
    if (!active) {
      searchParams.set(name, checked ? "asc" : "desc");
      setSearchParams(searchParams);
    } else {
      searchParams.delete(name);
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
        <span
          className={!alwaysOn && active ? "active" : ""}
          onClick={handleClick}
        >
          {checked ? options[0] : options[1]}
        </span>
      </div>
    </div>
  );
}
