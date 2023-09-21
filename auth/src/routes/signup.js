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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupRouter = void 0;
var express_1 = require("express");
var joi_1 = require("joi");
var jsonwebtoken_1 = require("jsonwebtoken");
// import { validationResult } from "express-validator";
var user_1 = require("../models/user");
var validateRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, value, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                schema = joi_1.default.object({
                    username: joi_1.default.string().alphanum().min(6).max(30).required(),
                    password: joi_1.default.string().min(6).required(),
                    repeat_password: joi_1.default.ref("password"),
                    email: joi_1.default.string().email(),
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, schema.validateAsync(req.body)];
            case 2:
                value = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                //TODO: design an error handler system that have different classes for errors
                //TODO: and here  we can pass errors.array() to be handled
                //TODO: design a ValidationError class
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4:
                next();
                return [2 /*return*/];
        }
    });
}); };
var router = express_1.default.Router();
exports.signupRouter = router;
router.post("/api/users/signup", validateRequest, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, user, userJwt;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_1.User.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                //TODO:  design a  class for Bad Request Errors
                if (existingUser) {
                    throw new Error("Email in use");
                }
                user = user_1.User.build({ email: email, password: password });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                userJwt = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                }, process.env.JWT_KEY);
                // Store it on session object
                req.session = {
                    jwt: userJwt,
                };
                res.status(201).send(user);
                return [2 /*return*/];
        }
    });
}); });
