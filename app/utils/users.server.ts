import bcrypt from "bcrypt";
import { db } from "./db.server";

export async function registerUser(username: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { username, password: hash },
  });
}

// export async function findUserByUsername(username: string) {
//   return db.user.findUnique({ where: { username } });
// }


// export async function verifyUser(username: string, password: string) {
//   const user = await findUserByUsername(username);
//   if (!user) return null;
//   const isValid = await bcrypt.compare(password, user.password);
//   return isValid ? user : null;
// }
