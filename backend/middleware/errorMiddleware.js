function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  console.error(err);
  res.status(status).json({ message });
}

module.exports = { errorHandler };
