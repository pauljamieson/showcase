import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  name: string;
  options: string[];
  alwaysOn: Boolean;
}

export default function SortOrder({ name, options, alwaysOn = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  function update(direction: string) {
    const current = searchParams.get(name);
    if (direction === current) return;
    searchParams.set(name, direction);
    setSearchParams(searchParams);
    sessionStorage.setItem(name, JSON.stringify(searchParams.get(name)));
  }

  function clear() {
    searchParams.delete(name);
    setSearchParams(searchParams);
    sessionStorage.removeItem(name);
  }

  useEffect(() => {
    if (searchParams.has(name) || sessionStorage.getItem(name)) {
      const direction =
        searchParams.get(name) ||
        JSON.parse(sessionStorage.getItem(name) || "[]");
      setActive(true);
      setChecked(direction === "asc" ? true : false);
      update(direction);
    } else {
      setActive(false);
      clear();
    }
  }, []);

  function handleChange(e: any) {
    setChecked(!checked);
    if (active) {
      const direction = e.target.checked ? "asc" : "desc";
      update(direction);
    }
  }

  function handleClick() {
    if (alwaysOn) return;
    if (!active) {
      update(checked ? "asc" : "desc");
    } else {
      clear();
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
