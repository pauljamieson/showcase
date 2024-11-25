import { Request, Response } from "express";
import { getConfig, updateCongfiguration } from "../../database/database";

async function GET(req: Request, res: Response) {
  try {
    const config = await getConfig();
    res.json({ status: "success", data: { config } });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

async function POST(req: Request, res: Response) {
  try {
    const { intent } = req.body;
    switch (intent) {
      case "Edit":
        const { key, value } = req.body;
        // Update the configuration
        const resp = await updateCongfiguration(key, value);
        if (!resp) throw new Error("Failed to update configuration");
        break;
      default:
        break;
    }

    res.json({ status: "success" });
  } catch (error: any) {
    console.error(error);

    res.json({ status: "failure", error });
  }
}

export default { POST, GET };
