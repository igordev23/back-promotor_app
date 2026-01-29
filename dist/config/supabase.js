"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SUPABASE_URL = 'https://fonwtnxbxyursbmafqsu.supabase.co';
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseRoleKey) {
    throw new Error('A variável de ambiente SUPABASE_SERVICE_ROLE_KEY não está definida.');
}
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, supabaseRoleKey);
exports.default = supabase;
