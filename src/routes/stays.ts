import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const {checkStayValidity,createNewStay,updateStay}= require('../schemaValidations/staySchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
const {checkQuery} = require('../middlewares/stayQuery');
import { StayModel } from '../models/staySchema';
import { BookModel,Book } from '../models/bookingSchema';
import {UserModel} from '../models/userSchema'
import { Schema } from 'mongoose';
let{reviewErrors} = require('../schemaValidations/reviewSchemaValidation');
const{bookErrors} = require('../schemaValidations/bookSchemaValidation');
const {isAuthenticated} = require('../middlewares/isAuthenticated');
import {authenticatePost}  from '../middlewares/authenticatePost'
import {isHost}  from '../middlewares/isHost'

router.route('')
.get(checkQuery,wrapAsync(async(req:Request, res: Response)=>{  
  let{query,sorts,location,page_offset,start,end}=res.locals;
      
      await BookModel.find({
       $or:[
         {$and:[{lodgeIn:{$lte:start}},{lodgeOut:{$gte:start}}]},
         {$and:[{lodgeIn:{$lte:end}},{lodgeOut:{$gte:end}}]},      
         {$and:[{lodgeIn:{$gte:start}},{lodgeOut:{$lte:end}}]},
       ]
    }, async (err:Error, docs:Array<Book>) => {
        let bookingsID: Array<Schema.Types.ObjectId> = [];
        docs.forEach((doc:Book) => {
          bookingsID.push(doc._id)
        })

        let stayCount = await StayModel.find(query)
        .where('bookings').nin(bookingsID).countDocuments()

        if(page_offset < 0 || typeof parseFloat(page_offset) !== 'number'){page_offset = 0}
        else if(page_offset > Math.floor(stayCount/5)){page_offset = Math.floor(stayCount/5)}

        let stays = await StayModel.find(query)
        .sort({ _id: sorts})
        .where('bookings').nin(bookingsID)
        .skip(parseFloat(page_offset)*5)
        .limit(5)       

        const title = `Modern Stays.${location || 'All'}`;
        const page = 'search';
        res.render('pages/searchResults',{title,stays,page,stayCount,page_offset})

    })

}))
.post(authenticatePost,checkStayValidity,wrapAsync(async(req:Request, res: Response)=>{
  const {stay} = res.locals;
  await UserModel.findByIdAndUpdate(stay.host,{$push:{stays:stay._id}})
  await stay.save();
  req.flash('success', `Successfully added to the listings:  ${stay.title}, ${stay.location}.`)
  res.redirect(`/stays/${stay._id}`);
}));

router.get('/new',isAuthenticated,createNewStay)
router.get('/:id/update',isAuthenticated,isHost,wrapAsync(updateStay));

router.route('/:id')
 .get(wrapAsync(async(req:Request, res: Response)=>{
  const {id} = req.params;
  const stay = await StayModel.findById(id)
  .populate({ 
    path: 'reviews',
    options: {sort: { _id: 'desc'} } 
  });
  let {reviews,title,bookings} = stay!;
  let page = 'show';
  let review_formStatus = ''
  if(reviewErrors.length) review_formStatus = 'form-validated'
  res.render('pages/show',{title:title+'.MS',stay,page,reviews,reviewErrors,bookErrors,bookings,review_formStatus});
}))
.put(authenticatePost,isHost,checkStayValidity,wrapAsync(async(req:Request, res: Response)=>{
   const {id} = req.params;
   const update = req.body;
   const stay = await StayModel.findByIdAndUpdate(id, update)
   let {title,location} = stay!;
   req.flash('success', `Updated your listing:  ${title}, ${location}.`)
   res.redirect(`/stays/${id}`);
}))
.delete(authenticatePost,isHost,wrapAsync(async(req:Request, res: Response)=>{
   const {id} = req.params;
   const stay = await StayModel.findByIdAndRemove(id)
   const user = await UserModel.findById(stay?.host)
   let {stays} = user!;
   let i = stays?.indexOf(stay?._id)!
   if (i > -1) {
    stays?.splice(i, 1);
   }
   await user?.save()
   let {title,location} = stay!;
   req.flash('info', `${title}, ${location}. have been removed from your listings`)
   res.redirect(`/`);
}))

module.exports = router;