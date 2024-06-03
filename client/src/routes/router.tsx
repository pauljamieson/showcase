import ErrorPage from "../components/ErrorPage";
import Root from "./Root";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "./SignUp";
import signup from "../actions/signup";
import Login from "./Login";
import loginAction from "../actions/login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />, 
    children: [
      {
        path: "/signup",
        element: <SignUp />,
        action: signup,
      },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
    ],
  },
]);
