export class MockService {
  constructor(repository) {
    this.repository = repository;
  }

  async getConfig() {
    return await this.repository.readConfig();
  }

  async updateConfig(configData) {
    const currentConfig = await this.repository.readConfig();
    const { simulateError, responseDelay, apiRoute, mockData, name } =
      configData;

    const existingRouteIndex = currentConfig.apiRoutes.findIndex(
      (route) => route.path === apiRoute
    );

    if (existingRouteIndex !== -1) {
      currentConfig.apiRoutes[existingRouteIndex] = {
        ...currentConfig.apiRoutes[existingRouteIndex],
        simulateError,
        responseDelay,
        mockData,
        name,
      };
    } else {
      currentConfig.apiRoutes.push({
        path: apiRoute,
        name,
        simulateError,
        responseDelay,
        mockData,
      });
    }

    await this.repository.saveConfig(currentConfig);
    return true;
  }

  async getRoutes() {
    const config = await this.repository.readConfig();
    return config.apiRoutes.map((route) => `/${route.path}`);
  }

  async getRouteConfig(route) {
    const config = await this.repository.readConfig();
    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;
    return config.apiRoutes.find((r) => r.path === normalizedRoute);
  }

  async deleteRoute(route) {
    const config = await this.repository.readConfig();
    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;
    const routeIndex = config.apiRoutes.findIndex(
      (r) => r.path === normalizedRoute
    );

    if (routeIndex === -1) {
      return false;
    }

    config.apiRoutes.splice(routeIndex, 1);
    await this.repository.saveConfig(config);
    return true;
  }

  async getMockResponse(route) {
    const config = await this.repository.readConfig();
    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;
    const routeConfig = config.apiRoutes.find(
      (r) => r.path === normalizedRoute
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

    if (routeConfig.simulateError) {
      throw {
        status: 500,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Simulated server error",
        },
      };
    }

    return routeConfig.mockData;
  }

  async getRouteDelay(route) {
    const config = await this.repository.readConfig();
    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;
    const routeConfig = config.apiRoutes.find(
      (r) => r.path === normalizedRoute
    );
    return routeConfig ? routeConfig.responseDelay : 0;
  }
}
