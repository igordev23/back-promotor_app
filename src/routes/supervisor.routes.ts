import { Router } from 'express';
import { SupervisorController } from '../controllers/supervisor.controller';
import { PromotorController } from '../controllers/promotor.controller';
import { LocalizacaoController } from '../controllers/localizacao.controller';
import { LeadController } from '../controllers/lead.controller';

const router = Router();

const supervisorController = new SupervisorController();
const promotorController = new PromotorController();
const localizacaoController = new LocalizacaoController();
const leadController = new LeadController();

// Dashboard
router.get('/dashboard', supervisorController.getDashboardData);

// Promotores
router.post('/promotores', promotorController.createPromotor);
router.get('/promotores', promotorController.getAllPromotores);
router.get('/promotores/:id', promotorController.getPromotorById);
router.put('/promotores/:id', promotorController.updatePromotor);
router.delete('/promotores/:id', promotorController.deletePromotor);

// Localização (Supervisor)
router.get(
  '/promotores/:id/localizacao-atual',
  localizacaoController.getLastLocation
);
router.get(
  '/promotores/:id/historico-localizacao',
  localizacaoController.getLocationHistory
);

// Leads (Supervisor)
router.get('/leads', leadController.getLeadsByPromotor);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', leadController.updateLead);
router.delete('/leads/:id', leadController.deleteLead);

export default router;
