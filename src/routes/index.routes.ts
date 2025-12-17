import { Router } from 'express';
import promotorRoutes from './promotor.routes';
import supervisorRoutes from './supervisor.routes';
import jornadaRoutes from './jornada.routes';
import leadRoutes from './lead.routes';
import localizacaoRoutes from './localizacao.routes';

const router = Router();

// Rotas do módulo Promotor
router.use('/promotor', promotorRoutes);

// Rotas do módulo Supervisor
router.use('/supervisor', supervisorRoutes);

// Rotas de Jornada
router.use('/jornada', jornadaRoutes);

// Rotas de Leads
router.use('/leads', leadRoutes);

// Rotas de Localização
router.use('/localizacao', localizacaoRoutes);

export default router;
