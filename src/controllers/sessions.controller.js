import * as sessionsService from "../services/sessions.service.js";

export const register = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await sessionsService.register(userData);
    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ status: "error", message: error.message });
  }
};
