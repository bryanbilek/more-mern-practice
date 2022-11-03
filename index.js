const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
require('dotenv').config()
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express();
const port = process.env.PORT || 5500;
const connect = process.env.CONNECT;

app.use(express.json(), cors(), helmet());
app.use('/api/posts', postRoutes);
app.use('/api/auth', userRoutes);

mongoose.connect(connect);

app.get('/', (req, res) => res.send('MERN AUTH API HOMEPAGE'));

app.listen(port, () => console.log(`app listening on port: ${port}`))