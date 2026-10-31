import Event from "../models/Event.js";

class EventDao {
  static async getAllEvents() {
    const events = await Event.find().populate("organizer");
    return events;
  }
}

export default EventDao;
