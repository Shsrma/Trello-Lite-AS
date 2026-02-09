// backend/src/middlewares/validate.middleware.js
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
  };
};

module.exports = validate;
