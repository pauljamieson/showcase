import ErrorPage from "../components/ErrorPage";
import Root from "../layouts/Root";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import signup from "../actions/signup";
import Login from "../pages/Login";
import loginAction from "../actions/login";
import Home from "../pages/Home";
import Admin from "../pages/Admin";

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
        element: <Admin />,
      },
    ],
  },
]);
