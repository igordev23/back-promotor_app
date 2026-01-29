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
exports.AuthService = void 0;
const supabase_1 = __importDefault(require("../config/supabase"));
const SupabaseUserRepository_1 = require("../repositories/SupabaseUserRepository");
class AuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.default.auth.signInWithPassword({
                email,
                password,
            });
            if (error || !data.session) {
                throw new Error('Email ou senha inválidos');
            }
            const isSupervisor = yield SupabaseUserRepository_1.SupabaseRepository.user.isSupervisor(data.user.id);
            return {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresIn: data.session.expires_in,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: isSupervisor ? 'supervisor' : 'promotor',
                },
            };
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabase_1.default.auth.signOut({
                scope: 'global',
            });
            if (error) {
                throw new Error('Erro ao realizar logout');
            }
        });
    }
    me(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.default.auth.getUser(token);
            if (error || !data.user) {
                throw new Error('Usuário não autenticado');
            }
            return {
                id: data.user.id,
                email: data.user.email,
            };
        });
    }
}
exports.AuthService = AuthService;
