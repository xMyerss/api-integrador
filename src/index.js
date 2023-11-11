import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
// Img
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import usersRoute from './routes/users.routes.js'

const app = express();
// Img
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Img
app.use('/public', express.static(`${__dirname}/storage/imgs`));
console.log(__dirname);


//Welcome
app.get('/', (req, res) => {
    res.status(200).json({ message: "Todo OK!"});
})


//Rutas
app.use('/users', usersRoute);


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})