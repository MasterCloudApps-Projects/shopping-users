const express = require('express');
const app = express();
const usersRouter = require('./routes/userRouter.js');

//Convert json bodies to JavaScript object
app.use(express.json());
app.use('/api/v1/users', usersRouter);

module.exports = app;