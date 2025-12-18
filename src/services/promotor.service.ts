import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Promotor } from '../types/promotor';
import { CreatePromotorDTO } from '../dto/create-promotor.dto';


export class PromotorService {
  // Obtém todos os promotores
  async getAllPromotores(): Promise<Promotor[]> {
    try {
      return await SupabaseRepository.promotores.getAll();
    } catch (error) {
      throw new Error(`Erro ao buscar promotores: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async getPromotoresBySupervisor(supervisorId: string): Promise<Promotor[]> {
  try {
    return await SupabaseRepository.promotores.getBySupervisorId(supervisorId);
  } catch (error) {
    throw new Error(
      `Erro ao buscar promotores do supervisor ${supervisorId}`
    );
  }
}


  // Obtém um promotor pelo ID
  async getPromotorById(id: string): Promise<Promotor> {
    try {
      return await SupabaseRepository.promotores.getById(id);
    } catch (error) {
      throw new Error(`Erro ao buscar o promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Cria um novo promotor
  async createPromotor(data: CreatePromotorDTO): Promise<Promotor> {
    try {
      return await SupabaseRepository.promotores.create(data);
    } catch (error) {
      throw new Error(`Erro ao criar promotor: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // Atualiza um promotor existente
  async updatePromotor(id: string, promotor: Omit<Promotor, 'id'>): Promise<void> {
    try {
      await SupabaseRepository.promotores.update(id, promotor);
    } catch (error) {
      throw new Error(`Erro ao atualizar o promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Atualiza a localização de um promotor
  async updatePromotorLocation(id: string, lat: number, lng: number): Promise<void> {
    try {
      await SupabaseRepository.promotores.updateLocalizacao(id, lat, lng);
    } catch (error) {
      throw new Error(`Erro ao atualizar a localização do promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Exclui um promotor pelo ID
  async deletePromotor(id: string): Promise<void> {
    try {
      await SupabaseRepository.promotores.delete(id);
    } catch (error) {
      throw new Error(`Erro ao excluir o promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
