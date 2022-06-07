import { createConnection } from "typeorm";

// Use Enviroment Var²iables
require('dotenv').config()

const connectDB = async () => {
    createConnection({
        type: 'mssql',
        host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        logging: false,
        synchronize: true,

        "entities": [
            "src/entity/**/*.ts"
        ],
        "migrations": [
            "src/migration/**/*.ts"
        ],
        "subscribers": [
            "src/subscriber/**/*.ts"
        ],
        extra: {
            ssl: {
                "rejectUnauthorized": false
            }
        }
    });

}
export default connectDB