export default async ({ request }: { request: Request }) => {
  switch (request.method) {
    case "GET": {
      try {
        const fetchData = await fetch("http://localhost:5000/admin/incoming/", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        });

        const data = await fetchData.json();
        if (data.status === "success") {
          const token = fetchData.headers.get("Authorization");
          if (!token) throw "JWT header is missing";
          localStorage.setItem("showcase", token.substring(7));
          return { status: "success", files: data.data.files };
        } else if (data.status === "failure") throw data.error;
        break;
      } catch (error: any) {
        return { error };
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
    case "POST": {
      try {
        const formData = await request.formData();
        const intent = formData.get("intent");
        let payload = [];
        if (intent === "importall") {
          const { files } = JSON.parse(
            atob(formData.get("all")?.toString() || "")
          );
          payload = files;
        }

        if (intent === "selected") {
          for (const a of formData.entries()) {
            if (a[1] === "on") payload.push(atob(a[0]));
          }
        }
        const fetchData = await fetch("http://localhost:5000/admin/incoming/", {
          method: "post",
          body: JSON.stringify({ files: payload }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        });

        const data = await fetchData.json();
        console.log(data);
        return {};
      } catch (err) {
        console.error(err);
        return {};
      }
    }
  }
};
