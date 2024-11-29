"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// a middleware that extract the user payload from jwt token
const currentUser = (req, res, next) => {
    if (!req.session.jwt) {
        return next();
    }
    try {
        const payload = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = payload;
    }
    catch (err) {
        return next(err);
    }
    next();
};
exports.currentUser = currentUser;
