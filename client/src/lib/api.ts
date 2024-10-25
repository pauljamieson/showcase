const methods = ["get", "post", "patch", "delete", "head", "put", "PATCH"];

export interface RequestConfig {
  method: "get" | "post" | "patch" | "delete" | "head" | "put" | "PATCH";
  endpoint: string;
  body?: object;
  searchParams?: URLSearchParams;
}

export default async function apiRequest(rc: RequestConfig) {
  try {
    const apiUrl = new URL(import.meta.env.VITE_API_URL + rc.endpoint);
    rc.searchParams?.forEach((v, k) => apiUrl.searchParams.append(k, v));
    let config = {
      method: rc.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    };
    if (rc.body && methods.includes(rc.method))
      config = { ...{ body: JSON.stringify(rc.body) }, ...config };
    const resp = await fetch(apiUrl, config);
    const token = resp.headers.get("Authorization");
    if (token) localStorage.setItem("showcase", token.substring(7));
    else localStorage.removeItem("showcase");
    var { status, data, error } = await resp.json();
  } catch (error) {
    console.error(error);
  } finally {
    return { status, data, error };
  }
}
