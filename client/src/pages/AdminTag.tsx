import { useLoaderData, Form } from "react-router-dom";

type LoaderData = {
  status: string;
  tags: [
    {
      id: number;
      name: string;
      userId: number;
      creator: { displayname: string };
    }
  ];
};

export default function AdminTag() {
  const { tags } = useLoaderData() as LoaderData;

  return (
    <>
      {tags?.map((val) => (
        <Row {...val} />
      ))}
    </>
  );
}

function Row({
  id,
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
      <Form className="btn-bar" method="post">
        <button className="btn">Edit</button>
        <input className="btn" type="submit" name="intent" value="Delete" />
        <input type="hidden" name="id" value={id} />
        <button className="btn">Migrate</button>
      </Form>
    </div>
  );
}
