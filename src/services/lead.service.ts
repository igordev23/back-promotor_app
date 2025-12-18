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
        `Erro ao criar lead: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }


  // Atualiza um lead existente
  async updateLead(id: string, lead: Omit<Lead, 'id'>): Promise<Lead> {
    try {
      return await SupabaseRepository.leads.update(id, lead);
    } catch (error) {
      throw new Error(`Erro ao atualizar o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Obtém todos os leads criados por um promotor
  async getLeadsByPromotor(promotorId: string): Promise<Lead[]> {
    try {
      return await SupabaseRepository.leads.getByPromotor(promotorId);
    } catch (error) {
      throw new Error(`Erro ao buscar leads do promotor com ID ${promotorId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Obtém um lead pelo ID
  async getLeadById(id: string): Promise<Lead> {
    try {
      return await SupabaseRepository.leads.getById(id);
    } catch (error) {
      throw new Error(`Erro ao buscar o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getAllLeadsBySupervisor(supervisorId: string) {
  return SupabaseRepository.leads.getBySupervisor(supervisorId);
}

async getLeadsByPromotorSupervisor(
  supervisorId: string,
  promotorId: string
) {
  const promotor = await SupabaseRepository.promotores.getById(promotorId);

  if (promotor.supervisorId !== supervisorId) {
    throw new Error('Acesso negado a este promotor');
  }

  return SupabaseRepository.leads.getByPromotor(promotorId);
}

async getLeadByIdSupervisor(supervisorId: string, leadId: string) {
  const lead = await SupabaseRepository.leads.getById(leadId);

  const promotor = await SupabaseRepository.promotores.getById(
    lead.criadoPor
  );

  if (promotor.supervisorId !== supervisorId) {
    throw new Error('Acesso negado a este lead');
  }

  return lead;
}


  // Exclui um lead pelo ID
  async deleteLead(id: string): Promise<void> {
    try {
      await SupabaseRepository.leads.delete(id);
    } catch (error) {
      throw new Error(`Erro ao excluir o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
