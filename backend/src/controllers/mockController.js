export class MockController {
  constructor(service) {
    this.service = service;
  }

  async updateConfig(req, res) {
    try {
      const { simulateError, responseDelay, apiRoute, mockData } = req.body;

      // Validação dos dados recebidos
      if (apiRoute === undefined || mockData === undefined) {
        return res.status(400).json({
          success: false,
          error: "apiRoute and mockData are required",
        });
      }

      await this.service.updateConfig({
        simulateError: Boolean(simulateError),
        responseDelay: Number(responseDelay),
        apiRoute,
        mockData,
      });

      res.json({
        success: true,
        message: "Configuration updated",
      });
    } catch (error) {
      console.error("Error saving configuration:", error);
      res.status(500).json({
        success: false,
        error: "Failed to save configuration",
      });
    }
  }

  async getRoutes(req, res) {
    try {
      const routes = await this.service.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch routes",
      });
    }
  }

  async getRouteConfig(req, res) {
    try {
      const routeConfig = await this.service.getRouteConfig(req.params.route);

      if (!routeConfig) {
        return res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Route /api/${req.params.route} not found.`,
          },
        });
      }

      res.json({
        success: true,
        route: `/api/${routeConfig.path}`,
        mockData: routeConfig.mockData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch route configuration",
      });
    }
  }

  async deleteRoute(req, res) {
    try {
      const success = await this.service.deleteRoute(req.params.route);

      if (!success) {
        return res.status(404).send("Route not found");
      }

      res.status(200).send(`Route ${req.params.route} deleted successfully`);
    } catch (error) {
      res.status(500).send("Failed to delete route");
    }
  }

  async handleMockRequest(req, res) {
    try {
      const mockData = await this.service.getMockResponse(req.params.route);
      res.json(mockData);
    } catch (error) {
      const status = error.status || 500;
      const response = error.error || {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected error occurred",
      };
      res.status(status).json({
        success: false,
        error: response,
      });
    }
  }

  // ... outros métodos do controller
}
