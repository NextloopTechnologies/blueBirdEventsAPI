process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const config = {
    endPointBasePort: process.env.NODE_ENV == 'development' ? 8080 : 5000
}

module.exports = config