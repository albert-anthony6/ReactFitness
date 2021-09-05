const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const courseRouter = require('./routes/courseRoutes');
const AppError = require('./utils/appError');

const app = express();

app.use(express.json());

app.use('/api/v1/courses', courseRouter);

app.all('*', (req, res, next) => {
  //   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  //   err.status = 'fail';
  //   err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use('*', globalErrorHandler);

module.exports = app;
