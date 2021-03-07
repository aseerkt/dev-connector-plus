"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const isAuth = ({ context }, next) => {
    try {
        if (!context.req.session.userId) {
            throw new Error('Not Authenticated');
        }
        return next();
    }
    catch (err) {
        throw new apollo_server_express_1.AuthenticationError(err.message);
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map