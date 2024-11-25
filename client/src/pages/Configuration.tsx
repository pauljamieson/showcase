import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import apiRequest from "../lib/api";

interface LoaderData {
  error?: string;
  data?: { config: [{ key: string; value: string }] };
}

export default function Configuration() {
  const loaderData = useLoaderData() as LoaderData;
  const [enableSignups, setEnableSignups] = useState<boolean>(
    loaderData.data?.config?.find((c) => c.key === "allow_signup")?.value ===
      "true"
  );

  const handleChangeSignups = (_: React.ChangeEvent<HTMLInputElement>) => {
    setEnableSignups((enableSignups) => !enableSignups);
    apiRequest({
      endpoint: "/admin/configuration",
      method: "post",
      body: {
        intent: "Edit",
        key: "allow_signup",
        value: enableSignups ? "false" : "true",
      },
    });
  };

  return (
    <div>
      <h1>Configuration</h1>
      <p>Manage Configuration</p>
      <div className="config-item">
        <input
          type="checkbox"
          value="enable-signups"
          onChange={handleChangeSignups}
          checked={enableSignups}
        />
        <label>Enable Signups</label>
      </div>
    </div>
  );
}
