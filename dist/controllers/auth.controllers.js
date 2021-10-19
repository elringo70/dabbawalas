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
exports.authController = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
const restaurant_1 = __importDefault(require("../models/restaurant"));
const emailConfirmation_1 = __importDefault(require("../services/emailConfirmation"));
const request_1 = __importDefault(require("request"));
class AuthController {
    postLoginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const body = req.body;
            let user;
            try {
                if (!errors.isEmpty()) {
                    return res.status(200).render('auth/login', {
                        title: 'Login',
                        errors: errors.array()
                    });
                }
                const query = `
                SELECT users.*
                FROM users
                WHERE email='${body.email}'
            `;
                const emailUser = yield user_1.default.findBy(query);
                if (!emailUser) {
                    return res.render('auth/login', {
                        title: 'Login',
                        status: 304,
                        errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                    });
                }
                if (!bcrypt_1.compareSync(`${body.pass}`, `${emailUser.pass}`)) {
                    return res.render('auth/login', {
                        title: 'Login',
                        status: 304,
                        errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                    });
                }
                switch (emailUser === null || emailUser === void 0 ? void 0 : emailUser.usertype) {
                    case 'M':
                        const verifiedManager = yield user_1.default.findByVerified(`${emailUser.id_user}`);
                        if (!verifiedManager) {
                            return res.render('auth/login', {
                                title: 'Login',
                                status: 304,
                                errorMessage: 'Cuenta esperando para ser aprobada'
                            });
                        }
                        const restaurant = yield restaurant_1.default.findWithUser(emailUser.id_user);
                        if (restaurant) {
                            user = {
                                id_user: emailUser.id_user,
                                email: emailUser.email,
                                name: emailUser.name + " " + emailUser.lastname,
                                usertype: emailUser.usertype,
                                image: emailUser.image,
                                lastpurchase: emailUser.lastpurchase,
                                id_restaurant: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant,
                                resturantName: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name
                            };
                            const token = jsonwebtoken_1.sign({ user }, 'SECRET', { expiresIn: '1h' });
                            res.cookie('token', token, {
                                httpOnly: false
                            });
                            return res.redirect('/api/restaurants/getManagerPage');
                        }
                        if (!restaurant) {
                            user = {
                                user: emailUser.id_user,
                                email: emailUser.email,
                                name: emailUser.name + " " + emailUser.lastname,
                                usertype: emailUser.usertype,
                                image: emailUser.image,
                                lastpurchase: emailUser.lastpurchase
                            };
                            const token = jsonwebtoken_1.sign({ user }, 'SECRET', { expiresIn: '1h' });
                            res.cookie('token', token, {
                                httpOnly: false
                            });
                            res.redirect('/api/restaurants/postNewRestaurant');
                        }
                        break;
                    case 'CA':
                    case 'CO':
                        const verifiedCooker = yield user_1.default.findById(`${emailUser.id_user}`);
                        if (!verifiedCooker) {
                            return res.render('auth/login', {
                                title: 'Login',
                                status: 304,
                                errorMessage: 'Usuario no existe o contraseña incorrecta'
                            });
                        }
                        const restaurantCooker = yield user_1.default.findById(emailUser.id_user);
                        if (restaurantCooker) {
                            user = {
                                id_user: emailUser.id_user,
                                email: emailUser.email,
                                name: emailUser.name + " " + emailUser.lastname,
                                usertype: emailUser.usertype,
                                id_restaurant: restaurantCooker === null || restaurantCooker === void 0 ? void 0 : restaurantCooker.id_restaurant
                            };
                            const token = jsonwebtoken_1.sign({ user }, 'SECRET', { expiresIn: '1h' });
                            res.cookie('token', token, {
                                httpOnly: false
                            });
                            if ((emailUser === null || emailUser === void 0 ? void 0 : emailUser.usertype) === 'CO') {
                                res.redirect('/api/orders/getAllTodayOrdersCookerPage');
                            }
                            if ((emailUser === null || emailUser === void 0 ? void 0 : emailUser.usertype) === 'CA') {
                                res.redirect('/api/orders/getNewOrderPage');
                            }
                        }
                        else {
                            return res.render('auth/login', {
                                title: 'Login',
                                status: 304,
                                errorMessage: 'Error al cargar la información del restaurante'
                            });
                        }
                        break;
                    case 'A':
                        const admin = yield user_1.default.findById(emailUser.id_user);
                        if (!admin) {
                            return res.render('auth/login', {
                                title: 'Login',
                                status: 304,
                                errorMessage: 'Usuario no existe o contraseña incorrecta'
                            });
                        }
                        if (admin) {
                            user = {
                                id_user: emailUser.id_user,
                                email: emailUser.email,
                                name: emailUser.name + " " + emailUser.lastname,
                                usertype: emailUser.usertype,
                                image: emailUser.image,
                            };
                            const token = jsonwebtoken_1.sign({ user }, 'SECRET', { expiresIn: '1h' });
                            res.cookie('token', token, {
                                httpOnly: false
                            });
                            return res.redirect('/api/admin/getAdminDashboardPage');
                        }
                        break;
                }
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Error al loguearse'
                });
            }
        });
    }
    getLogoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('token');
            res.redirect('/');
        });
    }
    getNotPermissionsPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'No authorization';
        res.render('permission', profile);
    }
    resetPasswordPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Cambiar la contraseña';
        res.render('auth/reset-pass', profile);
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const body = req.body;
            const profile = res.locals.profile;
            profile.title = 'Cambiar la contraseña';
            try {
                const findUser = yield user_1.default.findById(user.id_user);
                if (findUser) {
                    if (body.pass !== body.confpass) {
                        profile.message = 'Las contraseñas no coinciden';
                        return res.render('auth/reset-pass', profile);
                    }
                    if (bcrypt_1.compareSync(`${body.pass}`, `${findUser.pass}`)) {
                        profile.message = 'Su contraseña actual coincide';
                        return res.render('auth/reset-pass', profile);
                    }
                    const salt = bcrypt_1.genSaltSync(10);
                    const hashPass = bcrypt_1.hashSync(body.pass, salt);
                    const query = `
                    UPDATE users SET
                    pass='${hashPass}'
                    WHERE id_user=${user.id_user}
                `;
                    const userObject = new user_1.default();
                    yield userObject.updateById(query);
                    profile.message = 'Contraseña guardada con éxito';
                    return res.render('auth/reset-pass', profile);
                }
                profile.message = 'Error al encontrar al usuario';
                res.render('auth/reset-pass', profile);
            }
            catch (error) {
                if (error)
                    console.log(error);
                profile.message = 'Error al cambiar la contraseña';
                res.render('auth/reset-pass', profile);
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                const emailQuery = `
                SELECT id_user, email, name, lastname, maternalsurname FROM users WHERE email='${body.email}'
            `;
                const emailUser = yield user_1.default.findBy(emailQuery);
                const token = jsonwebtoken_1.sign({ email: emailUser.email }, 'SECRET', { expiresIn: '1h' });
                if (emailUser) {
                    const insertQueryToken = `
                    UPDATE users SET resetpasstoken='${token}' WHERE id_user=${emailUser.id_user}
                `;
                    yield user_1.default.findBy(insertQueryToken);
                    const nodeMailer = new emailConfirmation_1.default();
                    yield nodeMailer.sendEmail({
                        to: {
                            name: `Admin Dabbawalas`,
                            email: emailUser.email
                        },
                        from: {
                            name: 'Admin Dabbawalas',
                            email: 'dabbawalas2021@gmail.com'
                        },
                        subject: 'Reiniciar contraseña',
                        body: `
                        <!DOCTYPE html>
                        <html lang="es_MX">
                        
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
                            <title>Reinicar contraseña</title>
                        </head>
                        
                        <body>
                        
                            <h1>Por favor de click en el link</h1>
                            <br>
                            <h3>Tiene 1 hora para verificar el correo, si no tendra que realizar otro nuevamente</h3>
                        
                            <a href="http://localhost:3000/api/auth/confirmEmailPage/${token}">De click aquí para confirmar</a>
                        
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous"></script>
                        </body>
                        
                        </html>
                    `
                    });
                    return res.json({
                        status: 200,
                        message: 'Correo enviado'
                    });
                }
                res.json({
                    status: 200,
                    message: 'Correo enviado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al reinicar la contraseña'
                });
            }
        });
    }
    confirmCaptcha(req, res) {
        const captcha = req.body.captcha;
        try {
            if (captcha === undefined ||
                captcha === '' ||
                captcha === null) {
                return res.json({
                    status: 304,
                    message: 'Debe seleccionar el captcha para continuar'
                });
            }
            const secretKey = `6LfVkMscAAAAAN-T6hBONFdtLFX70pii4H0pn6fx`;
            const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.socket.remoteAddress}`;
            request_1.default(verificationURL, (error, response, body) => {
                body = JSON.parse(body);
                if (body.success !== undefined && !body.success) {
                    return res.json({
                        status: 304,
                        message: 'Fallo la verificacón de captcha'
                    });
                }
                if (body.success) {
                    res.status(200).json({
                        status: 200
                    });
                }
            });
        }
        catch (error) {
            if (error)
                console.log(error);
            res.json({
                status: 304,
                message: 'Error al enviar el captcha'
            });
        }
    }
    confirmEmailPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            try {
                if (token == '' ||
                    token == null ||
                    token == undefined) {
                    return res.render('auth/email-confirmation', {
                        title: 'Confirmación de correo electrónico',
                        active: true,
                        errorMessage: true
                    });
                }
                const verifyToken = yield jsonwebtoken_1.verify(token, 'SECRET');
                if (verifyToken) {
                    const query = `
                    SELECT id_user, resetpasstoken FROM users WHERE email='${verifyToken.email}'
                `;
                    const user = yield user_1.default.findBy(query);
                    const pass = createRandomPassword(8);
                    const salt = bcrypt_1.genSaltSync(10);
                    const hashPass = bcrypt_1.hashSync(pass, salt);
                    const resetPass = `
                    UPDATE users SET pass='${hashPass}' WHERE id_user=${user.id_user}
                `;
                    yield user_1.default.findBy(resetPass);
                    if (user.resetpasstoken == token) {
                        res.render('auth/email-confirmation', {
                            title: 'Confirmación de correo electrónico',
                            active: true,
                            message: true,
                            password: pass
                        });
                    }
                    else {
                        res.render('auth/email-confirmation', {
                            title: 'Confirmación de correo electrónico',
                            active: true,
                            errorMessage: true
                        });
                    }
                }
                else {
                    res.render('auth/email-confirmation', {
                        title: 'Confirmación de correo electrónico',
                        active: true,
                        errorMessage: true
                    });
                }
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('auth/email-confirmation', {
                    title: 'Confirmación de correo electrónico',
                    active: true,
                    errorMessage: 'Error al cargar la pagina de confirmación',
                    error: error
                });
            }
        });
    }
}
exports.authController = new AuthController();
function createRandomPassword(lenght) {
    const lowerChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < lenght; i++) {
        password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    }
    return password;
}
