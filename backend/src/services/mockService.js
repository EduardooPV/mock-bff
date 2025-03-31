export class MockService {
  constructor(repository) {
    this.repository = repository;
  }

  async getConfig() {
    return await this.repository.readConfig();
  }

  async updateConfig(configData) {
    const currentConfig = await this.repository.readConfig();
    const { simulateError, responseDelay, apiRoute, mockData } = configData;

    const existingRouteIndex = currentConfig.apiRoutes.findIndex(
      (route) => route.path === apiRoute
    );

    if (existingRouteIndex !== -1) {
      currentConfig.apiRoutes[existingRouteIndex].mockData = mockData;
    } else {
      currentConfig.apiRoutes.push({ path: apiRoute, mockData });
    }

    const updatedConfig = {
      ...currentConfig,
      simulateError: Boolean(simulateError),
      responseDelay: Number(responseDelay) || currentConfig.responseDelay,
      apiRoutes: currentConfig.apiRoutes,
    };

    await this.repository.saveConfig(updatedConfig);
    return true;
  }

  async getRoutes() {
    const config = await this.repository.readConfig();
    return config.apiRoutes.map((route) => `/${route.path}`);
  }

  async getRouteConfig(route) {
    const config = await this.repository.readConfig();
    return config.apiRoutes.find((r) => r.path === route);
  }

  async deleteRoute(route) {
    const config = await this.repository.readConfig();
    const routeIndex = config.apiRoutes.findIndex((r) => r.path === route);

    if (routeIndex === -1) {
      return false;
    }

    config.apiRoutes.splice(routeIndex, 1);
    await this.repository.saveConfig(config);
    return true;
  }

  async getMockResponse(route) {
    const config = await this.repository.readConfig();

    if (config.simulateError) {
      throw {
        status: 500,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Simulated server error",
        },
      };
    }

    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;

    const routePath = normalizedRoute.split("?")[0];

    const routeConfig = config.apiRoutes.find(
      (r) => r.path.split("?")[0] === routePath
    );

    if (!routeConfig) {
      throw {
        status: 404,
        error: {
          code: "NOT_FOUND",
          message: `Route ${route} not configured.`,
        },
      };
    }

    return routeConfig.mockData;
  }
}
