import { db } from "../config/firebase";
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  DataSnapshot,
} from "firebase/database";

export interface IUser {
  name: string;
  email?: string;
}

export default class UserRepository {
  async createUser(data: IUser) {
    const userRef = push(ref(db, "users"));
    await set(userRef, data);

    return { id: userRef.key, ...data };
  }

  async getUsers() {
    const snapshot: DataSnapshot = await get(ref(db, "users"));
    return snapshot.exists() ? snapshot.val() : {};
  }

  async getUserById(id: string) {
    const snapshot: DataSnapshot = await get(ref(db, `users/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  async updateUser(id: string, data: Partial<IUser>) {
    await update(ref(db, `users/${id}`), data);
    return { id, ...data };
  }

  async deleteUser(id: string) {
    await remove(ref(db, `users/${id}`));
    return true;
  }
}
