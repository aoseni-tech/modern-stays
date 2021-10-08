import {Request, Response, NextFunction} from 'express';
const wrapAsync = require('../utils/wrapAsync');

let sortBy:string;
let rate:string; 

const checkQuery = wrapAsync(async(req:Request,res:Response,next:NextFunction)=>{   
    let{location='',page_offset='0',sorts ='',ratings,checkInDate,checkOutDate}:any = req.query;

    let start = new Date(checkInDate);
    let end = new Date(checkOutDate);

    if(start.getTime() === start.getTime() && end.getTime() === end.getTime()) {
      res.locals.start = start;
      res.locals.end = end;
     } else {
      res.locals.start = new Date(Date.now());
      res.locals.end = new Date(Date.now());
     }
      
    if(sorts == 'desc'){sortBy = 'Newest'}
    else {sortBy = 'Relevance', sorts = 'asc'}

    if(typeof parseFloat(ratings) !== 'number' || parseFloat(ratings) > 4) {ratings = 0}

    if(ratings == '3') {rate = '★★★ 3+'}
    else if(ratings == '4') {rate = '★★★★ 4+'}
    else{rate = 'All', ratings = 0}

    if(location !== '') {location = location.replace(/\//g,'').trim()}

    let query = {location: { "$regex": location, "$options": "i" },rating: {$gte: ratings}}

    res.locals.query = query;
    res.locals.sorts = sorts;
    res.locals.page_offset = page_offset;
    res.locals.location = location;
    res.locals.sortBy = sortBy;
    res.locals.rate = rate;

    next()  
  })

  module.exports = {checkQuery}