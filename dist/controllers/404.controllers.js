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
exports.error404 = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class Error404 {
    get404Page(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = req.headers.cookie;
            const token = yield (cookies === null || cookies === void 0 ? void 0 : cookies.split('='));
            try {
                if (token[0] === 'token') {
                    const user = yield jsonwebtoken_1.verify(token[1], 'SECRET');
                    if (user.user) {
                        switch (user.user.usertype) {
                            case 'M':
                                res.status(404).render('404', {
                                    title: 'Error 404. Página no encontrada',
                                    user: user.user,
                                    manager: true,
                                    loggedIn: true
                                });
                                break;
                            case 'CO':
                                res.status(404).render('404', {
                                    title: 'Error 404. Página no encontrada',
                                    user: user.user,
                                    cooker: true,
                                    loggedIn: true
                                });
                                break;
                            case 'A':
                                res.status(404).render('404', {
                                    title: 'Error 404. Página no encontrada',
                                    user: user.user,
                                    admin: true,
                                    loggedIn: true
                                });
                                break;
                            default:
                                res.status(404).render('404', {
                                    title: 'Error 404. Página no encontrada'
                                });
                                break;
                        }
                    }
                }
                else {
                    res.status(404).render('404', {
                        title: 'Error 404. Página no encontrada'
                    });
                }
            }
            catch (error) {
                res.status(404).render('404', {
                    title: 'Error al cargar la página'
                });
            }
        });
    }
}
exports.error404 = new Error404();
