import {Request, Response, NextFunction} from 'express';
const wrapAsync = require('../utils/wrapAsync');
const{Stay} = require('../models/staySchema');

let sortBy:string;
let rate:string; 

const checkQuery = wrapAsync(async(req:Request,res:Response,next:NextFunction)=>{   
    let{location='',page_offset='0',sorts ='',ratings,checkInDate,checkOutDate}:any = req.query;
      
    if(sorts == 'desc'){sortBy = 'Newest'}
    else {sortBy = 'Relevance', sorts = 'asc'}

    if(typeof parseFloat(ratings) !== 'number' || parseFloat(ratings) > 4) {ratings = 0}

    if(ratings == '3') {rate = '★★★ 3+'}
    else if(ratings == '4') {rate = '★★★★ 4+'}
    else{rate = 'All', ratings = 0}

    if(location !== '') {location = location.replace(/\//g,'').trim()}

    let query = {location: { "$regex": location, "$options": "i" },rating: {$gte: ratings}}

    let start = new Date(checkInDate)
    let end = new Date(checkOutDate)
    let results = await Stay.find()
    .where('bookings').all([
       {
         $elemMatch: {
          $or:[
            {$and:[{lodgeIn:{$lte:start}},{lodgeOut:{$gte:start}}]},
            {$and:[{lodgeIn:{$lte:end}},{lodgeOut:{$gte:end}}]},      
            {$and:[{lodgeIn:{$gte:start}},{lodgeOut:{$lte:end}}]},
          ]
         }
       }  
      ])

    res.locals.query = query;
    res.locals.sorts = sorts;
    res.locals.page_offset = page_offset;
    res.locals.location = location;
    res.locals.sortBy = sortBy;
    res.locals.rate = rate;
    res.locals.results = results;
    next()  
  })

  module.exports = {checkQuery}