import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type User =
  | {
      name: string;
      admin: boolean;
    }
  | undefined;

interface AuthContextValue {
  auth: string | null | undefined;
  isLoggedIn: boolean | undefined;
  user: User;
  setToken: (str: string) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  auth: undefined,
  isLoggedIn: undefined,
  user: undefined,
  setToken: () => null,
  clearToken: () => null,
});

// local storage doesn't exist = null
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIisLoggedIn] = useState<boolean>(false);
  const [auth, setAuth] = useState<string | null>(null);
  const [user, setUser] = useState<User>(undefined);

  function decodeToken(token: string) {
    const { name, admin } = JSON.parse(atob(token.split(".")[1]));
    return { name, admin };
  }

  function setToken(token: string) {
    setAuth(token);
    setIisLoggedIn(true);
    setUser(decodeToken(token));
    localStorage.setItem("showcase", token);
  }

  function clearToken() {
    setAuth(null);
    setIisLoggedIn(false);
    localStorage.removeItem("showcase");
  }

  useEffect(() => {
    if (localStorage.getItem("showcase")) {
      setToken(localStorage.getItem("showcase") || "");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, isLoggedIn, user, setToken, clearToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// will error if auth not setcker 
export default function useAuth() {
  const context = useContext(AuthContext);
  if (context.auth === undefined)
    throw new Error("useAuth used outside of auth provider.");
  return context;
}
