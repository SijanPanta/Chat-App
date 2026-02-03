const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        errors: err.issues || err.errors || [{ message: err.message.message }]
      });
    }
  };
};

export default validate;
