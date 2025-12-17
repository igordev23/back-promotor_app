import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto Supabase
const SUPABASE_URL = 'https://sua-url-do-supabase.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
