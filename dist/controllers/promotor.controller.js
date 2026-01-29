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
exports.PromotorController = void 0;
const promotor_service_1 = require("../services/promotor.service");
const localizacao_service_1 = require("../services/localizacao.service");
const promotorService = new promotor_service_1.PromotorService();
const localizacaoService = new localizacao_service_1.LocalizacaoService();
class PromotorController {
    // Obtém todos os promotores
    getAllPromotores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promotores = yield promotorService.getAllPromotores();
                res.status(200).json(promotores);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Obtém promotores do supervisor autenticado
    getPromotoresDoSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisorId = req.user.id;
                const promotores = yield promotorService.getPromotoresBySupervisor(supervisorId);
                res.status(200).json(promotores);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Obtém um promotor pelo ID
    getPromotorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const supervisorId = req.user.id;
                const promotor = yield promotorService.getPromotorById(id);
                // 🔒 VERIFICAÇÃO DE POSSE
                if (promotor.supervisorId !== supervisorId) {
                    res.status(403).json({ error: 'Acesso negado a este promotor' });
                    return;
                }
                res.status(200).json(promotor);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Cria um novo promotor
    createPromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promotorData = req.body;
                const newPromotor = yield promotorService.createPromotor(promotorData);
                res.status(201).json(newPromotor);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Atualiza um promotor existente
    updatePromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const supervisorId = req.user.id;
            const promotor = yield promotorService.getPromotorById(id);
            if (promotor.supervisorId !== supervisorId) {
                res.status(403).json({ error: 'Acesso negado' });
                return;
            }
            yield promotorService.updatePromotor(id, req.body);
            res.json({ message: 'Promotor atualizado com sucesso' });
        });
    }
    // Atualiza a localização de um promotor
    updatePromotorLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { lat, lng } = req.body;
                yield localizacaoService.registrarLocalizacao(id, lat, lng);
                res.status(200).json({ message: 'Localização atualizada com sucesso' });
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Exclui um promotor pelo ID
    deletePromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const supervisorId = req.user.id;
            const promotor = yield promotorService.getPromotorById(id);
            if (promotor.supervisorId !== supervisorId) {
                res.status(403).json({ error: 'Acesso negado' });
                return;
            }
            yield promotorService.deletePromotor(id);
            res.json({ message: 'Promotor excluído com sucesso' });
        });
    }
}
exports.PromotorController = PromotorController;
