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
exports.LeadService = void 0;
const SupabaseUserRepository_1 = require("../repositories/SupabaseUserRepository");
class LeadService {
    // Cria um novo lead
    createLead(promotorId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.leads.create(promotorId, data);
            }
            catch (error) {
                throw new Error(`Erro ao criar lead: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Atualiza um lead existente
    // Atualiza um lead existente
    // Atualiza um lead existente
    updateLead(userId, id, leadData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLead = yield SupabaseUserRepository_1.SupabaseRepository.leads.getById(id);
                if (!existingLead) {
                    throw new Error(`Lead com ID ${id} não encontrado.`);
                }
                const isOwner = existingLead.criadoPor === userId;
                const isSupervisor = yield SupabaseUserRepository_1.SupabaseRepository.user.isSupervisor(userId);
                let hasPermission = isOwner;
                if (!hasPermission && isSupervisor) {
                    const promotor = yield SupabaseUserRepository_1.SupabaseRepository.promotores.getById(existingLead.criadoPor);
                    if (promotor.supervisorId === userId) {
                        hasPermission = true;
                    }
                }
                if (!hasPermission) {
                    throw new Error(`Acesso negado. Você não tem permissão para atualizar este lead.`);
                }
                return yield SupabaseUserRepository_1.SupabaseRepository.leads.update(id, leadData);
            }
            catch (error) {
                console.error(`Erro ao atualizar o lead com ID ${id}:`, error);
                throw new Error(`Erro ao atualizar o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Obtém todos os leads criados por um promotor
    getLeadsByPromotor(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.leads.getByPromotor(promotorId);
            }
            catch (error) {
                throw new Error(`Erro ao buscar leads do promotor com ID ${promotorId}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Obtém um lead pelo ID para um promotor
    getLeadById(promotorId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lead = yield SupabaseUserRepository_1.SupabaseRepository.leads.getById(id);
                if (!lead) {
                    throw new Error(`Lead com ID ${id} não encontrado.`);
                }
                if (lead.criadoPor !== promotorId) {
                    throw new Error('Acesso negado ao lead');
                }
                return lead;
            }
            catch (error) {
                throw new Error(`Erro ao buscar o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Obtém todos os leads de uma equipe de um supervisor
    getAllLeadsBySupervisor(supervisorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return SupabaseUserRepository_1.SupabaseRepository.leads.getBySupervisor(supervisorId);
        });
    }
    // Obtém os leads de um promotor específico (requer que o supervisor seja o "dono" do promotor)
    getLeadsByPromotorSupervisor(supervisorId, promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotor = yield SupabaseUserRepository_1.SupabaseRepository.promotores.getById(promotorId);
            if (promotor.supervisorId !== supervisorId) {
                throw new Error('Acesso negado a este promotor');
            }
            return SupabaseUserRepository_1.SupabaseRepository.leads.getByPromotor(promotorId);
        });
    }
    // Obtém um lead específico (requer que o supervisor seja o "dono" do promotor que criou o lead)
    getLeadByIdSupervisor(supervisorId, leadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield SupabaseUserRepository_1.SupabaseRepository.leads.getById(leadId);
            if (!lead) {
                throw new Error(`Lead com ID ${leadId} não encontrado.`);
            }
            const promotor = yield SupabaseUserRepository_1.SupabaseRepository.promotores.getById(lead.criadoPor);
            if (promotor.supervisorId !== supervisorId) {
                throw new Error('Acesso negado a este lead');
            }
            return lead;
        });
    }
    // Exclui um lead pelo ID
    deleteLead(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lead = yield SupabaseUserRepository_1.SupabaseRepository.leads.getById(id);
                if (!lead) {
                    throw new Error(`Lead com ID ${id} não encontrado.`);
                }
                const isOwner = lead.criadoPor === userId;
                const isSupervisor = yield SupabaseUserRepository_1.SupabaseRepository.user.isSupervisor(userId);
                let hasPermission = isOwner;
                if (!hasPermission && isSupervisor) {
                    const promotor = yield SupabaseUserRepository_1.SupabaseRepository.promotores.getById(lead.criadoPor);
                    if (promotor.supervisorId === userId) {
                        hasPermission = true;
                    }
                }
                if (!hasPermission) {
                    throw new Error('Acesso negado para excluir este lead');
                }
                yield SupabaseUserRepository_1.SupabaseRepository.leads.delete(id);
            }
            catch (error) {
                throw new Error(`Erro ao excluir o lead com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.LeadService = LeadService;
