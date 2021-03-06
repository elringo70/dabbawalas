import express, { Application } from 'express'
import exphbs from 'express-handlebars'
import morgan from 'morgan'
import path from 'path'
import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'

//Error 404
import { error404 } from './controllers/404.controllers'

//Importing routes
import indexRoutes from './routes/index.routes'
import restaurantRoutes from './routes/restaurants.routes'
import productsRoutes from './routes/products.routes'
import usersRoutes from './routes/users.routes'
import authRoutes from './routes/auth.routes'
import customersRoutes from './routes/customers.routes'
import ordersRoutes from './routes/orders.routes'
import adminRoutes from './routes/admin.routes'

export class App {
    private app: Application
    private port: number | string | undefined
    private server: HTTPServer
    private io: Server

    constructor(port?: number | string | undefined) {
        this.app = express()
        this.server = new HTTPServer(this.app);
        this.io = new Server(this.server);
        this.settings()
        this.middlewares()
        this.routes()
    }

    private settings() {
        this.app.set('port', this.port || process.env.PORT || 3000)
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.engine('.hbs', exphbs({
            defaultLayout: 'main',
            layoutsDir: path.join(this.app.get('views'), 'layouts'),
            partialsDir: path.join(this.app.get('views'), 'partials'),
            extname: '.hbs',
            helpers: {
                ifCond: function (v1: any, operator: any, v2: any, options: any) {
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
        }))
        this.app.set('view engine', '.hbs')
        this.io.on('connection', (socket: Socket) => {
            require(__dirname + 'sockets.ts')(socket)
        })
    }

    private middlewares() {
        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }

    private routes() {
        this.app.use('/', indexRoutes)
        this.app.use('/api', usersRoutes)
        this.app.use('/api/products', productsRoutes)
        this.app.use('/api/restaurants', restaurantRoutes)
        this.app.use('/api/auth', authRoutes)
        this.app.use('/api/customers', customersRoutes)
        this.app.use('/api/orders', ordersRoutes)
        this.app.use('/api/admin', adminRoutes)
        this.app.use(error404.get404Page)
    }

    listen() {
        this.app.listen(this.app.get('port'))
        console.log('Server on port', this.app.get('port'))
    }
}