"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
require("colors");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const apollo_server_express_1 = require("apollo-server-express");
const db_1 = require("./config/db");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.connectDB();
    const app = express_1.default();
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        secret: process.env.SESSION_SECRET,
        store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGO_URI }),
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(constants_1.PORT, () => {
        console.log(`App running on http://localhost:${constants_1.PORT}${apolloServer.graphqlPath}`.blue
            .bold);
    });
});
main().catch((err) => console.log('Root Error'.red.underline.bold, err));
//# sourceMappingURL=server.js.map