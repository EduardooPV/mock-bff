import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  CONFIG_PATH: path.resolve(__dirname, "../../../mock-config.json"),
  DEFAULT_CONFIG: {
    simulateError: false,
    responseDelay: 5,
    apiRoutes: [],
  },
};
