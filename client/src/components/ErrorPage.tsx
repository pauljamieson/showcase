import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="error-container">
      <span>Opps! Something went wrong!!!</span>
      <br/>
      <Link to="/" className="go-home txt-underlined">Go back to home</Link>
    </div>
  );
}
