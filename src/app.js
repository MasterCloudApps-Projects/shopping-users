const express = require('express');

const app = express();
const usersRouter = require('./routes/userRouter');
const userAuthRouter = require('./routes/userAuthRouter');
const adminsRouter = require('./routes/adminRouter');
const adminAuthRouter = require('./routes/adminAuthRouter');

// Convert json bodies to JavaScript object
app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', userAuthRouter);
app.use('/api/v1/admins', adminsRouter);
app.use('/api/v1/admins/auth', adminAuthRouter);

module.exports = app;
