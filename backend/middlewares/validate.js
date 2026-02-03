const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      // Check if it's a Zod validation error
      if (err.name === 'ZodError' || err.issues) {
        // Format Zod errors into a user-friendly structure
        const formattedErrors = err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        
        return res.status(400).json({
          error: formattedErrors[0].message, // First error message for simple display
          errors: formattedErrors // All errors for detailed handling
        });
      }
      
      // Generic error
      return res.status(400).json({
        error: err.message || "Validation failed"
      });
    }
  };
};

export default validate;