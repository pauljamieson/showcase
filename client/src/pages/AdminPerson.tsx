import { useLoaderData } from "react-router-dom";

type LoaderData = {
  status: string;
  people: [
    {
      id: number;
      name: string;
      userId: number;
      creator: { displayname: string };
    }
  ];
};

export default function AdminPerson() {
  const { people } = useLoaderData() as LoaderData;

  return (
    <>
      {people?.map((val) => (
        <Row {...val} />
      ))}
    </>
  );
}

function Row({
  name,
  creator: { displayname },
}: {
  id: number;
  name: string;
  userId: number;
  creator: { displayname: string };
}) {
  return (
    <div className="edit-container">
      <div>
        <div>{name}</div>
        <div className="half-text">Creator: {displayname}</div>
      </div>
      <div className="grow" />
      <div className="btn-bar">
        <button className="btn">Edit</button>
        <button className="btn">Delete</button>
        <button className="btn">Migrate</button>
      </div>
    </div>
  );
}
