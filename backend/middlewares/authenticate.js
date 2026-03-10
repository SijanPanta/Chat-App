export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const authUrl = `${process.env.AUTH_SERVICE_URL}/auth/verify`;
    console.log("AUTH_SERVICE_URL:", process.env.AUTH_SERVICE_URL);
    console.log("Full verify URL:", authUrl);

    const response = await fetch(authUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Auth service response status:", response.status);

    if (!response.ok) {
      const body = await response.json();
      return res.status(401).json({ error: body.error || "Unauthorized" });
    }

    const { user } = await response.json();
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth service fetch error:", error.message);
    console.error("Full error:", error);
    return res.status(503).json({ error: "Auth service unavailable" });
  }
};
