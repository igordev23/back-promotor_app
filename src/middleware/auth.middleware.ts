import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // 🔥 usuário autenticado
  req.user = {
    id: data.user.id,
    email: data.user.email!,
  };

  next();
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
