export interface Jornada {
  id: string;
  idPromotor: string;
  status: 'ativo' | 'inativo';
  inicio: number;
  fim: number;
}
