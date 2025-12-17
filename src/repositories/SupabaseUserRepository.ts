import supabase from '../config/supabase'; // Importe seu arquivo de configuração
import { Promotor } from '../types/promotor';
import { Lead } from '../types/lead';
import { Localizacao } from '../types/localizacao';
import { Jornada } from '../types/jornada';
import { Supervisor } from '../types/supervisor';
import { DashboardData } from '../types/dashboard';



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

    async create(supervisor: Omit<Supervisor, 'id'>) {
      const { data, error } = await supabase
        .from('supervisores')
        .insert([supervisor])
        .select()
        .single();
      if (error) throw error;
      return data as Supervisor;
    },
    async update(id: string, supervisor: Omit<Supervisor, 'id'>) {
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
      const { error } = await supabase
        .from('supervisores')
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
        .insert([localizacao]);
      if (error) throw error;
      return data;
    },
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

  
  // --- MÉTODOS PARA PROMOTORES ---
  promotores: {
    async getAll() {
      const { data, error } = await supabase
        .from('promotores')
        .select('*');
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

    async create(promotor: Omit<Promotor, 'id'>) {
      const { data, error } = await supabase
        .from('promotores')
        .insert([promotor])
        .select()
        .single();
      if (error) throw error;
      return data as Promotor;
    },
    // Atualiza um promotor existente
    async update(id: string, promotor: Omit<Promotor, 'id'>) {
      const { data, error } = await supabase
        .from('promotores')
        .update(promotor)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Promotor;
    },

    async updateLocation(id: string, lat: number, lng: number) {
      const { error } = await supabase
        .from('promotores')
        .update({ 
          ultimaLocalizacao: { lat, lng, timestamp: Date.now() } 
        })
        .eq('id', id);
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('promotores')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // --- MÉTODOS PARA LEADS ---
  leads: {
    async create(lead: Omit<Lead, 'id'>) {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();
      if (error) throw error;
      return data as Lead;
    },
    async update(id: string, lead: Omit<Lead, 'id'>) {
      const { data, error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Lead;
    },

    async getByPromotor(promotorId: string) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('criadoPor', promotorId);
      if (error) throw error;
      return data as Lead[];
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Lead;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // --- MÉTODOS PARA JORNADA ---
  jornada: {
    async registrarPonto(jornada: Jornada) {
      const { data, error } = await supabase
        .from('jornadas')
        .insert([jornada]);
      if (error) throw error;
      return data;
    },
    // Finaliza uma jornada
    async finalizarJornada(id: string) {
      const { data, error } = await supabase
        .from('jornadas')
        .update({ statusJornada: 'finalizado' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Jornada;
    },
    // Status atual da jornada
    async status(id: string) {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Jornada;
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