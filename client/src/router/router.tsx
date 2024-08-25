import ErrorPage from "../components/ErrorPage";
import Root from "../layouts/Root";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignUpAction from "../actions/signup";
import Login from "../pages/Login";
import LoginAction from "../actions/login";
import VideosLoader from "../loaders/videos";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Incoming from "../pages/Incoming";
import IncomingAction from "../actions/incoming";
import IncomingLoader from "../loaders/incoming";
import Videos from "../pages/Videos";
import Video from "../pages/Video";
import VideoLoader from "../loaders/video";
import VideoAction from "../actions/video";
import TagAction from "../actions/tag";
import TagChipAction from "../actions/tagChip";
import PersonAction from "../actions/person";
import PersonChipAction from "../actions/personChip";
import Profile from "../pages/Profile";
import ProfileLoader from "../loaders/profile";

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
        action: SignUpAction,
      },
      {
        path: "/login",
        element: <Login />,
        action: LoginAction,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/videos",
        element: <Videos />,
        loader: VideosLoader,
      },
      {
        path: "/video/:id",
        element: <Video />,
        loader: VideoLoader,
        action: VideoAction,
        children: [
          { path: "tag", action: TagAction },
          { path: "tag/chip", action: TagChipAction },
          { path: "person", action: PersonAction },
          { path: "person/chip", action: PersonChipAction },
        ],
      },
      {
        path: "/admin/incoming",
        element: <Incoming />,
        loader: IncomingLoader,
        action: IncomingAction,
      },
      { path: "/profile", element: <Profile />, loader: ProfileLoader },
    ],
  },
]);
