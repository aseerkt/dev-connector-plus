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
exports.UserModel = exports.User = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const Default_1 = require("./Default");
const argon2_1 = __importDefault(require("argon2"));
const class_validator_1 = require("class-validator");
let User = class User extends Default_1.Default {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1, { message: 'Name is required' }),
    class_validator_1.MinLength(3, {
        message: 'Name must be at least $constraint1 characters long',
    }),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1, { message: 'Email is required' }),
    class_validator_1.IsEmail(undefined, { message: 'Email is invalid' }),
    typegoose_1.prop({ unique: true, required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    class_validator_1.MinLength(1, {
        message: 'Password is required',
    }),
    class_validator_1.MinLength(6, {
        message: 'Password must be minimum $constraint1 characters long',
    }),
    typegoose_1.prop({
        required: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
User = __decorate([
    typegoose_1.pre('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isModified('password')) {
                this.password = yield argon2_1.default.hash(this.password);
            }
        });
    }),
    type_graphql_1.ObjectType()
], User);
exports.User = User;
exports.UserModel = typegoose_1.getModelForClass(User, {
    schemaOptions: { timestamps: true },
});
//# sourceMappingURL=User.js.map