import ErrorPage from "../components/ErrorPage";
import Root from "./Root";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "./SignUp";
import signup from "../actions/signup";
import Login from "./Login";
import loginAction from "../actions/login";
import Home from "./Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
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
      {
        path: "/admin",
        element: <div>Hello</div>,
      },
    ],
  },
]);
