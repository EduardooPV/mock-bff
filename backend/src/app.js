import express from "express";
import cors from "cors";
import { createMockRouter } from "./routes/mockRoutes.js";
import { MockRepository } from "./repositories/mockRepository.js";
import { MockService } from "./services/mockService.js";
import { MockController } from "./controllers/mockController.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection
const mockRepository = new MockRepository();
const mockService = new MockService(mockRepository);
const mockController = new MockController(mockService);

app.get("/routes", async (req, res) => {
  try {
    const routes = await mockService.getRoutes();
    res.json(routes);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch routes",
    });
  }
});

app.use("/", createMockRouter(mockController, mockService));

export default app;
