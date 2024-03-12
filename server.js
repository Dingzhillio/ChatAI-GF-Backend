import path from 'path';
import cors from 'cors';
import express from 'express';
import connectDB from './src/config/db.js';
import authRoute from './src/routes/authRoutes.js';
import dotenv from 'dotenv';
import mainRoute from './src/routes/mainRoutes.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

const __dirname = path.resolve;

dotenv.config()

if(process.env.NODE_ENV === undefined) {
    dotenv.config({ path: '.env'})
}

connectDB();

const app = express()

//Body parser
app.use(express.json())

//CookieParser
app.use(cookieParser());
//Cors
// app.use(cors({ origin: '*' }));
app.use(cors());

// Handle preflight requests
app.options('*', cors());

app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true
    })
);

//API routes
app.use('/', authRoute);
app.use('/', mainRoute);



// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '/frontend/build')))

//     app.get('*', (req, res) =>
//         res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//     )
// }

const PORT = process.env.PORT || 4000;
app.listen(
    PORT, console.log(
        `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
    )
)