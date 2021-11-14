const express = require('express');

const app = express();
const usersRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

// Convert json bodies to JavaScript object
app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);

module.exports = app;
