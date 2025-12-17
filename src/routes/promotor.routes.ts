import { Router } from 'express';
import { PromotorController } from '../controllers/promotor.controller';
import jornadaRoutes from './jornada.routes';
import localizacaoRoutes from './localizacao.routes';
import leadRoutes from './lead.routes';

const router = Router();
const promotorController = new PromotorController();

// Rotas para Promotores
router.get('/', (req, res) => promotorController.getAllPromotores(req, res)); // Lista todos os promotores
router.get('/:id', (req, res) => promotorController.getPromotorById(req, res)); // Obtém um promotor pelo ID
router.post('/', (req, res) => promotorController.createPromotor(req, res)); // Cria um novo promotor
router.put('/:id/localizacao', (req, res) => promotorController.updatePromotorLocation(req, res)); // Atualiza a localização de um promotor
router.delete('/:id', (req, res) => promotorController.deletePromotor(req, res)); // Exclui um promotor pelo ID

// Reutilização de rotas existentes
router.use('/jornada', jornadaRoutes); // Rotas de Jornada
router.use('/localizacao', localizacaoRoutes); // Rotas de Localização
router.use('/leads', leadRoutes); // Rotas de Leads

export default router;
