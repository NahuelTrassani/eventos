import * as eventsService from "../services/events.service.js";

export const getAllEvents = async (req, res) => {
  try {
    const resultado = await eventsService.getAllEvents();
    res.status(200).json({ status: "success", payload: resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
};
