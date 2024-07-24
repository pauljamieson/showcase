import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextValue {
  auth: string | null | undefined;
  setAuth: (str: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  auth: undefined,
  setAuth: () => null,
  clearAuth: () => null,
});

// local storage doesn't exist = null
export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<string | null>(
    localStorage.getItem("showcase")
  );

  function clearAuth() {
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// will error if auth not set
export default function useAuth() {
  const context = useContext(AuthContext);
  if (context.auth === undefined)
    throw new Error("useAuth used outside of auth provider.");
  return context;
}
