export const saveConfigService = async (config, text) => {
  const response = await fetch("http://localhost:3000/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...config,
      mockData: JSON.parse(text),
    }),
  });

  return response;
};

export const fetchRoutesService = async () => {
  const response = await fetch("http://localhost:3000/routes");

  return response;
};

export const deleteRouteService = async (route) => {
  const response = await fetch(`http://localhost:3000/routes/${route}`, {
    method: "DELETE",
  });

  return response;
};

export const fetchRouteDataService = async (route) => {
  const response = await fetch(`http://localhost:3000/routes${route}`);

  return response;
};
