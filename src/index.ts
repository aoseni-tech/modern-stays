export {};
import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const appError = require('./utils/express_error');
const{ mongoose,Stay} = require('./models/staySchema');
const db = mongoose.connect('mongodb://localhost:27017/modernStays', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false}).then(() => {
  console.log('connection open!')
}).catch((err: { message: any; }) => console.log(err.message));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../views'))

app.get('/', (req: Request, res: Response)=>{
  const title = 'Modern Stays';
  const page = 'home';
  res.render('home',{title,page})
})

app.route('/stays')
.get(wrapAsync(async(req:Request, res: Response)=>{  
  const{location}:any = req.query;
  const stays = await Stay.find({location: new RegExp(location, 'i')});
  const title = 'Modern Stays.stays';
  const page = 'search';
  res.render('pages/searchResults', {title,stays,page});
}))
.post(wrapAsync(async(req:Request, res: Response)=>{
  const stay = new Stay(req.body);
  await stay.save()
  res.redirect(`/stays/${stay._id}`);
}));

app.get('/stays/new', (req:Request, res: Response)=>{
  const title = 'Add new.MS';
  const page = 'new';
  res.render('pages/new',{title,page})
})

app.route('/stays/:id')
 .get(wrapAsync(async(req:Request, res: Response)=>{
    const stay = await Stay.findById(req.params.id);
    const{title} = stay;
    const page = 'show';
    res.render('pages/show',{title:title+'.MS',stay,page});
}))
.put(wrapAsync(async(req:Request, res: Response)=>{
   const {id} = req.params;
   const update = req.body;
   const stay = await Stay.findByIdAndUpdate(id, update)
   res.redirect(`/stays/${stay._id}`);
}))
.delete(wrapAsync(async(req:Request, res: Response)=>{
   const {id} = req.params;
   await Stay.findByIdAndRemove(id)
   res.redirect(`/`);
}))

app.get('/stays/:id/update', wrapAsync(async(req:Request, res: Response)=>{
      const stay = await Stay.findById(req.params.id);
      const{title} = stay;
      const page = 'update';
      res.render('pages/update',{title:`Update ${title}.MS`,stay,page});
}));

app.all('*', (req:Request,res:Response,next:NextFunction) => {
     next(new appError('Page not found', 404));
})  

app.use((err:any,req:Request,res:Response,next:NextFunction) => {
  const {message = 'Something went wrong!',statusCode = '500'} = err;
  res.status(statusCode).send(message)
})  

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = {db}