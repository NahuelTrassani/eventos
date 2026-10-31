import EventDao from "../dao/events.dao.js";

class EventRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllEvents() {
    return this.dao.getAllEvents();
  }
}

export default new EventRepository(EventDao);
