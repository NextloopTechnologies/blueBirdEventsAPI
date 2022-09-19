import express from 'express';
import logger from './loaders/logger';

const startServer = () => {
    try{
        const app = express();
        require('./loaders').default({app});
    
        const PORT = process.env.PORT || 8080;
        
        app.listen(PORT, () => {
            console.log(`
            ################################################
            Server listening on port: ${PORT}
            ################################################
            `);
        });
    } catch(error) {
        logger('App').error(error);
    }
}

app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

startServer();  
