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

  // Exclui um lead pelo ID
  async deleteLead(id: string): Promise<void> {
    try {
      await SupabaseRepository.leads.delete(id);
    } catch (error) {
      throw new Error(`Erro ao excluir o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
