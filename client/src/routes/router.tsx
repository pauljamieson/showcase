import ErrorPage from "../components/ErrorPage";
import Root from "./Root";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "./SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);
