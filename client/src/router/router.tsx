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
import AdminTag from "../pages/AdminTag";
import AdminTagLoader from "../loaders/adminTag";
import AdminTagAction from "../actions/adminTag";
import AdminPerson from "../pages/AdminPerson";
import AdminPersonLoader from "../loaders/adminPerson";
import AdminPersonAction from "../actions/adminPerson";
import VideoPlaylistLoader from "../loaders/videoPlaylist";
import VideoPlaylistAction from "../actions/videoPlaylist";
import Playlists from "../pages/Playlists";
import PlaylistsLoader from "../loaders/playlists";
import Playlist from "../pages/Playlist";
import PlaylistLoader from "../loaders/playlist";

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
          {
            path: "playlist",
            loader: VideoPlaylistLoader,
            action: VideoPlaylistAction,
          },
        ],
      },
      {
        path: "/admin/incoming",
        element: <Incoming />,
        loader: IncomingLoader,
        action: IncomingAction,
      },
      {
        path: "/admin/tags",
        element: <AdminTag />,
        loader: AdminTagLoader,
        action: AdminTagAction,
      },
      {
        path: "/admin/people",
        element: <AdminPerson />,
        loader: AdminPersonLoader,
        action: AdminPersonAction,
      },
      { path: "/profile", element: <Profile />, loader: ProfileLoader },

      { path: "/playlists", element: <Playlists />, loader: PlaylistsLoader },
      { path: "/playlist/:id", element: <Playlist />, loader: PlaylistLoader },
    ],
  },
]);
