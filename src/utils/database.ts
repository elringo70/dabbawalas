import mysql from 'mysql'
import util from 'util'

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

export function asyncConn() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dabbawalas',
        password: ''
    })

    return {
        query(query: string) {
            return util.promisify(connection.query)
                .call(connection, query);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    };
}

/* host: 'localhost',
user: 'root',
database: 'dabbawalas',
password: '' */

/* host: 'us-cdbr-east-04.cleardb.com',
user: 'b1c97ef4c685ed',
database: 'heroku_95d44d52299a0eb',
password: 'fb8b618a' */

//mysql://b1c97ef4c685ed:fb8b618a@us-cdbr-east-04.cleardb.com/heroku_95d44d52299a0eb?reconnect=true