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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email e senha são obrigatórios' });
                    return;
                }
                const result = yield authService.login(email, password);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(401).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                if (!token) {
                    res.status(401).json({ error: 'Token não informado' });
                    return;
                }
                yield authService.logout(token);
                res.status(200).json({ message: 'Logout realizado com sucesso' });
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                if (!token) {
                    res.status(401).json({ error: 'Token não informado' });
                    return;
                }
                const user = yield authService.me(token);
                res.status(200).json(user);
            }
            catch (error) {
                res.status(401).json({
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
}
exports.AuthController = AuthController;
