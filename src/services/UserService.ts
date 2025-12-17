import UserRepository, { IUser } from "../repositories/UserRepository";

export default class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data: IUser) {
    if (!data.name) {
      throw new Error("Name is required");
    }
    return await this.repository.createUser(data);
  }

  async listUsers() {
    return await this.repository.getUsers();
  }

  async getUser(id: string) {
    return await this.repository.getUserById(id);
  }

  async updateUser(id: string, data: Partial<IUser>) {
    return await this.repository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return await this.repository.deleteUser(id);
  }
}
