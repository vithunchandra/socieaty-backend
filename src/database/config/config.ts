export default () => ({
    dbName: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    name: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
})