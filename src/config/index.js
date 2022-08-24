process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const config = {
    endPointBasePort: process.env.NODE_ENV == 'development' ? 8080 : 5000,
    databaseUrl : process.env.MONGODB_URL,
    PORT: process.env.PORT,
    JWT: process.env.JWT_SECRET
}

export default config;