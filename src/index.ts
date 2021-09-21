import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import mongoose from 'mongoose';
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const ejsMate = require('ejs-mate');
const Express_error = require('./utils/express_error');
const stays =  require('./routes/stays');
const reviews = require('./routes/reviews');
const bookings = require('./routes/book');

function createDateString(date:string) {
  let options: object = {month:'short',year:'numeric',weekday:'short',day:'2-digit'};
  let dateString =  new Date(date?.replace(/-/g,'/')).toLocaleString('en-us', options);
  if(dateString != 'Invalid Date') return dateString
  else return;
}

const db = mongoose.connect('mongodb://localhost:27017/modernStays', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false}).then(() => {
  console.log('db connection open!')
}).catch((err: { message: any; }) => console.log(err.message));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../views'))

app.use((req:Request, res: Response,next) => {
  res.locals.location = req.query.location;
  res.locals.checkInDate = req.query.checkInDate;
  res.locals.checkOutDate = req.query.checkOutDate;
  res.locals.checkIn = createDateString(res.locals.checkInDate)
  res.locals.checkOut = createDateString(res.locals.checkOutDate)
  res.locals.rating = req.query.ratings;
  next()
})

app.get('/', (req: Request, res: Response)=>{
  const title = 'Modern Stays';
  const page = 'home';
  res.render('home',{title,stays,page})
});

app.use('/stays',stays)
app.use('/stays/:id/reviews',reviews)
app.use('/stays/:id/bookings',bookings)

app.all('*', (req:Request,res:Response,next:NextFunction) => {
     next(new Express_error('Page Not Found', 404));
})  

app.use((err:any,req:Request,res:Response,next:NextFunction) => {
  const {message = 'Something went wrong!',statusCode = 500} = err;
  console.log(message);
  const title = 'page not found - 404'
  const page = 'error'
  res.status(statusCode).render('error',{title,page})
})  

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = {db}