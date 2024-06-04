export default function useAuth(): string | null {
  // check if jwt is stored locally
  const token = localStorage.getItem("showcase");
  return token;
}
