import supabase from '../config/supabase';
import { Promotor } from '../types/promotor';
import { CreatePromotorDTO } from '../dto/create-promotor.dto';
import { Lead } from '../types/lead';
import { Localizacao } from '../types/localizacao';
import { Jornada } from '../types/jornada';
import { Supervisor } from '../types/supervisor';
import { CreateSupervisorDTO } from '../dto/create-supervisor.dto';
import { DashboardData } from '../types/dashboard';
import { CreateLeadDTO } from '../dto/create-lead.dto';

// --- HELPER FUNCTIONS ---
function mapLeadFromDB(data: any): Lead | null {
  if (!data) return null;
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
  if (!data) return [];
  return data.map(mapLeadFromDB).filter((lead): lead is Lead => lead !== null);
}

function mapPromotorFromDB(data: any): Promotor {
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

export const SupabaseRepository = {
  // --- MÉTODOS GENÉRICOS DE USUÁRIO ---
  user: {
    async isSupervisor(userId: string): Promise<boolean> {
      const { data, error } = await supabase
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
    },
  },

  // --- MÉTODOS PARA SUPERVISORES ---
  supervisores: {
    async getAll(): Promise<Supervisor[]> {
      const { data, error } = await supabase.from('supervisores').select('*');
      if (error) throw error;
      return data as Supervisor[];
    },

    async getById(id: string): Promise<Supervisor> {
      const { data, error } = await supabase
        .from('supervisores')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Supervisor;
    },

    async create(dto: CreateSupervisorDTO): Promise<Supervisor> {
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: dto.email,
          password: dto.password,
          email_confirm: true,
          user_metadata: { role: 'supervisor' },
        });

      if (authError || !authData.user) throw authError;

      const { data: dbData, error: dbError } = await supabase
        .from('supervisores')
        .insert({
          id: authData.user.id,
          nome: dto.nome,
          email: dto.email,
          telefone: dto.telefone,
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return dbData as Supervisor;
    },

    async update(id: string, supervisor: Partial<Supervisor>): Promise<Supervisor> {
      const { data, error } = await supabase
        .from('supervisores')
        .update(supervisor)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Supervisor;
    },

    async delete(id: string): Promise<void> {
      await supabase.auth.admin.deleteUser(id);
      const { error } = await supabase
        .from('supervisores')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // --- MÉTODOS PARA PROMOTORES ---
  promotores: {
    async getAll(): Promise<Promotor[]> {
      const { data, error } = await supabase.from('promotores').select('*');
      if (error) throw error;
      return (data || []).map(mapPromotorFromDB);
    },

    async getBySupervisorId(supervisorId: string): Promise<Promotor[]> {
      const { data, error } = await supabase
        .from('promotores')
        .select('*')
        .eq('supervisor_id', supervisorId);
      if (error) throw error;
      return (data || []).map(mapPromotorFromDB);
    },

    async getById(id: string): Promise<Promotor> {
      const { data, error } = await supabase
        .from('promotores')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return mapPromotorFromDB(data);
    },

    async create(dto: CreatePromotorDTO): Promise<Promotor> {
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: dto.email,
          password: dto.password,
          email_confirm: true,
          user_metadata: {
            role: 'promotor',
            supervisorId: dto.supervisorId,
          },
        });

      if (authError || !authData.user) throw authError;

      const { data: dbData, error: dbError } = await supabase
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

      if (dbError) throw dbError;
      return mapPromotorFromDB(dbData);
    },

    async update(id: string, promotor: Partial<Promotor>): Promise<Promotor> {
      const { data, error } = await supabase
        .from('promotores')
        .update(promotor)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapPromotorFromDB(data);
    },

    async delete(id: string): Promise<void> {
      await supabase.auth.admin.deleteUser(id);
      const { error } = await supabase
        .from('promotores')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // --- MÉTODOS PARA LOCALIZAÇÃO ---
  localizacao: {
    async create(localizacao: Omit<Localizacao, 'id'>): Promise<Localizacao> {
      const { data, error } = await supabase
        .from('localizacao')
        .insert(localizacao)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Localizacao;
    },

    async getHistoricoByPromotorId(promotorId: string): Promise<Localizacao[]> {
      const { data, error } = await supabase
        .from('localizacao')
        .select('*')
        .eq('promotorId', promotorId)
        .order('registrado_em', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },

    async getById(id: string): Promise<Localizacao | null> {
      const { data, error } = await supabase
        .from('localizacao')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116: "The result contains 0 rows"
        throw new Error(error.message);
      }
      return data;
    },

    async update(id: string, localizacao: Partial<Omit<Localizacao, 'id'>>): Promise<Localizacao> {
      const { data, error } = await supabase
        .from('localizacao')
        .update(localizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Localizacao;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('localizacao').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
  },

  // --- MÉTODOS PARA LEADS ---
  leads: {
    async create(promotorId: string, dto: CreateLeadDTO): Promise<Lead> {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          nome: dto.nome,
          telefone: dto.telefone,
          cpf: dto.cpf,
          criado_por: promotorId,
        })
        .select()
        .single();
      if (error) throw error;
      
      const lead = mapLeadFromDB(data);
      if (!lead) {
        throw new Error('Failed to create lead: database did not return created object.');
      }
      return lead;
    },

    async update(id: string, leadUpdate: Partial<Omit<Lead, 'id' | 'criadoPor' | 'criadoEm'>>): Promise<Lead> {
      const { data, error } = await supabase
        .from('leads')
        .update(leadUpdate)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      const updatedLead = mapLeadFromDB(data);
      if (!updatedLead) {
        throw new Error(`Lead with id ${id} not found.`);
      }
      return updatedLead;
    },

    async getById(id: string): Promise<Lead | null> {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return mapLeadFromDB(data);
    },

    async getByPromotor(promotorId: string): Promise<Lead[]> {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('criado_por', promotorId);
      if (error) throw error;
      return mapLeadsFromDB(data);
    },

    async getBySupervisor(supervisorId: string): Promise<Lead[]> {
      const { data, error } = await supabase
        .from('leads')
        .select('*, promotores!inner(id, supervisor_id)')
        .eq('promotores.supervisor_id', supervisorId)
        .order('criado_em', { ascending: false });
      if (error) throw error;
      return mapLeadsFromDB(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // --- MÉTODOS PARA JORNADA ---
  jornada: {
    async create(dto: { promotor_id: string; status: 'ativo' | 'inativo' }): Promise<Jornada> {
      const { data, error } = await supabase
        .from('jornadas')
        .insert(dto)
        .select()
        .single();
      if (error) throw error;
      return data as Jornada;
    },

    async getJornadaAtiva(promotorId: string): Promise<Jornada | null> {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('promotor_id', promotorId)
        .eq('status', 'ativo')
        .maybeSingle();
      if (error) throw error;
      return data as Jornada | null;
    },

    async finalizar(id: string): Promise<Jornada> {
      const { data, error } = await supabase
        .from('jornadas')
        .update({ status: 'inativo', fim: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Jornada;
    },

    async getById(id: string): Promise<Jornada | null> {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Jornada | null;
    },

    async getByPromotor(promotorId: string): Promise<Jornada[]> {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('promotor_id', promotorId);
      if (error) throw error;
      return (data as Jornada[]) || [];
    },

    async update(id: string, jornada: Partial<Jornada>): Promise<Jornada> {
      const { data, error } = await supabase
        .from('jornadas')
        .update(jornada)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Jornada;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('jornadas').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // --- MÉTODOS PARA DASHBOARD ---
  dashboard: {
    async getDashboardData(): Promise<DashboardData> {
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      const { count: totalPromotores } = await supabase
        .from('promotores')
        .select('*', { count: 'exact', head: true });

      const { count: promotoresAtivos } = await supabase
        .from('promotores')
        .select('*', { count: 'exact', head: true })
        .eq('status_jornada', 'ativo');

      const hojeInicio = new Date();
      hojeInicio.setHours(0, 0, 0, 0);

      const { count: totalLeadsHoje } = await supabase
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
    },
  },
};
