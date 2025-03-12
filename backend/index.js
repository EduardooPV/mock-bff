import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware
app.use(cors());
app.use(express.json());

// Caminho do arquivo de configuração
const configPath = path.resolve(__dirname, "mock-config.json");

// Variáveis de configuração
let mockConfig = {
  simulateError: false,
  responseDelay: 5,
  apiRoutes: [],
};

// Funções auxiliares para manipulação de configuração
const loadConfig = async () => {
  try {
    const data = await fs.promises.readFile(configPath, "utf8");
    mockConfig = JSON.parse(data);
    console.log("Configuration loaded from file");
  } catch (error) {
    console.log("No configuration file found, using empty configuration");
    await saveConfig(); // Salva configuração vazia
  }
};

const saveConfig = async () => {
  try {
    await fs.promises.writeFile(
      configPath,
      JSON.stringify(mockConfig, null, 2),
      "utf8"
    );
    console.log("Configuration saved to file");
  } catch (error) {
    console.error("Error saving configuration:", error);
  }
};

// Rota para atualizar a configuração
app.post("/api/config", (req, res) => {
  const { simulateError, responseDelay, apiRoute, mockData } = req.body;

  // Atualizar ou adicionar a nova rota em apiRoutes
  const existingRoute = mockConfig.apiRoutes.find(
    (route) => route.path === apiRoute
  );
  if (existingRoute) {
    existingRoute.mockData = mockData;
  } else {
    mockConfig.apiRoutes.push({ path: apiRoute, mockData });
  }

  mockConfig = {
    simulateError: Boolean(simulateError),
    responseDelay: Number(responseDelay) || 0,
    apiRoutes: mockConfig.apiRoutes,
  };

  saveConfig();
  res.json({ success: true, message: "Configuration updated" });
});

// Rota dinâmica para simulação de API
app.get("/api/:route", (req, res) => {
  const requestedRoute = req.params.route;
  const routeConfig = mockConfig.apiRoutes.find(
    (route) => route.path === requestedRoute
  );

  if (routeConfig) {
    // Verificar se o delay é maior que 0 antes de aplicar o setTimeout
    if (mockConfig.responseDelay > 0) {
      setTimeout(() => {
        if (mockConfig.simulateError) {
          return res.status(500).json({
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Simulated server error",
            },
          });
        }
        res.json(routeConfig.mockData);
      }, mockConfig.responseDelay * 1000);
    } else {
      // Se o delay for 0, responde imediatamente
      if (mockConfig.simulateError) {
        return res.status(500).json({
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Simulated server error",
          },
        });
      }
      res.json(routeConfig.mockData);
    }
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Route /api/${requestedRoute} not configured.`,
      },
    });
  }
});

// Rota para listar todas as rotas configuradas
app.get("/routes", (req, res) => {
  const availableRoutes = mockConfig.apiRoutes.map(
    (route) => `/api/${route.path}`
  );
  res.json(availableRoutes);
});

// Rota para deletar uma rota configurada
app.delete("/api/routes/:route", (req, res) => {
  const { route } = req.params;
  console.log(`Received DELETE request for route: ${route}`);

  const routeIndex = mockConfig.apiRoutes.findIndex((r) => r.path === route);
  if (routeIndex === -1) {
    return res.status(404).send("Route not found");
  }

  mockConfig.apiRoutes.splice(routeIndex, 1);
  saveConfig();
  res.status(200).send(`Route ${route} deleted successfully`);
});

app.get("/api/routes/:route", (req, res) => {
  const { route } = req.params;
  const routeConfig = mockConfig.apiRoutes.find((r) => r.path === route);

  if (!routeConfig) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Route /api/${route} not found.`,
      },
    });
  }

  res.json({
    success: true,
    route: `/api/${routeConfig.path}`,
    mockData: routeConfig.mockData,
  });
});

// Função para iniciar o servidor
const startServer = async () => {
  await loadConfig();

  app.listen(PORT, () => {
    console.log(`Mock BFF server running on http://localhost:${PORT}`);
    mockConfig.apiRoutes.forEach((route) => {
      console.log(
        `Mock URL available: http://localhost:${PORT}/api/${route.path}`
      );
    });
  });
};

startServer();
