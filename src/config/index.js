process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export default {
    endPointBaseUrl: process.env.NODE_ENV != 'production' ? 'http://localhost:8080' : 'api.bluebirdevents.io',
    isProduction: process.env.NODE_ENV == 'production',
    clientbaseUrl: 'https://blue-bird-events-blue-bird-events.vercel.app',
    databaseUrl : process.env.MONGODB_URL,
    JWT: process.env.JWT_SECRET,
    AWS_RN: process.env.AWS_REGION_NAME,
    AWS_BN: process.env.AWS_BUCKET_NAME,
    AWS_AK: process.env.AWS_ACCESS_KEY,
    AWS_SK: process.env.AWS_SECRET_KEY,
    SG_KEY: process.env.SENDGRID_ACCESS
};
