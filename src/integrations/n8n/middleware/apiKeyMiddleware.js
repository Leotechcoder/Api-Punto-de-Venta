export const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API Key requerida",
    });
  }

  if (apiKey !== process.env.N8N_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "API Key inválida",
    });
  }

  next();
};