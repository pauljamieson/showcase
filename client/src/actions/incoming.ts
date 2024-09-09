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

    const size = 100;
    const rounds = Math.ceil(payload.length / size);

    for (let i = 0; i < rounds; i++) {
      const start = i * size;
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/incoming/`,
        {
          method: "post",
          body: JSON.stringify({
            files: payload.slice(start, start + size),
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        }
      );

      const token = resp.headers.get("Authorization");
      if (!token) throw "JWT header is missing";
      localStorage.setItem("showcase", token.substring(7));
    }

    return {};
  } catch (err) {
    console.error(err);
    return {};
  }
};
