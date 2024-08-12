import ErrorPage from "../components/ErrorPage";
import Root from "../layouts/Root";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import signup from "../actions/signup";
import Login from "../pages/Login";
import loginAction from "../actions/login";
import videosLoader from "../loaders/videos";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Incoming from "../pages/Incoming";
import incoming from "../actions/incoming";
import Videos from "../pages/Videos";
import Video from "../pages/Video";
import VideoLoader from "../loaders/video";
import VideoAction from "../actions/video";
import TagAction from "../actions/tag";

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
      {
        path: "/videos",
        element: <Videos />,
        loader: videosLoader,
      },
      {
        path: "/video/:id",
        element: <Video />,
        loader: VideoLoader,
        action: VideoAction,
        children: [{ path: "tag", action: TagAction }],
      },
      {
        path: "/admin/incoming",
        element: <Incoming />,
        loader: incoming,
        action: incoming,
      },
    ],
  },
]);
