import apiRequest from "../lib/api";

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
    const promises = [];
    for (let i = 0; i < rounds; i++) {
      const start = i * size;
      const body = {
        files: payload.slice(start, start + size),
      };

      const req = apiRequest({
        method: "post",
        endpoint: "/admin/incoming/",
        body,
      });
      promises.push(req);
    }
    await Promise.all(promises);
    return { status: "success" };
  } catch (err) {
    console.error(err);
    return null;
  }
};
