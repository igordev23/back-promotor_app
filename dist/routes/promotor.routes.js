"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jornada_controller_1 = require("../controllers/jornada.controller");
const localizacao_controller_1 = require("../controllers/localizacao.controller");
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
const jornadaController = new jornada_controller_1.JornadaController();
const localizacaoController = new localizacao_controller_1.LocalizacaoController();
const leadController = new lead_controller_1.LeadController();
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
exports.default = router;
