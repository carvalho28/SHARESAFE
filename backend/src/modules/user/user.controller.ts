import { findUsers } from "./user.service";

export async function getUsersHandler() {
  const users = await findUsers();
  return users;
}
