import mysql from 'mysql'

const poolConfig = {
    host: 'localhost',
    user: 'root',
    database: 'dabbawalas',
    password: ''
}

export const pool = mysql.createPool(poolConfig)

export const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dabbawalas',
    password: ''
})