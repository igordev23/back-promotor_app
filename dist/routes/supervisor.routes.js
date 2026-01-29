"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supervisor_controller_1 = require("../controllers/supervisor.controller");
const promotor_controller_1 = require("../controllers/promotor.controller");
const localizacao_controller_1 = require("../controllers/localizacao.controller");
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const supervisorController = new supervisor_controller_1.SupervisorController();
const promotorController = new promotor_controller_1.PromotorController();
const localizacaoController = new localizacao_controller_1.LocalizacaoController();
const leadController = new lead_controller_1.LeadController();
// Supervisores (DEV)
router.get('/supervisores', supervisorController.getAllSupervisors);
router.get('/supervisores/:id', supervisorController.getSupervisorById);
router.post('/supervisores', supervisorController.createSupervisor);
router.put('/supervisores/:id', supervisorController.updateSupervisor);
router.delete('/supervisores/:id', supervisorController.deleteSupervisor);
// Dashboard (Supervisor autenticado)
router.get('/dashboard', auth_middleware_1.authMiddleware, supervisorController.getDashboardData);
router.get('/promotores/:id/leads', auth_middleware_1.authMiddleware, leadController.getLeadsByPromotorSupervisor);
router.put('/leads/:id', auth_middleware_1.authMiddleware, leadController.updateLead);
router.delete('/leads/:id', auth_middleware_1.authMiddleware, leadController.deleteLead);
// Promotores (Supervisor autenticado)
router.post('/promotores', auth_middleware_1.authMiddleware, promotorController.createPromotor);
router.get('/promotores', auth_middleware_1.authMiddleware, promotorController.getPromotoresDoSupervisor);
router.get('/promotores/:id', auth_middleware_1.authMiddleware, promotorController.getPromotorById);
router.put('/promotores/:id', auth_middleware_1.authMiddleware, promotorController.updatePromotor);
router.delete('/promotores/:id', auth_middleware_1.authMiddleware, promotorController.deletePromotor);
// Localização
router.get('/promotores/:id/localizacao-atual', auth_middleware_1.authMiddleware, localizacaoController.getLastLocation);
router.get('/promotores/:id/historico-localizacao', auth_middleware_1.authMiddleware, localizacaoController.getLocationHistory);
// Leads (Supervisor)
router.get('/leads', auth_middleware_1.authMiddleware, leadController.getAllLeadsDoSupervisor);
router.get('/leads/:id', auth_middleware_1.authMiddleware, leadController.getLeadByIdSupervisor);
router.get('/promotores/:id/leads', auth_middleware_1.authMiddleware, leadController.getLeadsByPromotorSupervisor);
exports.default = router;
