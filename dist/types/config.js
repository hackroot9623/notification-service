"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_BATCH_TIME_MS = exports.MAX_BATCH_SIZE = void 0;
exports.MAX_BATCH_SIZE = 5; // Numero maximo de notificaciones por Lote
exports.MAX_BATCH_TIME_MS = 2 * 60 * 60 * 1000; // Numero max de espera millisegundos (2 hrs)
