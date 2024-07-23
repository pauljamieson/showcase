import { createContext, useContext, useState, ReactNode, useDebugValue } from "react";

interface AuthContextValue {
  auth: string | null;
  setAuth: (str: string ) => void;
}

const AuthContext = createContext<AuthContextValue>({
  auth: null,
  setAuth: () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<string | null>(localStorage.getItem("showcase"));

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context.auth === null)
    throw new Error("useAuth used outside of auth provider.");
  return context;
}
