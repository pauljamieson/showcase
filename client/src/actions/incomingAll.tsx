export default async ({ request }: { request: Request }) => {
    switch (request.method) {
  
      case "POST": {
        try {
          const formData = await request.formData();
          const all = formData.get("all") || "";
          console.log(JSON.parse(atob(all.toString())));
          for (const key of formData.keys()) {
            console.log(key);
          }
          console.log(formData.get("allFiles")?.valueOf())
  
  
          return {};
        } catch (err) {
          console.error(err);
          return {};
        }
      }
    }
  };
  