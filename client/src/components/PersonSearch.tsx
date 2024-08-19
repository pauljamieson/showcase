import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Person = { id: number; name: string };

export default function PersonSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>("");
  const [options, setOptions] = useState<Person[]>([]);
  const [active, setActive] = useState<string[]>(searchParams.getAll("people"));

  useEffect(() => {
    if (input.length > 0) {
      const apiUrl = new URL("http://localhost:5000/people");
      apiUrl.searchParams.set("terms", input);
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("showcase"),
        },
      })
        .then((resp) => resp.json())
        .then((data) => setOptions(data.people));
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
          type="text"
          list="people"
          name="person-name"
          value={input}
          onChange={handleChange}
          autoComplete="off"
        />
        <datalist id="people">
          {options.map((val) => (
            <option>{val.name}</option>
          ))}
        </datalist>
        <input type="submit" value="Add" />
      </form>
      <div className="chip-container">
        {active.length > 0 &&
          active.map((data) => (
            <p key={data} onClick={handleClick} id={data}>
              {data}
            </p>
          ))}
      </div>
    </div>
  );
}
