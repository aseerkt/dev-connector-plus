"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFieldErrors = void 0;
const extractFieldErrors = (errors) => {
    return errors.map(({ property, constraints }) => ({
        path: property,
        message: Object.values(constraints)[0],
    }));
};
exports.extractFieldErrors = extractFieldErrors;
//# sourceMappingURL=extractFieldErrors.js.map