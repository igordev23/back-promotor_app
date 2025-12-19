import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';
import { formatarParaBrasil } from '../services/date.service';


const leadService = new LeadService();

export class LeadController {
  // Cria um novo lead
  async createLead(req: Request, res: Response): Promise<void> {
    try {
      const promotorId = req.user!.id; // 🔥 vem do token
      const lead = await leadService.createLead(promotorId, req.body);

      // Formatar a data de criação do lead
      const leadFormatado = {
        ...lead,
        criadoEm: formatarParaBrasil(new Date(lead.criadoEm)),
      };

      res.status(201).json(leadFormatado);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Atualiza um lead existente
  async updateLead(req: Request, res: Response): Promise<void> {
    try {
      const promotorId = req.user!.id; // 🔥 vem do token
      const { id } = req.params;
      const lead = await leadService.updateLead(promotorId, id, req.body);

      // Formatar a data de atualização do lead
      const leadFormatado = {
        ...lead,
        criadoEm: formatarParaBrasil(new Date(lead.criadoEm)),
      };

      res.status(200).json(leadFormatado);
    } catch (error) {
      res.status(500).json({
        error: `Erro ao atualizar o lead com ID ${req.params.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }

  // Obtém todos os leads criados por um promotor
  async getLeadsByPromotor(req: Request, res: Response): Promise<void> {
    try {
      const promotorId = req.user!.id; // 🔥 vem do token
      const leads = await leadService.getLeadsByPromotor(promotorId);

      // Formatar as datas de criação dos leads
      const leadsFormatados = leads.map((lead) => ({
        ...lead,
        criadoEm: formatarParaBrasil(new Date(lead.criadoEm)),
      }));

      res.status(200).json(leadsFormatados);
    } catch (error) {
      res.status(500).json({
        error: `Erro ao buscar leads do promotor com ID ${req.user!.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }
async getLeadsByPromotorSupervisor(req: Request, res: Response) {
  try {
    const supervisorId = req.user!.id;
    const { id: promotorId } = req.params;

    const leads = await leadService.getLeadsByPromotorSupervisor(
      supervisorId,
      promotorId
    );

    res.json(leads);
  } catch (error) {
    res.status(403).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
async getAllLeadsDoSupervisor(req: Request, res: Response) {
  try {
    const supervisorId = req.user!.id;

    const leads = await leadService.getAllLeadsBySupervisor(supervisorId);

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async getLeadByIdSupervisor(req: Request, res: Response) {
  try {
    const supervisorId = req.user!.id;
    const { id } = req.params;

    const lead = await leadService.getLeadByIdSupervisor(
      supervisorId,
      id
    );

    res.json(lead);
  } catch (error) {
    res.status(403).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}



  // Obtém um lead pelo ID
  async getLeadById(req: Request, res: Response): Promise<void> {
    try {
      const promotorId = req.user!.id; // 🔥 vem do token
      const { id } = req.params;
      const lead = await leadService.getLeadById(promotorId, id);

      // Formatar a data de criação do lead
      const leadFormatado = {
        ...lead,
        criadoEm: formatarParaBrasil(new Date(lead.criadoEm)),
      };

      res.status(200).json(leadFormatado);
    } catch (error) {
      res.status(500).json({
        error: `Erro ao buscar o lead com ID ${req.params.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }

 // Exclui um lead pelo ID
async deleteLead(req: Request, res: Response): Promise<void> {
  try {
    const promotorId = req.user!.id; // 🔥 vem do token
    const { id } = req.params;
    await leadService.deleteLead(promotorId, id);
    res.status(200).json({ message: `Lead com ID ${id} foi deletado com sucesso.` });
  } catch (error) {
    res.status(500).json({
      error: `Erro ao excluir o lead com ID ${req.params.id}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}
}
