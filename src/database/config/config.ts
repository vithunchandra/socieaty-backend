export default () => ({
    host: process.env.DB_HOST ?? 'localhost',
    dbName: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
})