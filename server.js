var cors = require('cors')
const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect('mongodb://localhost/buzz', {
    useNewUrlParser: true,
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'));

app.use('/api/users', require('./routes/credentialsapi'));

app.listen(2552, () => console.log('Server Started at 2552'));