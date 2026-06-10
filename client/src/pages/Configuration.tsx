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
      "true",
  );

  const [minLength, setMinLength] = useState<number>(
    parseInt(
      loaderData.data?.config?.find((c) => c.key === "min_length")?.value ||
        "30",
    ),
  );

  const handleChangeSignups = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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

  const handleChangeMinLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = parseInt(e.target.value);

    setMinLength(value);
    apiRequest({
      endpoint: "/admin/configuration",
      method: "post",
      body: {
        intent: "Edit",
        key: "min_length",
        value: value.toString(),
      },
    });
  };

  return (
    <div>
      <h1>Configuration</h1>
      <p>Manage Configuration</p>
      <div className="config-container">
        <div className="config-item">
          <label>Enable Signups</label>
          <input
            type="checkbox"
            value="enable-signups"
            onChange={handleChangeSignups}
            checked={enableSignups}
          />
        </div>
        <div className="config-item">
          <label>Minimum Video Import Length In Seconds</label>
          <input
            type="number"
            value={minLength}
            onChange={handleChangeMinLength}
            min={0}
            max={3600}
          />
        </div>
      </div>
    </div>
  );
}
