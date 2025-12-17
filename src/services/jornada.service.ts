import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Jornada } from '../types/jornada';

export class JornadaService {
  // Registra um novo ponto na jornada
  async registrarPonto(jornada: Jornada): Promise<Jornada> {
    try {
      const result = await SupabaseRepository.jornada.registrarPonto(jornada);
      if (!result) {
        throw new Error('Falha ao registrar ponto na jornada');
      }
      return result;
    } catch (error) {
      throw new Error(`Erro ao registrar ponto na jornada: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // Finaliza uma jornada
  async finalizarJornada(id: string): Promise<Jornada> {
    try {
      return await SupabaseRepository.jornada.finalizarJornada(id);
    } catch (error) {
      throw new Error(`Erro ao finalizar jornada com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // status atual da jornada
  async status(id: string): Promise<Jornada> {
    try {
      return await SupabaseRepository.jornada.status(id);
    } catch (error) {
      throw new Error(`Erro ao obter status da jornada com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Atualiza uma jornada existente
  async updateJornada(id: string, jornada: Omit<Jornada, 'id'>): Promise<Jornada> {
    try {
      return await SupabaseRepository.jornada.update(id, jornada);
    } catch (error) {
      throw new Error(`Erro ao atualizar jornada com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Obtém todas as jornadas de um promotor
  async getJornadasByPromotor(promotorId: string): Promise<Jornada[]> {
    try {
      return await SupabaseRepository.jornada.getByPromotor(promotorId);
    } catch (error) {
      throw new Error(`Erro ao buscar jornadas do promotor com ID ${promotorId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Obtém uma jornada específica pelo ID
  async getJornadaById(id: string): Promise<Jornada> {
    try {
      return await SupabaseRepository.jornada.getById(id);
    } catch (error) {
      throw new Error(`Erro ao buscar jornada com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Exclui uma jornada pelo ID
  async deleteJornada(id: string): Promise<void> {
    try {
      await SupabaseRepository.jornada.delete(id);
    } catch (error) {
      throw new Error(`Erro ao excluir jornada com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
