const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err.name === "ZodError" || err.issues) {
        const formattedErrors = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return res.status(400).json({
          error: formattedErrors[0].message,
          errors: formattedErrors,
        });
      }
      return res.status(400).json({ error: err.message || "Validation failed" });
    }
  };
};

export default validate;
