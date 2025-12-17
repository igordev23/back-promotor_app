import { Request, Response } from 'express';
import SupabaseUserRepository from '../repositories/SupabaseUserRepository';

const userRepository = new SupabaseUserRepository();

export default class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userRepository.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.getUsers();
      res.status(200).json(users);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await userRepository.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(404).json({ error: message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await userRepository.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await userRepository.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }
}
