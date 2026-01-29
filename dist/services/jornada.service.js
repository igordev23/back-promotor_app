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
exports.JornadaService = void 0;
const SupabaseUserRepository_1 = require("../repositories/SupabaseUserRepository");
class JornadaService {
    iniciarJornada(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jornadaAtiva = yield SupabaseUserRepository_1.SupabaseRepository.jornada.getJornadaAtiva(promotorId);
            if (jornadaAtiva) {
                throw new Error('Já existe uma jornada ativa para este promotor.');
            }
            const novaJornada = yield SupabaseUserRepository_1.SupabaseRepository.jornada.create({
                promotor_id: promotorId,
                status: 'ativo',
            });
            yield SupabaseUserRepository_1.SupabaseRepository.promotores.update(promotorId, { statusJornada: 'ativo' });
            return novaJornada;
        });
    }
    finalizarJornada(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jornadaAtiva = yield SupabaseUserRepository_1.SupabaseRepository.jornada.getJornadaAtiva(promotorId);
            if (!jornadaAtiva) {
                throw new Error('Não existe jornada ativa para este promotor.');
            }
            const jornadaFinalizada = yield SupabaseUserRepository_1.SupabaseRepository.jornada.finalizar(jornadaAtiva.id);
            yield SupabaseUserRepository_1.SupabaseRepository.promotores.update(promotorId, { statusJornada: 'inativo' });
            return jornadaFinalizada;
        });
    }
    getStatusJornada(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupabaseUserRepository_1.SupabaseRepository.jornada.getJornadaAtiva(promotorId);
        });
    }
    getJornadaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const jornada = yield SupabaseUserRepository_1.SupabaseRepository.jornada.getById(id);
            if (!jornada) {
                throw new Error(`Jornada com ID ${id} não encontrada.`);
            }
            return jornada;
        });
    }
    getJornadasByPromotor(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupabaseUserRepository_1.SupabaseRepository.jornada.getByPromotor(promotorId);
        });
    }
    updateJornada(id, jornadaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const jornada = yield this.getJornadaById(id); // Re-use getById to check existence
            return yield SupabaseUserRepository_1.SupabaseRepository.jornada.update(id, jornadaData);
        });
    }
    deleteJornada(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getJornadaById(id); // Re-use getById to check existence
            yield SupabaseUserRepository_1.SupabaseRepository.jornada.delete(id);
        });
    }
}
exports.JornadaService = JornadaService;
