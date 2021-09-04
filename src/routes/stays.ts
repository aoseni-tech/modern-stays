import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const {checkStayValidity,createNewStay,updateStay} = require('../schemaValidations/staySchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
const {checkQuery} = require('../middlewares/checkQuery');
const{Stay} = require('../models/staySchema');
const{reviewErrors} = require('../schemaValidations/reviewSchemaValidation');
const{bookErrors} = require('../schemaValidations/bookSchemaValidation');

router.route('')
.get(checkQuery,wrapAsync(async(req:Request, res: Response)=>{  
  const{query,stayCount,sorts,page_offset,location,rate,sortBy}=res.locals;
  const stays = await Stay.find(query)
  .sort({ _id: `${sorts}`})
  .populate('reviews')
  .limit(10)
  .skip(parseFloat(page_offset)*10);
  const title = `Modern Stays.${location}`;
  const page = 'search';
  res.render('pages/searchResults',{title,stays,page,stayCount,page_offset,rate,sortBy})
}))
.post(checkStayValidity,wrapAsync(async(req:Request, res: Response)=>{
  const {stay} = res.locals;
  await stay.save();
  res.redirect(`/stays/${stay._id}`);
}));

router.get('/new',createNewStay)
router.get('/:id/update', wrapAsync(updateStay));

router.route('/:id')
 .get(wrapAsync(async(req:Request, res: Response)=>{
  const {id} = req.params;
  const stay = await Stay.findById(id)
  .populate({ 
    path: 'reviews',
    options: {sort: { _id: 'desc'} } 
  });
  let {reviews,title} = stay;
  let page = 'show';
  res.render('pages/show',{title:title+'.MS',stay,page,reviews,reviewErrors,bookErrors});
  reviewErrors.length = 0;
  bookErrors.length = 0;
}))
.put(checkStayValidity,wrapAsync(async(req:Request, res: Response)=>{
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

module.exports = router;