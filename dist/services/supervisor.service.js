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
const SupabaseUserRepository_1 = require("../repositories/SupabaseUserRepository");
class SupervisorService {
    getAllSupervisors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.supervisores.getAll();
            }
            catch (error) {
                console.error('Erro ao buscar supervisores:', error instanceof Error ? error.message : String(error));
                throw new Error('Falha ao buscar supervisores');
            }
        });
    }
    getSupervisorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.supervisores.getById(id);
            }
            catch (error) {
                console.error(`Erro ao buscar supervisor com ID ${id}:`, error instanceof Error ? error.message : String(error));
                throw new Error('Falha ao buscar supervisor');
            }
        });
    }
    createSupervisor(supervisor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.supervisores.create(supervisor);
            }
            catch (error) {
                console.error('Erro ao criar supervisor:', error instanceof Error ? error.message : String(error));
                throw new Error('Falha ao criar supervisor');
            }
        });
    }
    updateSupervisor(id, supervisor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.supervisores.update(id, supervisor);
            }
            catch (error) {
                console.error(`Erro ao atualizar supervisor com ID ${id}:`, error instanceof Error ? error.message : String(error));
                throw new Error('Falha ao atualizar supervisor');
            }
        });
    }
    deleteSupervisor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SupabaseUserRepository_1.SupabaseRepository.supervisores.delete(id);
            }
            catch (error) {
                console.error(`Erro ao deletar supervisor com ID ${id}:`, error instanceof Error ? error.message : String(error));
                throw new Error('Falha ao deletar supervisor');
            }
        });
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.dashboard.getDashboardData();
            }
            catch (error) {
                console.error('Erro ao buscar dados do dashboard:', error instanceof Error ? error.message : String(error));
                throw new Error('Falha ao buscar dados do dashboard');
            }
        });
    }
}
exports.default = SupervisorService;
