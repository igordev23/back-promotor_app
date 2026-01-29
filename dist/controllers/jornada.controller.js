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
exports.JornadaController = void 0;
const jornada_service_1 = require("../services/jornada.service");
const date_service_1 = require("../services/date.service");
const jornadaService = new jornada_service_1.JornadaService();
class JornadaController {
    // Registra um novo ponto na jornada
    registrarPonto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Usuário não autenticado' });
                    return;
                }
                const promotorId = req.user.id; // ✅ string UUID
                const jornada = yield jornadaService.iniciarJornada(promotorId);
                // Formata a data de início antes de retornar
                const jornadaFormatada = Object.assign(Object.assign({}, jornada), { inicio: (0, date_service_1.formatarParaBrasil)(new Date(jornada.inicio)) });
                res.status(201).json(jornadaFormatada);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    error: error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
                });
            }
        });
    }
    // Finaliza a jornada ATIVA do promotor
    finalizarJornada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Usuário não autenticado' });
                    return;
                }
                const promotorId = req.user.id;
                const jornada = yield jornadaService.finalizarJornada(promotorId);
                // Cria um novo objeto com as datas formatadas
                const jornadaFormatada = Object.assign(Object.assign({}, jornada), { inicio: (0, date_service_1.formatarParaBrasil)(new Date(jornada.inicio)), fim: jornada.fim ? (0, date_service_1.formatarParaBrasil)(new Date(jornada.fim)) : null });
                res.status(200).json(jornadaFormatada);
            }
            catch (error) {
                console.error('ERRO REAL:', error);
                res.status(500).json({
                    error: error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
                });
            }
        });
    }
    // Status atual da jornada (PROMOTOR)
    status(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Usuário não autenticado' });
                    return;
                }
                const promotorId = req.user.id;
                const jornada = yield jornadaService.getStatusJornada(promotorId);
                if (!jornada) {
                    res.status(404).json({ message: 'Nenhuma jornada ativa encontrada para este promotor.' });
                    return;
                }
                // Formatar as datas antes de enviar na resposta
                const jornadaFormatada = Object.assign(Object.assign({}, jornada), { inicio: (0, date_service_1.formatarParaBrasil)(new Date(jornada.inicio)), fim: jornada.fim ? (0, date_service_1.formatarParaBrasil)(new Date(jornada.fim)) : null });
                res.status(200).json(jornadaFormatada);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Atualiza uma jornada existente
    updateJornada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const jornada = yield jornadaService.updateJornada(id, req.body);
                res.status(200).json(jornada);
            }
            catch (error) {
                res.status(500).json({ error: `Erro ao atualizar jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
            }
        });
    }
    // Obtém todas as jornadas de um promotor
    getJornadasByPromotor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { promotorId } = req.params;
                const jornadas = yield jornadaService.getJornadasByPromotor(promotorId);
                res.status(200).json(jornadas);
            }
            catch (error) {
                res.status(500).json({ error: `Erro ao buscar jornadas do promotor com ID ${req.params.promotorId}: ${error instanceof Error ? error.message : String(error)}` });
            }
        });
    }
    // Obtém uma jornada específica pelo ID
    getJornadaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const jornada = yield jornadaService.getJornadaById(id);
                res.status(200).json(jornada);
            }
            catch (error) {
                res.status(500).json({ error: `Erro ao buscar jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
            }
        });
    }
    // Exclui uma jornada pelo ID
    deleteJornada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield jornadaService.deleteJornada(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: `Erro ao excluir jornada com ID ${req.params.id}: ${error instanceof Error ? error.message : String(error)}` });
            }
        });
    }
}
exports.JornadaController = JornadaController;
