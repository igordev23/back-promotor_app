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
  // Obtém promotores do supervisor autenticado
  async getPromotoresDoSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const supervisorId = req.user!.id;

      const promotores =
        await promotorService.getPromotoresBySupervisor(supervisorId);

      res.status(200).json(promotores);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }


  // Obtém um promotor pelo ID
  async getPromotorById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const supervisorId = req.user!.id;

      const promotor = await promotorService.getPromotorById(id);

      // 🔒 VERIFICAÇÃO DE POSSE
      if (promotor.supervisorId !== supervisorId) {
        res.status(403).json({ error: 'Acesso negado a este promotor' });
        return;
      }

      res.status(200).json(promotor);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
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
    const { id } = req.params;
    const supervisorId = req.user!.id;

    const promotor = await promotorService.getPromotorById(id);

    if (promotor.supervisorId !== supervisorId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    await promotorService.updatePromotor(id, req.body);
    res.json({ message: 'Promotor atualizado com sucesso' });
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
    const { id } = req.params;
    const supervisorId = req.user!.id;

    const promotor = await promotorService.getPromotorById(id);

    if (promotor.supervisorId !== supervisorId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    await promotorService.deletePromotor(id);
    res.json({ message: 'Promotor excluído com sucesso' });
  }

}
