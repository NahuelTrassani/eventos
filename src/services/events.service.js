import eventRepository from "../repositories/events.repository.js";

export const getAllEvents = async () => {
  return eventRepository.getAllEvents();
};
