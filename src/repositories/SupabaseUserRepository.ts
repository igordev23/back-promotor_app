import supabase from '../config/supabase'; // Importe seu arquivo de configuração
import { Promotor } from '../types/promotor';
import { CreatePromotorDTO } from '../dto/create-promotor.dto';
import { Lead } from '../types/lead';
import { Localizacao } from '../types/localizacao';
import { Jornada } from '../types/jornada';
import { Supervisor } from '../types/supervisor';
import { CreateSupervisorDTO } from '../dto/create-supervisor.dto';
import { DashboardData } from '../types/dashboard';
import { CreateLeadDTO } from '../dto/create-lead.dto';
function mapLeadFromDB(data: any): Lead {
  return {
    id: data.id,
    nome: data.nome,
    telefone: data.telefone,
    cpf: data.cpf,
    criadoPor: data.criado_por,
    criadoEm: new Date(data.criado_em).getTime(),
  };
}

function mapLeadsFromDB(data: any[]): Lead[] {
  return data.map(mapLeadFromDB);
}

export const SupabaseRepository = {

// --- MÉTODOS PARA SUPERVISORES ---
supervisores: {

  async getAll() {
    const { data, error } = await supabase
      .from('supervisores')
      .select('*');

    if (error) throw error;
    return data as Supervisor[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('supervisores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Supervisor;
  },

  async create(data: CreateSupervisorDTO) {
    // 1️⃣ Criar no Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          role: 'supervisor',
        },
      });

    if (authError || !authData.user) throw authError;

    // 2️⃣ Criar no banco
    const { data: dbData, error: dbError } = await supabase
      .from('supervisores')
      .insert({
        id: authData.user.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return dbData as Supervisor;
  },

  async update(id: string, supervisor: Partial<Supervisor>) {
    const { data, error } = await supabase
      .from('supervisores')
      .update(supervisor)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Supervisor;
  },


  async delete(id: string) {
    // Remove do Auth
    await supabase.auth.admin.deleteUser(id);

    // Remove do banco
    const { error } = await supabase
      .from('supervisores')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
},

// --- MÉTODOS PARA PROMOTORES ---

promotores: {

  async getAll() {
    const { data, error } = await supabase
      .from('promotores')
      .select('*');

    if (error) throw error;
    return data as Promotor[];
  },
  async getBySupervisorId(supervisorId: string) {
    const { data, error } = await supabase
      .from('promotores')
      .select('*')
      .eq('supervisor_id', supervisorId);

    if (error) throw error;
    return data as Promotor[];
  },


  async getById(id: string) {
    const { data, error } = await supabase
      .from('promotores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Promotor;
  },

  async create(data: CreatePromotorDTO) {
    // 1️⃣ Criar no Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          role: 'promotor',
          supervisorId: data.supervisorId,
        },
      });

    if (authError || !authData.user) throw authError;

    // 2️⃣ Criar no banco
    const { data: dbData, error: dbError } = await supabase
      .from('promotores')
      .insert({
        id: authData.user.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        supervisor_id: data.supervisorId,
        status_jornada: 'inativo',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return dbData as Promotor;
  },

  async update(id: string, promotor: Partial<Promotor>) {
    const { data, error } = await supabase
      .from('promotores')
      .update(promotor)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Promotor;
  },
//Atuliza localização do pormotor com id lat e long
async updateLocalizacao(id: string, lat: number, lng: number) {
    const { data, error } = await supabase
      .from('promotores')
      .update({ lat, lng })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Promotor;
  },
  async delete(id: string) {
    // Remove do Auth
    await supabase.auth.admin.deleteUser(id);

    // Remove do banco
    const { error } = await supabase
      .from('promotores')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
},


  // --- MÉTODOS PARA LOCALIZAÇÃO ---
  localizacao: {
   async registrar(localizacao: Localizacao) {
  const { data, error } = await supabase
    .from('localizacoes')
    .insert([
      {
        promotor_id: localizacao.promotorId,
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
        
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Localizacao;
}

,
    async update(id: string, localizacao: Omit<Localizacao, 'id'>) {
      const { data, error } = await supabase
        .from('localizacoes')
        .update(localizacao)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Localizacao;
    },
    async getByPromotor(promotorId: string) {
      const { data, error } = await supabase
        .from('localizacoes')
        .select('*')
        .eq('idPromotor', promotorId);
      if (error) throw error;
      return data as Localizacao[];
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('localizacoes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Localizacao;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('localizacoes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  
  

  // --- MÉTODOS PARA LEADS ---
  leads: {
  /* ---------- CREATE ---------- */
  async create(
    promotorId: string,
    data: CreateLeadDTO
  ): Promise<Lead> {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        nome: data.nome,
        telefone: data.telefone,
        cpf: data.cpf,
        criado_por: promotorId,
      })
      .select()
      .single();

    if (error) throw error;

    return mapLeadFromDB(lead);
  },

  /* ---------- UPDATE ---------- */
  async update(
    promotorId: string,
    id: string,
    lead: Omit<Lead, 'id' | 'criadoPor' | 'criadoEm'>
  ): Promise<Lead> {
    const existingLead = await this.getById(promotorId, id);

    if (existingLead.criadoPor !== promotorId) {
      throw new Error('Acesso negado ao lead');
    }

    const { data, error } = await supabase
      .from('leads')
      .update({
        nome: lead.nome,
        telefone: lead.telefone,
        cpf: lead.cpf,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return mapLeadFromDB(data);
  },

  /* ---------- GET BY PROMOTOR ---------- */
  async getByPromotor(promotorId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('criado_por', promotorId);

    if (error) throw error;

    return mapLeadsFromDB(data);
  },

  /* ---------- GET BY ID (PROMOTOR) ---------- */
  async getById(
    promotorId: string,
    id: string
  ): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data.criado_por !== promotorId) {
      throw new Error('Acesso negado ao lead');
    }

    return mapLeadFromDB(data);
  },

  /* ---------- GET BY ID (SUPERVISOR) ---------- */
  async getByIdSupervisor(id: string): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return mapLeadFromDB(data);
  },

  /* ---------- GET ALL BY SUPERVISOR ---------- */
  async getBySupervisor(supervisorId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        promotores!inner (
          id,
          supervisor_id
        )
      `)
      .eq('promotores.supervisor_id', supervisorId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    return mapLeadsFromDB(data);
  },

  /* ---------- DELETE ---------- */
  async delete(
    promotorId: string,
    id: string
  ): Promise<void> {
    const lead = await this.getById(promotorId, id);

    if (lead.criadoPor !== promotorId) {
      throw new Error('Acesso negado ao lead');
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
},

  // --- MÉTODOS PARA JORNADA ---
  jornada: {
    async registrarPonto(data: {
    promotor_id: string;
    status: 'ativo' | 'inativo';
  }) {
    const { data: jornada, error } = await supabase
      .from('jornadas')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return jornada;
  },

    // Finaliza uma jornada
    async finalizarJornada(id: string) {
      const { data, error } = await supabase
        .from('jornadas')
        .update({ status: 'inativo',
          fim: new Date().toISOString(),
         })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Jornada;
    },
    // Status atual da jornada
   async getJornadaAtiva(promotorId: string) {
    const { data, error } = await supabase
      .from('jornadas')
      .select('*')
      .eq('promotor_id', promotorId)
      .eq('status', 'ativo')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

    async getByPromotor(promotorId: string) {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('idPromotor', promotorId);
      if (error) throw error;
      return data as Jornada[];
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Jornada;
    },
    async update(id: string, jornada: Omit<Jornada, 'id'>) {
      const { data, error } = await supabase
        .from('jornadas')
        .update(jornada)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Jornada;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('jornadas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },
  // --- MÉTODOS PARA DASHBOARD ---
  dashboard: {
    async getDashboardData(): Promise<DashboardData> {
  // 1. Total de Leads (Geral)
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  // 2. Total de Promotores
  const { count: totalPromotores } = await supabase
    .from('promotores')
    .select('*', { count: 'exact', head: true });

  // 3. Promotores Ativos
  const { count: promotoresAtivos } = await supabase
    .from('promotores')
    .select('*', { count: 'exact', head: true })
    .eq('statusJornada', 'ativo');

  // 4. Leads de Hoje (Lógica baseada no timestamp criadoEm)
  const hojeInicio = new Date().setHours(0, 0, 0, 0);
  const { count: totalLeadsHoje } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('criadoEm', hojeInicio);

  return {
    totalLeads: totalLeads || 0,
    totalPromotores: totalPromotores || 0,
    promotoresAtivos: promotoresAtivos || 0,
    totalLeadsHoje: totalLeadsHoje || 0,
    estatisticasGerais: {
      leadsPorStatus: {} // Caso você venha a implementar status nos Leads depois
    }
  };
}
  },
};