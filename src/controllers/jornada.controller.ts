import { Request, Response } from 'express';
import { JornadaService } from '../services/jornada.service';

const jornadaService = new JornadaService();

export class JornadaController {
  // Registra um novo ponto na jornada
  async registrarPonto(req: Request, res: Response): Promise<void> {
    try {
      const jornada = await jornadaService.registrarPonto(req.body);
      res.status(201).json(jornada);
    } catch (error) {
      res.status(500).json({ error: `Erro ao registrar ponto na jornada: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
  // Finaliza uma jornada
  async finalizarJornada(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const jornada = await jornadaService.finalizarJornada(id);
      res.status(200).json(jornada);
    } catch (error) {
      res.status(500).json({ error: `Erro ao finalizar jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
  // Status atual da jornada
  async status(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const jornada = await jornadaService.status(id);
      res.status(200).json(jornada);
    } catch (error) {
      res.status(500).json({ error: `Erro ao obter status da jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
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
