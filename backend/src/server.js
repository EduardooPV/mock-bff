import app from "./app.js";
import { CONFIG } from "./config/config.js";

const PORT = CONFIG.PORT;

app.listen(PORT, () => {
  console.log(`Mock BFF server running on http://localhost:${PORT}`);
});
