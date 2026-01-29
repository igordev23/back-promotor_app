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
exports.LocalizacaoController = void 0;
const localizacao_service_1 = require("../services/localizacao.service");
const date_service_1 = require("../services/date.service");
const localizacaoService = new localizacao_service_1.LocalizacaoService();
class LocalizacaoController {
    // Registra uma nova localização
    registerLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Usuário não autenticado' });
                    return;
                }
                const { latitude, longitude } = req.body;
                if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                    res.status(400).json({ error: 'Latitude e longitude inválidas' });
                    return;
                }
                const promotorId = req.user.id;
                const location = yield localizacaoService.registrarLocalizacao(promotorId, latitude, longitude);
                // ✅ CONVERSÃO PARA HORÁRIO DO BRASIL
                res.status(201).json(Object.assign(Object.assign({}, location), { registrado_em: (0, date_service_1.formatarParaBrasil)(location.registrado_em) }));
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Obtém a última localização de um promotor
    getLastLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const location = yield localizacaoService.getLastLocalizacaoByPromotor(id);
                res.status(200).json(location);
            }
            catch (error) {
                res.status(500).json({ error: `Erro ao buscar última localização do promotor com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
            }
        });
    }
    // Obtém o histórico de localizações de um promotor
    getLocationHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const locations = yield localizacaoService.getLocalizacoesHistoricoByPromotor(id);
                res.status(200).json(locations);
            }
            catch (error) {
                res.status(500).json({ error: `Erro ao buscar histórico de localizações do promotor com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
            }
        });
    }
}
exports.LocalizacaoController = LocalizacaoController;
