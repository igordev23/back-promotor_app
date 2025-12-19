import { Request, Response } from 'express';
import { JornadaService } from '../services/jornada.service';
import { formatarParaBrasil } from '../services/date.service';
const jornadaService = new JornadaService();

export class JornadaController {
  // Registra um novo ponto na jornada
  async registrarPonto(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const promotorId = req.user.id; // ✅ string UUID

      const jornada = await jornadaService.registrarPonto(promotorId);

      // Formata a data de início antes de retornar
      jornada.inicio = formatarParaBrasil(jornada.inicio);

      res.status(201).json(jornada);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      });
    }
  }

 // Finaliza a jornada ATIVA do promotor
  async finalizarJornada(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const promotorId = req.user.id;

      const jornada = await jornadaService.finalizarJornada(promotorId);

      // Cria um novo objeto com as datas formatadas
      const jornadaFormatada = {
        ...jornada,
        inicio: formatarParaBrasil(new Date(jornada.inicio)), // Converte o timestamp para Date
        fim: jornada.fim ? formatarParaBrasil(new Date(jornada.fim)) : null, // Converte o timestamp para Date
      };

      res.status(200).json(jornadaFormatada);
    } catch (error) {
      console.error('ERRO REAL:', error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : JSON.stringify(error),
      });
    }
  }


// Status atual da jornada (PROMOTOR)
async status(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    const promotorId = req.user.id;

    const jornada = await jornadaService.status(promotorId);

    if (!jornada) {
      res.status(404).json({ message: 'Nenhuma jornada ativa encontrada para este promotor.' });
      return;
    }

    // Formatar as datas antes de enviar na resposta
    const jornadaFormatada = {
      ...jornada,
      inicio: formatarParaBrasil(new Date(jornada.inicio)),
      fim: jornada.fim ? formatarParaBrasil(new Date(jornada.fim)) : null,
    };

    res.status(200).json(jornadaFormatada);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}


  // Atualiza uma jornada existente
  async updateJornada(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const jornada = await jornadaService.updateJornada(id, req.body);
      res.status(200).json(jornada);
    } catch (error) {
      res.status(500).json({ error: `Erro ao atualizar jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Obtém todas as jornadas de um promotor
  async getJornadasByPromotor(req: Request, res: Response): Promise<void> {
    try {
      const { promotorId } = req.params;
      const jornadas = await jornadaService.getJornadasByPromotor(promotorId);
      res.status(200).json(jornadas);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar jornadas do promotor com ID ${req.params.promotorId}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Obtém uma jornada específica pelo ID
  async getJornadaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const jornada = await jornadaService.getJornadaById(id);
      res.status(200).json(jornada);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }

  // Exclui uma jornada pelo ID
  async deleteJornada(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await jornadaService.deleteJornada(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: `Erro ao excluir jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
}
