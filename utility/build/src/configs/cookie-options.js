"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
exports.cookieOptions = {
    signed: false,
    // keys: [process.env.COOKIE_KEY1!, process.env.COOKIE_KEY2!],
    secure: process.env.NODE_ENV !== " test",
};
