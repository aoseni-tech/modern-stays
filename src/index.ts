export {};
import express, { ErrorRequestHandler,Request, Response, NextFunction,Express } from 'express';
import path from 'path';
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const ejsMate = require('ejs-mate')
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

app.get('/search', async(req:Request, res: Response)=>{
  try{
  const{location}:any = req.query;
  const stays = await Stay.find({location: new RegExp(location, 'i')});
  const title = 'Modern Stays.stays';
  const page = 'search';
  res.render('pages/searchResults', {title,stays,page});
  }catch(e){
    console.log(e)
  }
})

app.get('/stays/new', (req:Request, res: Response)=>{
  const title = 'Add new.MS';
  const page = 'new';
  res.render('pages/new',{title,page})
})


app.route('/stays/:id')
 .get(async(req:Request, res: Response)=>{
  try{
    const stay = await Stay.findById(req.params.id);
    const{title} = stay;
    const page = 'show';
    res.render('pages/show',{title:title+'.MS',stay,page});
  }catch(e){
    console.log(e)
  }
})
.put(async(req:Request, res: Response)=>{
  try{
   const {id} = req.params;
   const update = req.body;
   const stay = await Stay.findByIdAndUpdate(id, update)
   res.redirect(`/stays/${stay._id}`);
  }catch(e){
    console.log(e)
  }
})
.delete(async(req:Request, res: Response)=>{
  try{
   const {id} = req.params;
   await Stay.findByIdAndRemove(id)
   res.redirect(`/`);
  }catch(e){
    console.log(e)
  }
})

app.post('/stays', async(req:Request, res: Response)=>{
    try{
    const stay = new Stay(req.body);
    await stay.save()
    res.redirect(`/stays/${stay._id}`);
    }catch(e){
      console.log(e)
    }
  })

app.get('/stays/:id/update', async(req:Request, res: Response)=>{
    try{
      const stay = await Stay.findById(req.params.id);
      const{title} = stay;
      const page = 'update';
      res.render('pages/update',{title:`Update ${title}.MS`,stay,page});
    }catch(e){
      console.log(e)
    }
  })

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = {db}