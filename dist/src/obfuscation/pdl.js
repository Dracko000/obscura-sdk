"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapWithPDL = wrapWithPDL;
function wrapWithPDL(intentPayload) {
    const noise = Math.random().toString(36).substring(2, 8);
    return `${noise}::${intentPayload}::${noise}`;
}
