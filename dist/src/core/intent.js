"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIntent = generateIntent;
function generateIntent(input) {
    const payload = {
        ...input,
        timestamp: Date.now(),
        traceId: crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10)
    };
    return JSON.stringify(payload);
}
