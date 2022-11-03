const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('.//routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Set CORS
app.use(cors());

// Allow complex request like (Delete, Patch and Put) when the browser sends a preflight request
app.options('*', cors());

// 1) Set security http header
app.use(helmet.crossOriginResourcePolicy('cross - origin'));
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
//       baseUri: ["'self'"],
//       fontSrc: ["'self'", 'https:', 'http:', 'data:'],
//       scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
//       styleSrc: ["'self'", 'https:', 'http:', 'unsafe-inline'],
//     },
//   })
// );

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files
// app.use(express.static(`${__dirname}/public/`));
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  // console.log(req.cookies);
  next();
});

// // app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getOneTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// // app.post('/api/v1/tours', createTour);

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server`
  // })

  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
