const express = require('express'),
app = express(),
port = 3000,
path = require('path'),
mongoose = require('mongoose'),
{ Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('connection open!')
}).catch(err => console.log(err.message));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

app.get('/', (req, res) => {
  const title = 'homePage'
  res.render('home',{title})
})

app.get('*',(req,res) => {
  res.send('page notFound');
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})