import { Request, Response } from 'express';
import { LocalizacaoService } from '../services/localizacao.service';
import { formatarParaBrasil } from '../services/date.service';
const localizacaoService = new LocalizacaoService();

export class LocalizacaoController {
  // Registra uma nova localização
 async registerLocation(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      res.status(400).json({ error: 'Latitude e longitude inválidas' });
      return;
    }

    const promotorId = req.user.id;

    const location = await localizacaoService.registrarLocalizacao(
      promotorId,
      latitude,
      longitude
    );

    // ✅ CONVERSÃO PARA HORÁRIO DO BRASIL
    res.status(201).json({
      ...location,
      registrado_em: formatarParaBrasil(location.registrado_em),
    });

  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}



  // Obtém a última localização de um promotor
  async getLastLocation(req: Request, res: Response): Promise<void> {
    try {
      const { idPromotor } = req.params;
      const location = await localizacaoService.getLastLocalizacaoByPromotor(idPromotor);
      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar última localização do promotor com ID ${req.params.idPromotor}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Obtém o histórico de localizações de um promotor
  async getLocationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { idPromotor } = req.params;
      const locations = await localizacaoService.getLocalizacoesHistoricoByPromotor(idPromotor);
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar histórico de localizações do promotor com ID ${req.params.idPromotor}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
}
