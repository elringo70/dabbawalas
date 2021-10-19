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
exports.indexControllers = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class IndexControllers {
    getIndexPage(req, res) {
        const cookies = req.headers.cookie;
        const token = cookies === null || cookies === void 0 ? void 0 : cookies.split('=');
        if (token != null || token != undefined) {
            let jwtPayLoad;
            try {
                jwtPayLoad = jsonwebtoken_1.verify(token[1], 'SECRET');
                if (jwtPayLoad) {
                    res.redirect('/api/restaurants/manager');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        res.render('index', {
            title: 'Página principal',
            loggedIn: false
        });
    }
    getRestaurantIndexPage(req, res) {
        res.render('restaurants/index', {
            title: 'Dabbawalas Restaurant',
            loginIn: false
        });
    }
    getRestaurantRegistration(req, res) {
        res.status(200).render('restaurants/registration', {
            title: 'Página de registro de restaurant',
            loginIn: false
        });
    }
    getLoginPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = req.headers.cookie;
            try {
                if (cookies) {
                    const token = yield (cookies === null || cookies === void 0 ? void 0 : cookies.split('='));
                    const user = yield jsonwebtoken_1.verify(token[1], 'SECRET');
                    if (user) {
                        res.redirect('/api/restaurants/manager');
                    }
                    else {
                        res.clearCookie('token');
                        res.redirect('/login');
                    }
                }
                res.status(200).render('auth/login', {
                    title: 'Login',
                    loginIn: false
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al cargar la página de login'
                });
            }
        });
    }
}
exports.indexControllers = new IndexControllers();
