if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import mongoose from 'mongoose';
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Express_error = require('./utils/express_error');
const userRoute =  require('./routes/users');
const staysRoute =  require('./routes/stays');
const reviewsRoute = require('./routes/reviews');
const bookingsRoute = require('./routes/bookings');
const passport = require('passport');
import { User } from './models/userSchema';
const LocalStrategy = require('passport-local').Strategy;
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
import { cspOptions } from "./security/helmet";
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/modernStays';
const MongoStore = require('connect-mongo');
// 'mongodb://localhost:27017/modernStays'

function createDateString(date:string) {
  let options: object = {month:'short',year:'numeric',weekday:'short',day:'2-digit'};
  let dateString =  new Date(date?.replace(/-/g,'/')).toLocaleString('en-us', options);
  if(dateString != 'Invalid Date') return dateString
  else return;
}

const db = mongoose.connect(dbUrl, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify:false,
  useCreateIndex: true
}).then(() => {
  console.log('db connection open!')
}).catch((err: { message: any; }) => console.log(err.message));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../views'))
app.use(mongoSanitize());
app.use(helmet.contentSecurityPolicy(cspOptions))

const secret = process.env.SECRET || 'keyboardcat';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600 
})


const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req:Request, res: Response,next) => {
  res.locals.location = req.query.location;
  res.locals.checkInDate = req.query.checkInDate;
  res.locals.checkOutDate = req.query.checkOutDate;
  res.locals.checkIn = createDateString(res.locals.checkInDate)
  res.locals.checkOut = createDateString(res.locals.checkOutDate)
  res.locals.rating = req.query.ratings;
  res.locals.success = req.flash('success')
  res.locals.info = req.flash('info')
  res.locals.error = req.flash('error')
  res.locals.currentUser = req.user
  if(!['/login','/register'].includes(req.originalUrl)){
  req.session.returnTo = req.originalUrl
  }
  next()
})

app.use('/',userRoute)
app.use('/stays',staysRoute)
app.use('/stays/:id/reviews',reviewsRoute)
app.use('/stays/:id/bookings',bookingsRoute)

app.get('/', (req: Request, res: Response)=>{
  const title = 'Modern Stays';
  const page = 'home';
  res.render('pages/home',{title,page})
});

app.all('*', (req:Request,res:Response,next:NextFunction) => {
     next(new Express_error('Page Not Found', 404));
})  

app.use((err:any,req:Request,res:Response,next:NextFunction) => {
  const {message = 'Something went wrong!',statusCode = 500} = err;
  console.log(message);
  const title = 'page not found - 404'
  const page = 'error'
  res.status(statusCode).render('pages/error',{title,page,message})
})  

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = {db}