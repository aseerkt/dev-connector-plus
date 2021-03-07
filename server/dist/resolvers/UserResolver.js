"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const gravatar_1 = __importDefault(require("gravatar"));
const User_1 = require("../entities/User");
const types_1 = require("../types");
const extractFieldErrors_1 = require("../utils/extractFieldErrors");
let RegisterArgs = class RegisterArgs {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterArgs.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterArgs.prototype, "password", void 0);
RegisterArgs = __decorate([
    type_graphql_1.ArgsType()
], RegisterArgs);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
class UserResolver {
    hello() {
        return 'hi';
    }
    register({ name, email, password }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new User_1.UserModel({ name, email, password });
                const validationErrors = yield class_validator_1.validate(user);
                if (validationErrors.length > 0) {
                    return { errors: extractFieldErrors_1.extractFieldErrors(validationErrors) };
                }
                user.avatar = gravatar_1.default.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm',
                });
                yield user.save();
                req.session.userId = user._id;
                return { user };
            }
            catch (err) {
                console.log(err);
                if (err.name === 'MongoError' && err.code === 11000) {
                    return {
                        errors: [{ path: 'email', message: 'Email is already taken' }],
                    };
                }
                return {
                    errors: [{ path: 'unknown', message: 'Unable to register user' }],
                };
            }
        });
    }
    login(email, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ email });
            if (!user) {
                return { errors: [{ path: 'email', message: 'User not found' }] };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return { errors: [{ path: 'password', message: 'Incorrect password' }] };
            }
            req.session.userId = user._id;
            return { user };
        });
    }
}
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Args()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map