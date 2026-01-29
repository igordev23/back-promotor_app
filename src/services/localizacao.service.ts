import { SupabaseRepository } from '../repositories/SupabaseUserRepository';
import { Localizacao } from '../types/localizacao';

export class LocalizacaoService {
  async registrarLocalizacao(
    promotorId: string,
    latitude: number,
    longitude: number
  ): Promise<Localizacao> {
    const localizacaoData: Omit<Localizacao, 'id'> = {
      promotorId,
      latitude,
      longitude,
      registrado_em: new Date().toISOString(),
    };

    // 1. Create the new location entry
    const novaLocalizacao = await SupabaseRepository.localizacao.create(localizacaoData);

    // 2. Update the promoter's last location
    const ultimaLocalizacao = {
      lat: latitude,
      lng: longitude,
      timestamp: new Date(novaLocalizacao.registrado_em).getTime(),
    };

    await SupabaseRepository.promotores.update(promotorId, {
      ultimaLocalizacao: ultimaLocalizacao,
    });

    return novaLocalizacao;
  }

  async updateLocalizacao(id: string, localizacao: Partial<Omit<Localizacao, 'id'>>): Promise<Localizacao> {
    const existingLocalizacao = await SupabaseRepository.localizacao.getById(id);
    if (!existingLocalizacao) {
      throw new Error(`Localização com ID ${id} não encontrada.`);
    }
    return await SupabaseRepository.localizacao.update(id, localizacao);
  }

  async getLocalizacoesHistoricoByPromotor(promotorId: string): Promise<Localizacao[]> {
    return await SupabaseRepository.localizacao.getHistoricoByPromotorId(promotorId);
  }

  async getLocalizacaoById(id: string): Promise<Localizacao> {
    const localizacao = await SupabaseRepository.localizacao.getById(id);
    if (!localizacao) {
      throw new Error(`Localização com ID ${id} não encontrada.`);
    }
    return localizacao;
  }

  async deleteLocalizacao(id: string): Promise<void> {
    const existingLocalizacao = await SupabaseRepository.localizacao.getById(id);
    if (!existingLocalizacao) {
      throw new Error(`Localização com ID ${id} não encontrada.`);
    }
    await SupabaseRepository.localizacao.delete(id);
  }

  async getLastLocalizacaoByPromotor(promotorId: string): Promise<Localizacao | null> {
    const localizacoes = await SupabaseRepository.localizacao.getHistoricoByPromotorId(promotorId);
    if (localizacoes.length === 0) {
      return null;
    }
    // Return the last element of the array
    return localizacoes[localizacoes.length - 1];
  }
}
