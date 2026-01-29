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
exports.LocalizacaoService = void 0;
const SupabaseUserRepository_1 = require("../repositories/SupabaseUserRepository");
class LocalizacaoService {
    registrarLocalizacao(promotorId, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function* () {
            const localizacaoData = {
                promotorId,
                latitude,
                longitude,
                registrado_em: new Date().toISOString(),
            };
            // 1. Create the new location entry
            const novaLocalizacao = yield SupabaseUserRepository_1.SupabaseRepository.localizacao.create(localizacaoData);
            // 2. Update the promoter's last location
            const ultimaLocalizacao = {
                lat: latitude,
                lng: longitude,
                timestamp: new Date(novaLocalizacao.registrado_em).getTime(),
            };
            yield SupabaseUserRepository_1.SupabaseRepository.promotores.update(promotorId, {
                ultimaLocalizacao: ultimaLocalizacao,
            });
            return novaLocalizacao;
        });
    }
    updateLocalizacao(id, localizacao) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLocalizacao = yield SupabaseUserRepository_1.SupabaseRepository.localizacao.getById(id);
            if (!existingLocalizacao) {
                throw new Error(`Localização com ID ${id} não encontrada.`);
            }
            return yield SupabaseUserRepository_1.SupabaseRepository.localizacao.update(id, localizacao);
        });
    }
    getLocalizacoesHistoricoByPromotor(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupabaseUserRepository_1.SupabaseRepository.localizacao.getHistoricoByPromotorId(promotorId);
        });
    }
    getLocalizacaoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const localizacao = yield SupabaseUserRepository_1.SupabaseRepository.localizacao.getById(id);
            if (!localizacao) {
                throw new Error(`Localização com ID ${id} não encontrada.`);
            }
            return localizacao;
        });
    }
    deleteLocalizacao(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLocalizacao = yield SupabaseUserRepository_1.SupabaseRepository.localizacao.getById(id);
            if (!existingLocalizacao) {
                throw new Error(`Localização com ID ${id} não encontrada.`);
            }
            yield SupabaseUserRepository_1.SupabaseRepository.localizacao.delete(id);
        });
    }
    getLastLocalizacaoByPromotor(promotorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const localizacoes = yield SupabaseUserRepository_1.SupabaseRepository.localizacao.getHistoricoByPromotorId(promotorId);
            if (localizacoes.length === 0) {
                return null;
            }
            // Return the last element of the array
            return localizacoes[localizacoes.length - 1];
        });
    }
}
exports.LocalizacaoService = LocalizacaoService;
