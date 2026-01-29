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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupervisorController = void 0;
const supervisor_service_1 = __importDefault(require("../services/supervisor.service"));
const supervisorService = new supervisor_service_1.default();
class SupervisorController {
    //Obtem todos os dados pra usar no dashboard
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboardData = yield supervisorService.getDashboardData();
                res.status(200).json(dashboardData);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Obtém todos os supervisores
    getAllSupervisors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisors = yield supervisorService.getAllSupervisors();
                res.status(200).json(supervisors);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Obtém um supervisor pelo ID
    getSupervisorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const supervisor = yield supervisorService.getSupervisorById(id);
                res.status(200).json(supervisor);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Cria um novo supervisor
    createSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supervisorData = req.body;
                const newSupervisor = yield supervisorService.createSupervisor(supervisorData);
                res.status(201).json(newSupervisor);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Atualiza um supervisor pelo ID
    updateSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const supervisorData = req.body;
                const updatedSupervisor = yield supervisorService.updateSupervisor(id, supervisorData);
                res.status(200).json(updatedSupervisor);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
    // Exclui um supervisor pelo ID
    deleteSupervisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield supervisorService.deleteSupervisor(id);
                res.status(200).json({ message: 'Supervisor excluído com sucesso' });
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
            }
        });
    }
}
exports.SupervisorController = SupervisorController;
