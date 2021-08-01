import mysql from 'mysql'

const poolConfig = {
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b1c97ef4c685ed',
    database: 'heroku_95d44d52299a0eb',
    password: 'fb8b618a'
}

export const pool = mysql.createPool(poolConfig)

export const conn = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b1c97ef4c685ed',
    database: 'heroku_95d44d52299a0eb',
    password: 'fb8b618a'
})

/* host: 'localhost',
user: 'root',
database: 'dabbawalas',
password: '' */

/* host: 'us-cdbr-east-04.cleardb.com',
user: 'b1c97ef4c685ed',
database: 'heroku_95d44d52299a0eb',
password: 'fb8b618a' */

//mysql://b1c97ef4c685ed:fb8b618a@us-cdbr-east-04.cleardb.com/heroku_95d44d52299a0eb?reconnect=true