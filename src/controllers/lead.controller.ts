import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';

const leadService = new LeadService();

export class LeadController {
  // Cria um novo lead
    async createLead(req: Request, res: Response): Promise<void> {
    try {
      const promotorId = req.user!.id; // 🔥 vem do token
      const lead = await leadService.createLead(promotorId, req.body);
      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Atualiza um lead existente
  async updateLead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await leadService.updateLead(id, req.body);
      res.status(200).json(lead);
    } catch (error) {
      res.status(500).json({ error: `Erro ao atualizar o lead com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Obtém todos os leads criados por um promotor
  async getLeadsByPromotor(req: Request, res: Response): Promise<void> {
    try {
      const { promotorId } = req.params;
      const leads = await leadService.getLeadsByPromotor(promotorId);
      res.status(200).json(leads);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar leads do promotor com ID ${req.params.promotorId}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Obtém um lead pelo ID
  async getLeadById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await leadService.getLeadById(id);
      res.status(200).json(lead);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar o lead com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Exclui um lead pelo ID
  async deleteLead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await leadService.deleteLead(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: `Erro ao excluir o lead com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
}
