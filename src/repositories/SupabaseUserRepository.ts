import supabase from '../config/supabase';

export interface IUser {
  id?: string;
  name: string;
  email?: string;
}

export default class SupabaseUserRepository {
  async createUser(data: IUser) {
    const { data: user, error } = await supabase.from('users').insert(data).select();
    if (error) throw error;
    return user;
  }

  async getUsers() {
    const { data: users, error } = await supabase.from('users').select();
    if (error) throw error;
    return users;
  }

  async getUserById(id: string) {
    const { data: user, error } = await supabase.from('users').select().eq('id', id).single();
    if (error) throw error;
    return user;
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const { data: user, error } = await supabase.from('users').update(data).eq('id', id).select();
    if (error) throw error;
    return user;
  }

  async deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
