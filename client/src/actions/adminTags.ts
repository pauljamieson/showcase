export default async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const intent = formData.get("intent");
    let payload = [];
    if (intent === "importall") {
      const { files } = JSON.parse(
        decodeURIComponent(atob(formData.get("all")?.toString() || ""))
      );
      payload = files;
    }

    if (intent === "selected") {
      for (const a of formData.entries()) {
        if (a[1] === "on") payload.push(decodeURIComponent(atob(a[0])));
      }
    }
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/admin/incoming/`, {
      method: "post",
      body: JSON.stringify({ files: payload }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("showcase"),
      },
    });
    const token = resp.headers.get("Authorization");
    if (!token) throw "JWT header is missing";
    localStorage.setItem("showcase", token.substring(7));
    await resp.json();

    return {};
  } catch (err) {
    console.error(err);
    return {};
  }
};
