"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
//Error 404
const _404_controllers_1 = require("./controllers/404.controllers");
//Importing routes
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const restaurants_routes_1 = __importDefault(require("./routes/restaurants.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const customers_routes_1 = __importDefault(require("./routes/customers.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const addresses_routes_1 = __importDefault(require("./routes/addresses.routes"));
const managers_routes_1 = __importDefault(require("./routes/managers.routes"));
class App {
    constructor(port) {
        this.app = express_1.default();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.app.set('views', path_1.default.join(__dirname, 'views'));
        /* this.app.use(cors({
            origin: '*',
            methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        })) */
        this.app.engine('.hbs', express_handlebars_1.default({
            defaultLayout: 'main',
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'),
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'),
            extname: '.hbs',
            helpers: {
                ifCond: function (v1, operator, v2, options) {
                    switch (operator) {
                        case '==':
                            return (v1 == v2) ? options.fn(this) : options.inverse(this);
                        case '===':
                            return (v1 === v2) ? options.fn(this) : options.inverse(this);
                        case '!=':
                            return (v1 != v2) ? options.fn(this) : options.inverse(this);
                        case '!==':
                            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                        case '<':
                            return (v1 < v2) ? options.fn(this) : options.inverse(this);
                        case '<=':
                            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                        case '>':
                            return (v1 > v2) ? options.fn(this) : options.inverse(this);
                        case '>=':
                            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                        case '&&':
                            return (v1 && v2) ? options.fn(this) : options.inverse(this);
                        case '||':
                            return (v1 || v2) ? options.fn(this) : options.inverse(this);
                        default:
                            return options.inverse(this);
                    }
                }
            }
        }));
        this.app.set('view engine', '.hbs');
    }
    middlewares() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use('/', index_routes_1.default);
        this.app.use('/api', users_routes_1.default);
        this.app.use('/api/products', products_routes_1.default);
        this.app.use('/api/restaurants', restaurants_routes_1.default);
        this.app.use('/api/auth', auth_routes_1.default);
        this.app.use('/api/customers', customers_routes_1.default);
        this.app.use('/api/orders', orders_routes_1.default);
        this.app.use('/api/admin', admin_routes_1.default);
        this.app.use('/api/addresses', addresses_routes_1.default);
        this.app.use('/api/managers', managers_routes_1.default);
        this.app.use(_404_controllers_1.error404.get404Page);
    }
    listen() {
        this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}
exports.App = App;
