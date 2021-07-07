"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const methodOverride = require('method-override');
const app = express_1.default();
const port = 3000;
const ejsMate = require('ejs-mate');
const { mongoose, Stay } = require('./models/staySchema');
const db = mongoose.connect('mongodb://localhost:27017/modernStays', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('connection open!');
}).catch((err) => console.log(err.message));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.get('/', (req, res) => {
    const title = 'Modern Stays';
    const page = 'home';
    res.render('home', { title, page });
});
app.get('/search', async (req, res) => {
    try {
        const { location } = req.query;
        const stays = await Stay.find({ location: new RegExp(location, 'i') });
        const title = 'Modern Stays.stays';
        const page = 'search';
        res.render('pages/search', { title, stays, page });
    }
    catch (e) {
        console.log(e);
    }
});
app.get('/stays/new', (req, res) => {
    const title = 'Create new.MS';
    const page = 'new';
    res.render('pages/new', { title, page });
});
app.get('/stays/:id', async (req, res) => {
    try {
        const stay = await Stay.findById(req.params.id);
        const { title } = stay;
        const page = 'show';
        res.render('pages/show', { title: title + '.MS', stay, page });
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/stays', async (req, res) => {
    try {
        const stay = new Stay(req.body);
        await stay.save();
        res.redirect(`/stays/${stay._id}`);
    }
    catch (e) {
        console.log(e);
    }
});
app.get('/stays/:id/update', async (req, res) => {
    try {
        const stay = await Stay.findById(req.params.id);
        const { title } = stay;
        const page = 'update';
        res.render('pages/update', { title: `Update ${title}.MS`, stay, page });
    }
    catch (e) {
        console.log(e);
    }
});
app.put('/stays/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const stay = await Stay.findByIdAndUpdate(id, update);
        res.redirect(`/stays/${stay._id}`);
    }
    catch (e) {
        console.log(e);
    }
});
app.delete('/stays/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Stay.findByIdAndRemove(id);
        res.redirect(`/`);
    }
    catch (e) {
        console.log(e);
    }
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
module.exports = { db };
