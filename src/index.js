import express from 'express';
import routes from './api/routes';
import config from './config';
import './loaders/database';

const app = express();
const port = config.PORT;

app.use(express.json());
app.use(routes);


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
