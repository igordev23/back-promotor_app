"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatarParaBrasil = formatarParaBrasil;
function formatarParaBrasil(date) {
    return new Date(date).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
    });
}
