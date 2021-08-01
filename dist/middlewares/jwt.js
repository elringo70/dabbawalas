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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class JWT {
    checkJWT(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = req.headers.cookie;
            const token = yield (cookies === null || cookies === void 0 ? void 0 : cookies.split('='));
            try {
                if (token[0] === 'token') {
                    const user = yield jsonwebtoken_1.verify(token[1], 'SECRET');
                    if (user) {
                        res.locals.token = user.user;
                        next();
                    }
                    else {
                        res.clearCookie('token');
                        res.redirect('/login');
                    }
                }
            }
            catch (error) {
                res.clearCookie('token');
                res.redirect('/login');
            }
        });
    }
}
const jwt = new JWT();
exports.default = jwt;
