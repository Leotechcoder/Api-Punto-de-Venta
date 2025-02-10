export function errorHandler(err, req, res, next) {
    console.error("Error caught by middleware", err)
    res.status(500).json({ error: "Internal server error" })
  }
  
  