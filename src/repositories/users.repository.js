import UserDao from "../dao/users.dao.js";

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(userData) {
    return this.dao.createUser(userData);
  }

  async findByEmail(email) {
    return this.dao.findByEmail(email);
  }
}

export default new UserRepository(UserDao);
