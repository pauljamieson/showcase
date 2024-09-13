import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiRequest from "../lib/api";

type Person = { id: number; name: string };

export default function PersonSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);
  const [active, setActive] = useState<string[]>(searchParams.getAll("people"));

  useEffect(() => {
    if (input.length > 0) {
      const sp = new URLSearchParams();
      sp.set("terms", input.trim());
      apiRequest({ method: "get", endpoint: "/people/", searchParams: sp }).then(
        (resp) => {
          resp.status === "success" && setOptions(resp.data.people);
        }
      );
    }
  }, [input]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
    if (value.length === 0) setOptions([]);
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const people = searchParams.getAll("people");
    if (!people.includes(input) && options.map((v) => v.name).includes(input)) {
      searchParams.append("people", input);
      searchParams.set("page", "1");
      setSearchParams(searchParams);
      setActive(searchParams.getAll("people"));
      setInput("");
    }
  }

  function handleClick(e: any) {
    const people = searchParams.getAll("people");
    searchParams.delete("people");
    people
      .filter((v) => v !== e.target.id)
      .forEach((v) => searchParams.append("people", v));
    setActive(searchParams.getAll("people"));
    setSearchParams(searchParams);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="text-input"
          type="text"
          list="people"
          name="person-name"
          value={input}
          onChange={handleChange}
          autoComplete="off"
          placeholder="People"
        />
        <datalist id="people">
          {options.map((val) => (
            <option key={val.name}>{val.name}</option>
          ))}
        </datalist>
        <input className="btn" type="submit" value="Add" />
      </form>
      <div className="chip-container">
        {active.length > 0 &&
          active.map((data) => (
            <div className="chip-sm" key={data} onClick={handleClick} id={data}>
              {data}
            </div>
          ))}
      </div>
    </div>
  );
}
