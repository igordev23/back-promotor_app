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
exports.PromotorService = void 0;
const SupabaseUserRepository_1 = require("../repositories/SupabaseUserRepository");
class PromotorService {
    // Obtém todos os promotores
    getAllPromotores() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.promotores.getAll();
            }
            catch (error) {
                throw new Error(`Erro ao buscar promotores: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getPromotoresBySupervisor(supervisorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.promotores.getBySupervisorId(supervisorId);
            }
            catch (error) {
                throw new Error(`Erro ao buscar promotores do supervisor ${supervisorId}`);
            }
        });
    }
    // Obtém um promotor pelo ID
    getPromotorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.promotores.getById(id);
            }
            catch (error) {
                throw new Error(`Erro ao buscar o promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Cria um novo promotor
    createPromotor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SupabaseUserRepository_1.SupabaseRepository.promotores.create(data);
            }
            catch (error) {
                throw new Error(`Erro ao criar promotor: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Atualiza um promotor existente
    updatePromotor(id, promotor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SupabaseUserRepository_1.SupabaseRepository.promotores.update(id, promotor);
            }
            catch (error) {
                throw new Error(`Erro ao atualizar o promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // Exclui um promotor pelo ID
    deletePromotor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SupabaseUserRepository_1.SupabaseRepository.promotores.delete(id);
            }
            catch (error) {
                throw new Error(`Erro ao excluir o promotor com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.PromotorService = PromotorService;
