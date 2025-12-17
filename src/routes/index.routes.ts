import { Router } from 'express';
import promotorRoutes from './promotor.routes';
import supervisorRoutes from './supervisor.routes';

const router = Router();

// WEB - Supervisor
router.use('/supervisor', supervisorRoutes);

// MOBILE - Promotor
router.use('/promotor', promotorRoutes);

export default router;
