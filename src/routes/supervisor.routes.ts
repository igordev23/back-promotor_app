import { Router } from 'express';
import { SupervisorController } from '../controllers/supervisor.controller';
import { PromotorController } from '../controllers/promotor.controller';
import { LocalizacaoController } from '../controllers/localizacao.controller';
import { LeadController } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const supervisorController = new SupervisorController();
const promotorController = new PromotorController();
const localizacaoController = new LocalizacaoController();
const leadController = new LeadController();

// Supervisores (DEV)
router.get('/supervisores', supervisorController.getAllSupervisors);
router.get('/supervisores/:id', supervisorController.getSupervisorById);
router.post('/supervisores', supervisorController.createSupervisor);
router.delete('/supervisores/:id', supervisorController.deleteSupervisor);

// Dashboard (Supervisor autenticado)
router.get('/dashboard', authMiddleware, supervisorController.getDashboardData);

// Promotores (Supervisor autenticado)
router.post('/promotores', authMiddleware, promotorController.createPromotor);

router.get(
  '/promotores',
  authMiddleware,
  promotorController.getPromotoresDoSupervisor
);

router.get(
  '/promotores/:id',
  authMiddleware,
  promotorController.getPromotorById
);

router.put(
  '/promotores/:id',
  authMiddleware,
  promotorController.updatePromotor
);

router.delete(
  '/promotores/:id',
  authMiddleware,
  promotorController.deletePromotor
);

// Localização
router.get(
  '/promotores/:id/localizacao-atual',
  authMiddleware,
  localizacaoController.getLastLocation
);

router.get(
  '/promotores/:id/historico-localizacao',
  authMiddleware,
  localizacaoController.getLocationHistory
);

// Leads
router.get(
  '/leads',
  authMiddleware,
  leadController.getLeadsByPromotor
);

router.get(
  '/leads/:id',
  authMiddleware,
  leadController.getLeadById
);

export default router;
