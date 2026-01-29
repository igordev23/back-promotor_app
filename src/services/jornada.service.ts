import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Jornada } from '../types/jornada';

export class JornadaService {
  async iniciarJornada(promotorId: string): Promise<Jornada> {
    const jornadaAtiva = await SupabaseRepository.jornada.getJornadaAtiva(promotorId);
    if (jornadaAtiva) {
      throw new Error('Já existe uma jornada ativa para este promotor.');
    }

    const novaJornada = await SupabaseRepository.jornada.create({
      promotor_id: promotorId,
      status: 'ativo',
    });

    await SupabaseRepository.promotores.update(promotorId, { statusJornada: 'ativo' });

    return novaJornada;
  }

  async finalizarJornada(promotorId: string): Promise<Jornada> {
    const jornadaAtiva = await SupabaseRepository.jornada.getJornadaAtiva(promotorId);
    if (!jornadaAtiva) {
      throw new Error('Não existe jornada ativa para este promotor.');
    }

    const jornadaFinalizada = await SupabaseRepository.jornada.finalizar(jornadaAtiva.id);

    await SupabaseRepository.promotores.update(promotorId, { statusJornada: 'inativo' });

    return jornadaFinalizada;
  }

  async getStatusJornada(promotorId: string): Promise<Jornada | null> {
    return await SupabaseRepository.jornada.getJornadaAtiva(promotorId);
  }

  async getJornadaById(id: string): Promise<Jornada> {
    const jornada = await SupabaseRepository.jornada.getById(id);
    if (!jornada) {
      throw new Error(`Jornada com ID ${id} não encontrada.`);
    }
    return jornada;
  }

  async getJornadasByPromotor(promotorId: string): Promise<Jornada[]> {
    return await SupabaseRepository.jornada.getByPromotor(promotorId);
  }

  async updateJornada(id: string, jornadaData: Partial<Omit<Jornada, 'id'>>): Promise<Jornada> {
    const jornada = await this.getJornadaById(id); // Re-use getById to check existence
    return await SupabaseRepository.jornada.update(id, jornadaData);
  }

  async deleteJornada(id: string): Promise<void> {
    await this.getJornadaById(id); // Re-use getById to check existence
    await SupabaseRepository.jornada.delete(id);
  }
}
