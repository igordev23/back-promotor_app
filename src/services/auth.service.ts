import supabase from '../config/supabase';
import { SupabaseRepository } from '../repositories/SupabaseUserRepository';


export class AuthService {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new Error('Email ou senha inválidos');
    }

    const isSupervisor = await SupabaseRepository.user.isSupervisor(data.user.id);

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
  }

  async logout(token: string) {
    const { error } = await supabase.auth.signOut({
      scope: 'global',
    });

    if (error) {
      throw new Error('Erro ao realizar logout');
    }
  }
  async me(token: string) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error('Usuário não autenticado');
    }

    return {
      id: data.user.id,
      email: data.user.email,
    };
  }
}
