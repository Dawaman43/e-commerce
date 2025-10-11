import { auth } from "../libs/auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
      cookies: req.cookies,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = session.user;
    next();
  } catch (error) {
    console.error("Auth middleware error: ", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
