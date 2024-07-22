import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextValue {
  auth: string | undefined;
  setAuth: ((str: string) => void) | undefined;
}

const AuthContext = createContext<AuthContextValue>({
  auth: undefined,
  setAuth: undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<string>("");

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context.auth === "undefined")
    throw new Error("useAuth used outside of auth provider.");
  return context;
}
