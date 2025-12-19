export function formatarParaBrasil(date: string | Date): string {
  return new Date(date).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}
