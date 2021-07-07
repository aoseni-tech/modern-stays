export {};
import express from 'express';
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
app.set('views', path.join(__dirname,'views'))

app.get('/', (req: any,res: { render: (arg0: string, arg1: { title: string;page:string; }) => void; })=>{
  const title = 'Modern Stays';
  const page = 'home';
  res.render('home',{title,page})
})

app.get('/search', async(req: any,res: { render: (arg0: string, arg1: { title: string;
stays:string;
page:string;
}) => void; })=>{
  try{
  const{location} = req.query;
  const stays = await Stay.find({location: new RegExp(location, 'i')});
  const title = 'Modern Stays.stays';
  const page = 'search';
  res.render('pages/search', {title,stays,page});
  }catch(e){
    console.log(e)
  }
})

app.get('/stays/new', (req: any,res: { render: (arg0: string, arg1: { title: string; page:string; }) => void; })=>{
  const title = 'Add new.MS';
  const page = 'new';
  res.render('pages/new',{title,page})
})

app.get('/stays/:id', async(req: any,res: { render: (arg0: string, arg1: {title: any; stay:any; page:string;}) => void; })=>{
  try{
    const stay = await Stay.findById(req.params.id);
    const{title} = stay;
    const page = 'show';
    res.render('pages/show',{title:title+'.MS',stay,page});
  }catch(e){
    console.log(e)
  }
})

app.post('/stays', async(req: any,res: { redirect: (arg0: string) => void; })=>{
    try{
    const stay = new Stay(req.body);
    await stay.save()
    res.redirect(`/stays/${stay._id}`);
    }catch(e){
      console.log(e)
    }
  })

app.get('/stays/:id/update', async(req: any,res: { render: (arg0: string, arg1: {title: any; stay:any; page:string;}) => void; })=>{
    try{
      const stay = await Stay.findById(req.params.id);
      const{title} = stay;
      const page = 'update';
      res.render('pages/update',{title:`Update ${title}.MS`,stay,page});
    }catch(e){
      console.log(e)
    }
  })

  app.put('/stays/:id', async(req: any,res: { redirect: (arg0: string) => void; })=>{
    try{
     const {id} = req.params;
     const update = req.body;
     const stay = await Stay.findByIdAndUpdate(id, update)
     res.redirect(`/stays/${stay._id}`);
    }catch(e){
      console.log(e)
    }
  })

  app.delete('/stays/:id', async(req: any,res: { redirect: (arg0: string) => void; })=>{
    try{
     const {id} = req.params;
     await Stay.findByIdAndRemove(id)
     res.redirect(`/`);
    }catch(e){
      console.log(e)
    }
  })



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = {db}