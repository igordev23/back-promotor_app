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
exports.SupabaseRepository = void 0;
const supabase_1 = __importDefault(require("../config/supabase"));
// --- HELPER FUNCTIONS ---
function mapLeadFromDB(data) {
    if (!data)
        return null;
    return {
        id: data.id,
        nome: data.nome,
        telefone: data.telefone,
        cpf: data.cpf,
        criadoPor: data.criado_por,
        criadoEm: new Date(data.criado_em).getTime(),
    };
}
function mapLeadsFromDB(data) {
    if (!data)
        return [];
    return data.map(mapLeadFromDB).filter((lead) => lead !== null);
}
function mapPromotorFromDB(data) {
    return {
        id: data.id,
        supervisorId: data.supervisor_id,
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        statusJornada: data.status_jornada,
        ultimaLocalizacao: data.ultima_localizacao
            ? {
                lat: data.ultima_localizacao.lat,
                lng: data.ultima_localizacao.lng,
                timestamp: data.ultima_localizacao.timestamp,
            }
            : undefined,
        criadoEm: data.criado_em ? new Date(data.criado_em).getTime() : 0,
    };
}
exports.SupabaseRepository = {
    // --- MÉTODOS GENÉRICOS DE USUÁRIO ---
    user: {
        isSupervisor(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('supervisores')
                    .select('id')
                    .eq('id', userId)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    // PGRST116: No rows found, which is not an error here.
                    console.error('Error checking supervisor status:', error);
                    throw error;
                }
                return !!data;
            });
        },
    },
    // --- MÉTODOS PARA SUPERVISORES ---
    supervisores: {
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default.from('supervisores').select('*');
                if (error)
                    throw error;
                return data;
            });
        },
        getById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('supervisores')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error)
                    throw error;
                return data;
            });
        },
        create(dto) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data: authData, error: authError } = yield supabase_1.default.auth.admin.createUser({
                    email: dto.email,
                    password: dto.password,
                    email_confirm: true,
                    user_metadata: { role: 'supervisor' },
                });
                if (authError || !authData.user)
                    throw authError;
                const { data: dbData, error: dbError } = yield supabase_1.default
                    .from('supervisores')
                    .insert({
                    id: authData.user.id,
                    nome: dto.nome,
                    email: dto.email,
                    telefone: dto.telefone,
                })
                    .select()
                    .single();
                if (dbError)
                    throw dbError;
                return dbData;
            });
        },
        update(id, supervisor) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('supervisores')
                    .update(supervisor)
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw error;
                return data;
            });
        },
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield supabase_1.default.auth.admin.deleteUser(id);
                const { error } = yield supabase_1.default
                    .from('supervisores')
                    .delete()
                    .eq('id', id);
                if (error)
                    throw error;
            });
        },
    },
    // --- MÉTODOS PARA PROMOTORES ---
    promotores: {
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default.from('promotores').select('*');
                if (error)
                    throw error;
                return (data || []).map(mapPromotorFromDB);
            });
        },
        getBySupervisorId(supervisorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('promotores')
                    .select('*')
                    .eq('supervisor_id', supervisorId);
                if (error)
                    throw error;
                return (data || []).map(mapPromotorFromDB);
            });
        },
        getById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('promotores')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error)
                    throw error;
                return mapPromotorFromDB(data);
            });
        },
        create(dto) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data: authData, error: authError } = yield supabase_1.default.auth.admin.createUser({
                    email: dto.email,
                    password: dto.password,
                    email_confirm: true,
                    user_metadata: {
                        role: 'promotor',
                        supervisorId: dto.supervisorId,
                    },
                });
                if (authError || !authData.user)
                    throw authError;
                const { data: dbData, error: dbError } = yield supabase_1.default
                    .from('promotores')
                    .insert({
                    id: authData.user.id,
                    nome: dto.nome,
                    email: dto.email,
                    telefone: dto.telefone,
                    supervisor_id: dto.supervisorId,
                    status_jornada: 'inativo',
                })
                    .select()
                    .single();
                if (dbError)
                    throw dbError;
                return mapPromotorFromDB(dbData);
            });
        },
        update(id, promotor) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('promotores')
                    .update(promotor)
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw error;
                return mapPromotorFromDB(data);
            });
        },
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield supabase_1.default.auth.admin.deleteUser(id);
                const { error } = yield supabase_1.default
                    .from('promotores')
                    .delete()
                    .eq('id', id);
                if (error)
                    throw error;
            });
        },
    },
    // --- MÉTODOS PARA LOCALIZAÇÃO ---
    localizacao: {
        create(localizacao) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('localizacao')
                    .insert(localizacao)
                    .select()
                    .single();
                if (error)
                    throw new Error(error.message);
                return data;
            });
        },
        getHistoricoByPromotorId(promotorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('localizacao')
                    .select('*')
                    .eq('promotorId', promotorId)
                    .order('registrado_em', { ascending: true });
                if (error)
                    throw new Error(error.message);
                return data || [];
            });
        },
        getById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('localizacao')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    // PGRST116: "The result contains 0 rows"
                    throw new Error(error.message);
                }
                return data;
            });
        },
        update(id, localizacao) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('localizacao')
                    .update(localizacao)
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw new Error(error.message);
                return data;
            });
        },
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield supabase_1.default.from('localizacao').delete().eq('id', id);
                if (error)
                    throw new Error(error.message);
            });
        },
    },
    // --- MÉTODOS PARA LEADS ---
    leads: {
        create(promotorId, dto) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('leads')
                    .insert({
                    nome: dto.nome,
                    telefone: dto.telefone,
                    cpf: dto.cpf,
                    criado_por: promotorId,
                })
                    .select()
                    .single();
                if (error)
                    throw error;
                const lead = mapLeadFromDB(data);
                if (!lead) {
                    throw new Error('Failed to create lead: database did not return created object.');
                }
                return lead;
            });
        },
        update(id, leadUpdate) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('leads')
                    .update(leadUpdate)
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw error;
                const updatedLead = mapLeadFromDB(data);
                if (!updatedLead) {
                    throw new Error(`Lead with id ${id} not found.`);
                }
                return updatedLead;
            });
        },
        getById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('leads')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error && error.code !== 'PGRST116')
                    throw error;
                return mapLeadFromDB(data);
            });
        },
        getByPromotor(promotorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('leads')
                    .select('*')
                    .eq('criado_por', promotorId);
                if (error)
                    throw error;
                return mapLeadsFromDB(data);
            });
        },
        getBySupervisor(supervisorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('leads')
                    .select('*, promotores!inner(id, supervisor_id)')
                    .eq('promotores.supervisor_id', supervisorId)
                    .order('criado_em', { ascending: false });
                if (error)
                    throw error;
                return mapLeadsFromDB(data);
            });
        },
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield supabase_1.default.from('leads').delete().eq('id', id);
                if (error)
                    throw error;
            });
        },
    },
    // --- MÉTODOS PARA JORNADA ---
    jornada: {
        create(dto) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('jornadas')
                    .insert(dto)
                    .select()
                    .single();
                if (error)
                    throw error;
                return data;
            });
        },
        getJornadaAtiva(promotorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('jornadas')
                    .select('*')
                    .eq('promotor_id', promotorId)
                    .eq('status', 'ativo')
                    .maybeSingle();
                if (error)
                    throw error;
                return data;
            });
        },
        finalizar(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('jornadas')
                    .update({ status: 'inativo', fim: new Date().toISOString() })
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw error;
                return data;
            });
        },
        getById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('jornadas')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();
                if (error)
                    throw error;
                return data;
            });
        },
        getByPromotor(promotorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('jornadas')
                    .select('*')
                    .eq('promotor_id', promotorId);
                if (error)
                    throw error;
                return data || [];
            });
        },
        update(id, jornada) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.default
                    .from('jornadas')
                    .update(jornada)
                    .eq('id', id)
                    .select()
                    .single();
                if (error)
                    throw error;
                return data;
            });
        },
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield supabase_1.default.from('jornadas').delete().eq('id', id);
                if (error)
                    throw error;
            });
        },
    },
    // --- MÉTODOS PARA DASHBOARD ---
    dashboard: {
        getDashboardData() {
            return __awaiter(this, void 0, void 0, function* () {
                const { count: totalLeads } = yield supabase_1.default
                    .from('leads')
                    .select('*', { count: 'exact', head: true });
                const { count: totalPromotores } = yield supabase_1.default
                    .from('promotores')
                    .select('*', { count: 'exact', head: true });
                const { count: promotoresAtivos } = yield supabase_1.default
                    .from('promotores')
                    .select('*', { count: 'exact', head: true })
                    .eq('status_jornada', 'ativo');
                const hojeInicio = new Date();
                hojeInicio.setHours(0, 0, 0, 0);
                const { count: totalLeadsHoje } = yield supabase_1.default
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .gte('criado_em', hojeInicio.toISOString());
                return {
                    totalLeads: totalLeads || 0,
                    totalPromotores: totalPromotores || 0,
                    promotoresAtivos: promotoresAtivos || 0,
                    totalLeadsHoje: totalLeadsHoje || 0,
                    estatisticasGerais: {
                        leadsPorStatus: {},
                    },
                };
            });
        },
    },
};
