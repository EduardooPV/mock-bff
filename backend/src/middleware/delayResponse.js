export const createDelayMiddleware = (mockService) => {
  return async (req, res, next) => {
    try {
      const config = await mockService.getConfig();
      if (config.responseDelay > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, config.responseDelay * 1000)
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
