import { Request, Response } from 'express';
import { PromotorService } from '../services/promotor.service';

const promotorService = new PromotorService();

export class PromotorController {
  // Obtém todos os promotores
  async getAllPromotores(req: Request, res: Response): Promise<void> {
    try {
      const promotores = await promotorService.getAllPromotores();
      res.status(200).json(promotores);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Obtém um promotor pelo ID
  async getPromotorById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const promotor = await promotorService.getPromotorById(id);
      res.status(200).json(promotor);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Cria um novo promotor
  async createPromotor(req: Request, res: Response): Promise<void> {
    try {
      const promotorData = req.body;
      const newPromotor = await promotorService.createPromotor(promotorData);
      res.status(201).json(newPromotor);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }
  // Atualiza um promotor existente
  async updatePromotor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const promotorData = req.body;
      await promotorService.updatePromotor(id, promotorData);
      res.status(200).json({ message: 'Promotor atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Atualiza a localização de um promotor
  async updatePromotorLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { lat, lng } = req.body;
      await promotorService.updatePromotorLocation(id, lat, lng);
      res.status(200).json({ message: 'Localização atualizada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Exclui um promotor pelo ID
  async deletePromotor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await promotorService.deletePromotor(id);
      res.status(200).json({ message: 'Promotor excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }
}
