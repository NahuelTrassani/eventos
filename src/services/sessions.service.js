import userRepository from "../repositories/users.repository.js";
import { createHash } from "../utils/hash.js";

export const register = async (userData) => {
  if (
    !userData.first_name ||
    !userData.last_name ||
    !userData.email ||
    !userData.password
  ) {
    const err = new Error("Todos los campos son obligatorios");
    err.statusCode = 400;
    throw err;
  }

  userData.email = userData.email.toLowerCase().trim();

  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    const err = new Error("El correo electrónico no es válido");
    err.statusCode = 400;
    throw err;
  }

  if (userData.password && userData.password.length < 6) {
    const err = new Error("La contraseña debe tener al menos 6 caracteres");
    err.statusCode = 400;
    throw err;
  }

  if (await userRepository.findByEmail(userData.email)) {
    const err = new Error("El correo electrónico ya está registrado");
    err.statusCode = 409;
    throw err;
  }

  const user = await userRepository.createUser({
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    password: await createHash(userData.password),
  });

  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
};
