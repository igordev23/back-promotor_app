"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const lead_service_1 = require("../services/lead.service");
const date_service_1 = require("../services/date.service");
const leadService = new lead_service_1.LeadService();
class LeadController {
    // Cria um novo lead
    createLead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promotorId = req.user.id; // 🔥 vem do token
                const lead = yield leadService.createLead(promotorId, req.body);
                // Formatar a data de criação do lead
                const leadFormatado = Object.assign(Object.assign({}, lead), { criadoEm: (0, date_service_1.formatarParaBrasil)(new Date(lead.criadoEm)) });
                res.status(201).json(leadFormatado);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Atualiza um lead existente
    updateLead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { id } = req.params;
                const leadData = req.body;
                const lead = yield leadService.updateLead(userId, id, leadData);
                const leadFormatado = Object.assign(Object.assign({}, lead), { criadoEm: (0, date_service_1.formatarParaBrasil)(new Date(lead.criadoEm)) });
                res.status(200).json(leadFormatado);
            }
            catch (error) {
                res.status(500).json({
                    error: `Erro ao atualizar o lead com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        });
    }
    // Obtém todos os leads criados por um promotor
    getLeadsByPromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promotorId = req.user.id; // 🔥 vem do token
                const leads = yield leadService.getLeadsByPromotor(promotorId);
                // Formatar as datas de criação dos leads
                const leadsFormatados = leads.map((lead) => (Object.assign(Object.assign({}, lead), { criadoEm: (0, date_service_1.formatarParaBrasil)(new Date(lead.criadoEm)) })));
                res.status(200).json(leadsFormatados);
            }
            catch (error) {
                res.status(500).json({
                    error: `Erro ao buscar leads do promotor com ID ${req.user.id}: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        });
    }
    getLeadsByPromotorSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisorId = req.user.id;
                const { id: promotorId } = req.params;
                const leads = yield leadService.getLeadsByPromotorSupervisor(supervisorId, promotorId);
                res.json(leads);
            }
            catch (error) {
                res.status(403).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    getAllLeadsDoSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisorId = req.user.id;
                const leads = yield leadService.getAllLeadsBySupervisor(supervisorId);
                res.json(leads);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    getLeadByIdSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisorId = req.user.id;
                const { id } = req.params;
                const lead = yield leadService.getLeadByIdSupervisor(supervisorId, id);
                res.json(lead);
            }
            catch (error) {
                res.status(403).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Obtém um lead pelo ID
    getLeadById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promotorId = req.user.id; // 🔥 vem do token
                const { id } = req.params;
                const lead = yield leadService.getLeadById(promotorId, id);
                // Formatar a data de criação do lead
                const leadFormatado = Object.assign(Object.assign({}, lead), { criadoEm: (0, date_service_1.formatarParaBrasil)(new Date(lead.criadoEm)) });
                res.status(200).json(leadFormatado);
            }
            catch (error) {
                res.status(500).json({
                    error: `Erro ao buscar o lead com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        });
    }
    // Exclui um lead pelo ID
    deleteLead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { id } = req.params;
                yield leadService.deleteLead(userId, id);
                res.status(200).json({ message: `Lead com ID ${id} foi deletado com sucesso.` });
            }
            catch (error) {
                res.status(500).json({
                    error: `Erro ao excluir o lead com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        });
    }
}
exports.LeadController = LeadController;
