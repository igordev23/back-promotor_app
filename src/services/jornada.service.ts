import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Jornada } from '../types/jornada';

export class JornadaService {
  // Registra um novo ponto na jornada
  async registrarPonto(promotorId: string) {
    // 1️⃣ Verifica se já existe jornada ativa
    const jornadaAtiva =
      await SupabaseRepository.jornada.getJornadaAtiva(promotorId);

    if (jornadaAtiva) {
      throw new Error('Já existe uma jornada ativa');
    }

    // 2️⃣ Cria nova jornada
    return await SupabaseRepository.jornada.registrarPonto({
      promotor_id: promotorId,
      status: 'ativo',
    });
  }

  // Finaliza a jornada ativa do promotor
async finalizarJornada(promotorId: string): Promise<Jornada> {
  // 1️⃣ Busca jornada ativa
  const jornadaAtiva =
    await SupabaseRepository.jornada.getJornadaAtiva(promotorId);

  if (!jornadaAtiva) {
    throw new Error('Não existe jornada ativa para este promotor');
  }

  // 2️⃣ Finaliza a jornada encontrada
  return await SupabaseRepository.jornada.finalizarJornada(jornadaAtiva.id);
}

  // status atual da jornada
  async status(id: string): Promise<Jornada> {
    try {
      return await SupabaseRepository.jornada.getJornadaAtiva(id);
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
