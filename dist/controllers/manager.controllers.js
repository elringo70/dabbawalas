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
exports.managerControllers = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
const manager_1 = __importDefault(require("../models/manager"));
const orders_1 = __importDefault(require("../models/orders"));
const product_1 = __importDefault(require("../models/product"));
const customer_1 = __importDefault(require("../models/customer"));
const emailConfirmation_1 = __importDefault(require("../services/emailConfirmation"));
class ManagerControllers {
    //Profit chart page
    getChartsPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Gráficas';
        res.render('managers/charts', profile);
    }
    getPersonnelPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Personal';
        res.render('managers/personnel', profile);
    }
    getPersonnel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const personnelQuery = `
                SELECT
                    id_user,
                    email,
                    CONCAT(name, " ", lastname, " ", maternalsurname) AS fullname,
                    dob,
                    phone,
                    usertype,
                    CONCAT(addresses.street, " ", addresses.number, ", ", colonias.nombre, ", ", municipios.nombre, ", ", estados.nombre) AS address
                FROM users
                JOIN addresses
                    ON users.id_address = addresses.id_address
                JOIN colonias
                    ON addresses.id_municipality=colonias.id
                JOIN municipios
                    ON addresses.id_city=municipios.id
                JOIN estados
                    ON addresses.id_state=estados.id
                WHERE id_restaurant=${user.id_restaurant}
                    AND (usertype='CA' OR usertype='CO')
            `;
                const personnel = yield user_1.default.fetchAllAny(personnelQuery);
                res.json({
                    status: 200,
                    personnel
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al cargar el personal del restaurant'
                });
            }
        });
    }
    getNewEmployeePage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Agregar un empleado';
        res.render('managers/new-employee', profile);
    }
    postNewEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const body = req.body;
            try {
                if (!errors.isEmpty()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const emailQuery = `
                SELECT email
                FROM users
                WHERE email='${body.email}'
            `;
                const searchEmail = yield user_1.default.findBy(emailQuery);
                if (searchEmail) {
                    return res.json({
                        status: 304,
                        message: 'Correo electrónico ya se encuentra registrado'
                    });
                }
                let position = '';
                switch (req.body.position) {
                    case '1':
                        position = 'CA';
                        break;
                    case '2':
                        position = 'CO';
                        break;
                }
                const password = createRandomPassword(10);
                const salt = bcrypt_1.genSaltSync(10);
                const hashPass = bcrypt_1.hashSync(password, salt);
                const employee = {
                    name: body.name.toUpperCase(),
                    lastname: body.lastname.toUpperCase(),
                    maternalsurname: body.maternalsurname.toUpperCase(),
                    pass: hashPass,
                    dob: body.dob,
                    email: body.email,
                    gender: body.gender,
                    usertype: position,
                    phone: body.phone,
                    active: 1,
                    id_restaurant: user.id_restaurant
                };
                const address = {
                    id_state: body.state,
                    id_city: body.city,
                    id_municipality: body.municipality,
                    number: body.number,
                    street: body.street.toUpperCase()
                };
                const newEmployee = new user_1.default();
                yield newEmployee.saveEmployee(employee, address);
                const nodeMailer = new emailConfirmation_1.default();
                yield nodeMailer.sendEmail({
                    to: {
                        name: `Admin Dabbawalas`,
                        email: employee.email
                    },
                    from: {
                        name: 'Admin Dabbawalas',
                        email: 'dabbawalas2021@gmail.com'
                    },
                    subject: 'Contraseña para su cuenta',
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
                        
                            <h1>Su contraseña sera la siguiente</h1>
                            <br>
                            <h3>${password}</h3>
                        
                        
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous"></script>
                        </body>
                        
                        </html>
                    `
                });
                res.json({
                    status: 200,
                    message: 'Empleado guardado con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al crear el nuevo empleado'
                });
            }
        });
    }
    postNewManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const body = req.body;
            try {
                if (!errors.isEmpty()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const query = `
                SELECT email
                FROM users
                WHERE email='${body.email}'
                AND usertype='M'
            `;
                const managerEmail = yield user_1.default.findBy(query);
                if (managerEmail) {
                    return res.json({
                        status: 200,
                        message: 'El correo electrónico ya se encuentra registrado'
                    });
                }
                if (body.pass !== body.confpass) {
                    return res.json({
                        status: 304,
                        message: 'Las constraseñas no coinciden'
                    });
                }
                const salt = bcrypt_1.genSaltSync(10);
                const hashPass = bcrypt_1.hashSync(body.pass, salt);
                const managerObject = {
                    name: body.name.toUpperCase(),
                    lastname: body.lastname.toUpperCase(),
                    maternalsurname: body.maternalsurname.toUpperCase(),
                    dob: body.dob,
                    phone: body.phone,
                    usertype: 'M',
                    active: 1,
                    email: body.email,
                    pass: hashPass,
                    gender: body.gender,
                    position: 'Supervisor',
                    verified: 'UNVERIFIED',
                };
                const managerAddress = {
                    id_state: body.state,
                    id_city: body.city,
                    id_municipality: body.municipality,
                    number: body.number,
                    street: body.street.toUpperCase()
                };
                const manager = new manager_1.default();
                yield manager.save(managerObject, managerAddress);
                res.json({
                    status: 201,
                    message: 'Supervisor de tienda almacenado con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al registrar al supervisor'
                });
            }
        });
    }
    getManagerByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            try {
                const query = `SELECT email FROM users WHERE email='${email}'`;
                const managerEmail = yield manager_1.default.findBy(query);
                if (managerEmail) {
                    return res.json({
                        status: 200,
                        message: 'El correo electrónico ya se encuentra registrado'
                    });
                }
                res.json({
                    status: 202,
                    message: 'Correo electrónico disponible'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al buscar el correo electrónico del supervisor'
                });
            }
        });
    }
    editManagerPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const profile = res.locals.profile;
            profile.title = 'Editar mi información';
            try {
                const manager = yield manager_1.default.findById(id);
                if (!manager) {
                    profile.status = 400;
                    return profile.message = 'El id que envió no se encuentra';
                }
                profile.status = 200;
                profile.manager = manager;
            }
            catch (error) {
                if (error)
                    console.log(error);
                profile.message = 'Error al cargar la página del supervisor';
            }
            res.render('managers/edit-manager', profile);
        });
    }
    editManagerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            try {
                const manager = yield manager_1.default.findById(id);
                if (manager) {
                    const managerObject = {
                        id_user: id,
                        name: body.name,
                        lastname: body.lastname,
                        maternalsurname: body.maternalsurname,
                        dob: body.dob,
                        email: body.email,
                        gender: body.gender,
                        position: 'Supervisor',
                        verified: 'VERIFIED',
                        phone: body.phone
                    };
                    const addressObject = {
                        id_address: manager.id_address,
                        id_state: body.state,
                        id_city: body.city,
                        id_municipality: body.municipality,
                        street: body.street,
                        number: body.number
                    };
                    const editManager = new manager_1.default();
                    yield editManager.updateById(managerObject, addressObject);
                    return res.json({
                        status: 201,
                        message: 'Guardado con éxito'
                    });
                }
                res.json({
                    status: 400,
                    message: 'Error con el id del supervisor'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al editar al supervisor'
                });
            }
        });
    }
    chartDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const body = req.body;
            let dashboard = {
                card12: null,
                card34: null,
                salesRevenueChart: null,
                bestSellingProduct: null,
                topSalesCustomer: null
            };
            try {
                //Cards, card 1 and 2
                const sales = salesRevenue(body.option, user.id_restaurant);
                const card12 = yield orders_1.default.fetchAllAny(sales);
                dashboard.card12 = card12;
                //Cards, card 3 and 4
                const profit = profitCost(body.option, user.id_restaurant);
                const card34 = yield orders_1.default.fetchAllAny(profit);
                dashboard.card34 = card34;
                const salesRevenueQuery = `
                SELECT date, SUM(orders.total) AS total
                FROM (
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 1 MONTH AS date UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 2 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 3 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 4 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 5 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 6 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 7 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 8 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 9 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 10 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 11 MONTH UNION ALL
                    SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 12 MONTH
                ) AS dates
                LEFT JOIN orders ON createdAt >= date AND createdAt < date + INTERVAL 1 MONTH
                GROUP BY date
            `;
                const salesRevenueChart = yield orders_1.default.fetchAllAny(salesRevenueQuery);
                dashboard.salesRevenueChart = salesRevenueChart;
                const productQuery = bestSellingProductQuery(body.option, user.id_restaurant);
                const bestSellingProduct = yield product_1.default.fetchAll(productQuery);
                dashboard.bestSellingProduct = bestSellingProduct;
                const topSalesCustomerQuery = customerQuery(body.option, user.id_restaurant);
                const topSalesCustomer = yield customer_1.default.fetchAll(topSalesCustomerQuery);
                dashboard.topSalesCustomer = topSalesCustomer;
                res.json(dashboard);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al cargar el dashboard del supervisor'
                });
            }
        });
    }
}
exports.managerControllers = new ManagerControllers();
//Additional functions
function salesRevenue(option, id) {
    let date = ``;
    switch (option) {
        case 1:
            date = `
                AND YEARWEEK(createdAt) = YEARWEEK(NOW())
            `;
            break;
        case 2:
            date = `
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND YEAR(createdAt) = YEAR(CURRENT_DATE())
            `;
            break;
        case 3:
            date = `
                AND YEAR(createdAt) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                AND MONTH(createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
            `;
            break;
        case 4:
            date = `
                AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH);
            `;
            break;
        case 5:
            date = `
                AND createdAt = YEAR(CURDATE());
            `;
            break;
    }
    let query = `
        SELECT
            COUNT(*) AS totalsales, SUM(total) AS revenue
        FROM orders
        WHERE id_restaurant=${id}
            ${date}
        `;
    return query;
}
function profitCost(option, id) {
    let date = ``;
    switch (option) {
        case 1:
            date = `
                AND YEARWEEK(createdAt) = YEARWEEK(NOW())
            `;
            break;
        case 2:
            date = `
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND YEAR(createdAt) = YEAR(CURRENT_DATE())
            `;
            break;
        case 3:
            date = `
                AND YEAR(createdAt) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                AND MONTH(createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
            `;
            break;
        case 4:
            date = `
                AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            `;
            break;
        case 5:
            date = `
                AND createdAt = YEAR(CURDATE())
            `;
            break;
    }
    let query = `
        SELECT SUM(products.cost) AS cost,
            (SELECT SUM(products.price) FROM products WHERE id_restaurant=6 ${date})
            -
            (SELECT SUM(products.cost) FROM products WHERE id_restaurant=6 ${date}) AS profit
        FROM products
        WHERE id_restaurant=${id}
            ${date}
        `;
    return query;
}
function bestSellingProductQuery(option, id) {
    let date = ``;
    switch (option) {
        case 1:
            date = `
                AND YEARWEEK(createdAt) = YEARWEEK(NOW())
            `;
            break;
        case 2:
            date = `
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND YEAR(createdAt) = YEAR(CURRENT_DATE())
            `;
            break;
        case 3:
            date = `
                AND YEAR(createdAt) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                AND MONTH(createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
            `;
            break;
        case 4:
            date = `
                AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            `;
            break;
        case 5:
            date = `
                AND createdAt = YEAR(CURDATE())
            `;
            break;
    }
    let query = `
        SELECT products.name, SUM(order_detail.quantity) AS quantity
        FROM order_detail
        JOIN products
            ON order_detail.id_product = products.id_product
        WHERE order_detail.id_restaurant=${id}
        ${date}
        GROUP BY order_detail.id_product
        ORDER BY quantity ASC
    `;
    return query;
}
function customerQuery(option, id) {
    let date = ``;
    switch (option) {
        case 1:
            date = `
                AND YEARWEEK(createdAt) = YEARWEEK(NOW())
            `;
            break;
        case 2:
            date = `
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND YEAR(createdAt) = YEAR(CURRENT_DATE())
            `;
            break;
        case 3:
            date = `
                AND YEAR(createdAt) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                AND MONTH(createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
            `;
            break;
        case 4:
            date = `
                AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            `;
            break;
        case 5:
            date = `
                AND createdAt = YEAR(CURDATE())
            `;
            break;
    }
    let query = `
        SELECT CONCAT(users.name, " ", users.lastname, " ", users.maternalsurname) AS fullname,
            COUNT(orders.id_user) AS quantity,
            SUM(orders.total) AS expense
        FROM orders
        JOIN users
            ON orders.id_user = users.id_user
        WHERE orders.id_restaurant=${id}
        ${date}
        GROUP BY orders.id_user
        ORDER BY expense ASC
        LIMIT 5
    `;
    return query;
}
function createRandomPassword(lenght) {
    const lowerChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < lenght; i++) {
        password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    }
    return password;
}
