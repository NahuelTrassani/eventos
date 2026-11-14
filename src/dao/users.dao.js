import User from "../models/User.js";

class UserDao {
  static async getUsers() {
    const users = await User.find();
    return users;
  }

  static async createUser(userData) {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  static async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
}

export default UserDao;
