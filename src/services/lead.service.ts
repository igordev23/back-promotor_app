import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Lead } from '../types/lead';
import { CreateLeadDTO } from '../dto/create-lead.dto';

export class LeadService {
  // Cria um novo lead
  async createLead(
    promotorId: string,
    data: CreateLeadDTO
  ): Promise<Lead> {
    try {
      return await SupabaseRepository.leads.create(promotorId, data);
    } catch (error) {
      throw new Error(
        `Erro ao criar lead: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }


  // Atualiza um lead existente
  // Atualiza um lead existente
  // Atualiza um lead existente
  async updateLead(
    userId: string,
    id: string,
    leadData: Omit<Lead, 'id' | 'criadoPor' | 'criadoEm'>
  ): Promise<Lead> {
    try {
      const existingLead = await SupabaseRepository.leads.getById(id);
      if (!existingLead) {
        throw new Error(`Lead com ID ${id} não encontrado.`);
      }

      const isOwner = existingLead.criadoPor === userId;
      const isSupervisor = await SupabaseRepository.user.isSupervisor(userId);

      let hasPermission = isOwner;

      if (!hasPermission && isSupervisor) {
        const promotor = await SupabaseRepository.promotores.getById(existingLead.criadoPor);
        if (promotor.supervisorId === userId) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        throw new Error(
          `Acesso negado. Você não tem permissão para atualizar este lead.`
        );
      }

      return await SupabaseRepository.leads.update(id, leadData);

    } catch (error) {
      console.error(`Erro ao atualizar o lead com ID ${id}:`, error);
      throw new Error(
        `Erro ao atualizar o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Obtém todos os leads criados por um promotor
  async getLeadsByPromotor(promotorId: string): Promise<Lead[]> {
    try {
      return await SupabaseRepository.leads.getByPromotor(promotorId);
    } catch (error) {
      throw new Error(
        `Erro ao buscar leads do promotor com ID ${promotorId}: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Obtém um lead pelo ID para um promotor
  async getLeadById(promotorId: string, id: string): Promise<Lead> {
    try {
      const lead = await SupabaseRepository.leads.getById(id);

      if (!lead) {
        throw new Error(`Lead com ID ${id} não encontrado.`);
      }

      if (lead.criadoPor !== promotorId) {
        throw new Error('Acesso negado ao lead');
      }

      return lead;
    } catch (error) {
      throw new Error(
        `Erro ao buscar o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Obtém todos os leads de uma equipe de um supervisor
  async getAllLeadsBySupervisor(supervisorId: string): Promise<Lead[]> {
    return SupabaseRepository.leads.getBySupervisor(supervisorId);
  }

  // Obtém os leads de um promotor específico (requer que o supervisor seja o "dono" do promotor)
  async getLeadsByPromotorSupervisor(
    supervisorId: string,
    promotorId: string
  ): Promise<Lead[]> {
    const promotor = await SupabaseRepository.promotores.getById(promotorId);

    if (promotor.supervisorId !== supervisorId) {
      throw new Error('Acesso negado a este promotor');
    }

    return SupabaseRepository.leads.getByPromotor(promotorId);
  }

  // Obtém um lead específico (requer que o supervisor seja o "dono" do promotor que criou o lead)
  async getLeadByIdSupervisor(supervisorId: string, leadId: string): Promise<Lead> {
    const lead = await SupabaseRepository.leads.getById(leadId);

    if (!lead) {
      throw new Error(`Lead com ID ${leadId} não encontrado.`);
    }

    const promotor = await SupabaseRepository.promotores.getById(
      lead.criadoPor
    );

    if (promotor.supervisorId !== supervisorId) {
      throw new Error('Acesso negado a este lead');
    }

    return lead;
  }

  // Exclui um lead pelo ID
  async deleteLead(userId: string, id: string): Promise<void> {
    try {
      const lead = await SupabaseRepository.leads.getById(id);
      if (!lead) {
        throw new Error(`Lead com ID ${id} não encontrado.`);
      }

      const isOwner = lead.criadoPor === userId;
      const isSupervisor = await SupabaseRepository.user.isSupervisor(userId);

      let hasPermission = isOwner;

      if (!hasPermission && isSupervisor) {
        const promotor = await SupabaseRepository.promotores.getById(lead.criadoPor);
        if (promotor.supervisorId === userId) {
          hasPermission = true;
        }
      }

      if (!hasPermission) {
        throw new Error('Acesso negado para excluir este lead');
      }

      await SupabaseRepository.leads.delete(id);

    } catch (error) {
      throw new Error(
        `Erro ao excluir o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
