import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import apiRequest from "../lib/api";

interface LoaderData {
  error?: string;
  data?: { config: [{ key: string; value: string }] };
}

export default function Configuration() {
  const loaderData = useLoaderData() as LoaderData;
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(
    loaderData.data?.config?.find((c) => c.key === "maintenance_mode")
      ?.value === "true",
  );

  const [showMetadata, setShowMetadata] = useState<boolean>(
    loaderData.data?.config?.find((c) => c.key === "meta_data")?.value ===
      "true",
  );
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

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    switch (name) {
      case "maintenance-mode":
        setMaintenanceMode(checked);
        apiRequest({
          endpoint: "/admin/configuration",
          method: "post",
          body: {
            intent: "Edit",
            key: "maintenance_mode",
            value: checked ? "true" : "false",
          },
        });
        break;
      case "show-metadata":
        setShowMetadata(checked);
        apiRequest({
          endpoint: "/admin/configuration",
          method: "post",
          body: {
            intent: "Edit",
            key: "meta_data",
            value: checked ? "true" : "false",
          },
        });
        break;
    }
  };

  const handleChangeSignups = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEnableSignups((enableSignups) => !enableSignups);
    apiRequest({
      endpoint: "/admin/configuration",
      method: "post",
      body: {
        intent: "Edit",
        key: "allow_signup",
        value: !enableSignups ? "true" : "false",
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
            name="enable-signups"
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
        <div className="config-item">
          <label>Maintenance Mode</label>
          <input
            type="checkbox"
            name="maintenance-mode"
            onChange={handleItemChange}
            checked={maintenanceMode}
          />
        </div>
        <div className="config-item">
          <label>Show tags and people</label>
          <input
            type="checkbox"
            name="show-metadata"
            onChange={handleItemChange}
            checked={showMetadata}
          />
        </div>
      </div>
    </div>
  );
}
