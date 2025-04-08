export const createDelayMiddleware = (mockService) => {
  return async (req, res, next) => {
    try {
      const delay = await mockService.getRouteDelay(req.path);
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
