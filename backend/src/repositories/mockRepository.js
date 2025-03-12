import fs from "fs/promises";
import { CONFIG } from "../config/config.js";

export class MockRepository {
  async readConfig() {
    try {
      const data = await fs.readFile(CONFIG.CONFIG_PATH, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.log("No configuration file found, using default configuration");
      const defaultConfig = CONFIG.DEFAULT_CONFIG;
      await this.saveConfig(defaultConfig);
      return defaultConfig;
    }
  }

  async saveConfig(config) {
    try {
      await fs.writeFile(
        CONFIG.CONFIG_PATH,
        JSON.stringify(config, null, 2),
        "utf8"
      );
      console.log("Configuration saved to file");
      return true;
    } catch (error) {
      console.error("Error saving configuration:", error);
      throw error;
    }
  }
}
