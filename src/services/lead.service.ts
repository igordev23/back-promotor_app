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
// Atualiza um lead existente
// Atualiza um lead existente
async updateLead(
  promotorId: string,
  id: string,
  lead: Omit<Lead, 'id'>
): Promise<Lead> {
  try {
    console.log(`Iniciando atualização do lead com ID: ${id} pelo promotor: ${promotorId}`);

    // Busca o lead pelo ID
    const existingLead = await SupabaseRepository.leads.getById(promotorId, id);

    console.log(`Lead encontrado:`, existingLead);

    // Verifica se o lead existe
    if (!existingLead) {
      throw new Error(`Lead com ID ${id} não encontrado.`);
    }

    // Verifica se o lead pertence ao promotor autenticado
    if (existingLead.criadoPor !== promotorId) {
      throw new Error(
        `Acesso negado ao lead. O lead com ID ${id} não pertence ao promotor com ID ${promotorId}.`
      );
    }

    console.log(`Validação de acesso concluída. Atualizando lead...`);

    // Atualiza o lead
    const updatedLead = await SupabaseRepository.leads.update(promotorId, id, lead);

    console.log(`Lead atualizado com sucesso:`, updatedLead);

    return updatedLead;
  } catch (error) {
    console.error(`Erro ao atualizar o lead com ID ${id}:`, error);
    throw new Error(
      `Erro ao atualizar o lead com ID ${id}: ${
        error instanceof Error ? error.message : String(error)
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
        `Erro ao buscar leads do promotor com ID ${promotorId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
   // Obtém um lead pelo ID
  async getLeadById(promotorId: string, id: string): Promise<Lead> {
    try {
      const lead = await SupabaseRepository.leads.getById(promotorId, id);

      if (lead.criadoPor !== promotorId) {
        throw new Error('Acesso negado ao lead');
      }

      return lead;
    } catch (error) {
      throw new Error(
        `Erro ao buscar o lead com ID ${id}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
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
  const lead = await SupabaseRepository.leads.getByIdSupervisor(leadId);

  const promotor = await SupabaseRepository.promotores.getById(
    lead.criadoPor
  );

  if (promotor.supervisorId !== supervisorId) {
    throw new Error('Acesso negado a este lead');
  }

  return lead;
}

// Exclui um lead pelo ID
// Exclui um lead pelo ID
async deleteLead(promotorId: string, id: string): Promise<void> {
  try {
    // Busca o lead pelo ID para verificar a propriedade
    const lead = await SupabaseRepository.leads.getById(promotorId, id);

    // Verifica se o lead pertence ao promotor autenticado
    if (lead.criadoPor !== promotorId) {
      throw new Error('Acesso negado ao lead');
    }

    // Exclui o lead
    await SupabaseRepository.leads.delete(promotorId, id); // Pass both arguments
  } catch (error) {
    // Trata e lança um erro detalhado
    throw new Error(
      `Erro ao excluir o lead com ID ${id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
}

