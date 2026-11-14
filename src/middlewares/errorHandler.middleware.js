export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = status === 500 ? "Error interno del servidor" : err.message;
  console.error(err);
  res.status(status).json({ status: "error", message });
};
