export async function apiCall(path: string, method: "get" | "post" | "patch") {
  const apiUrl = new URL(`http://localhost:5000/${path}`);
  const resp = await fetch(apiUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("showcase"),
    },
  });

  console.log(resp);

  const result = await resp.json();
}
