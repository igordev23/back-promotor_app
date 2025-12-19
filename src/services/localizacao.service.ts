import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Localizacao } from '../types/localizacao';

export class LocalizacaoService {
  // Registra uma nova localização
  async registrarLocalizacao(
  promotorId: string,
  latitude: number,
  longitude: number
): Promise<Localizacao> {
  const localizacao: Localizacao = {
    promotorId,
    latitude,
    longitude,
    registrado_em: new Date().toISOString(),
  };

  return await SupabaseRepository.localizacao.registrar(localizacao);
}


  // Atualiza uma localização existente
  async updateLocalizacao(id: string, localizacao: Omit<Localizacao, 'id'>): Promise<Localizacao> {
    try {
      return await SupabaseRepository.localizacao.update(id, localizacao);
    } catch (error) {
      throw new Error(`Erro ao atualizar localização com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Obtém todas as localizações de um promotor
  async getLocalizacoesHistoricoByPromotor(promotorId: string): Promise<Localizacao[]> {
    try {
      return await SupabaseRepository.localizacao.getByPromotor(promotorId);
    } catch (error) {
      throw new Error(`Erro ao buscar localizações do promotor com ID ${promotorId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Obtém uma localização específica pelo ID
  async getLocalizacaoById(id: string): Promise<Localizacao> {
    try {
      return await SupabaseRepository.localizacao.getById(id);
    } catch (error) {
      throw new Error(`Erro ao buscar localização com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Exclui uma localização pelo ID
  async deleteLocalizacao(id: string): Promise<void> {
    try {
      await SupabaseRepository.localizacao.delete(id);
    } catch (error) {
      throw new Error(`Erro ao excluir localização com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async getLastLocalizacaoByPromotor(promotorId: string): Promise<Localizacao | null> {
    try {
      const localizacoes = await SupabaseRepository.localizacao.getByPromotor(promotorId);
      return localizacoes && localizacoes.length > 0 ? localizacoes[localizacoes.length - 1] : null;
    } catch (error) {
      throw new Error(`Erro ao buscar última localização do promotor com ID ${promotorId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
