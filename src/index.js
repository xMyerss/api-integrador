import express from 'express';
import fileUpload from 'express-fileupload'
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import usersRoute from './routes/users.routes.js'

const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Welcome
app.get('/', (req, res) => {
    res.status(200).json({ message: "Todo OK!"});
})


//Rutas
app.use('/users', usersRoute);


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})