import { Router } from 'express';
import { JornadaController } from '../controllers/jornada.controller';
import { LocalizacaoController } from '../controllers/localizacao.controller';
import { LeadController } from '../controllers/lead.controller';

const router = Router();

const jornadaController = new JornadaController();
const localizacaoController = new LocalizacaoController();
const leadController = new LeadController();

// Jornada
router.post('/jornada/iniciar', jornadaController.registrarPonto);
router.post('/jornada/finalizar', jornadaController.finalizarJornada);
router.get('/jornada/status', jornadaController.status);

// Localização (Promotor)
router.post('/localizacao', localizacaoController.registerLocation);

// Leads (Promotor)
router.post('/leads', leadController.createLead);
router.get('/leads', leadController.getLeadsByPromotor);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', leadController.updateLead);
router.delete('/leads/:id', leadController.deleteLead);

export default router;
