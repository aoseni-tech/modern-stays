import express, {Request, Response, NextFunction} from 'express';
const{Stay} = require('../models/staySchema');

function set_filter_names(sorting:string,rating:string,sortby:string,rated:string) {
    if(sorting == 'desc'){sortby = 'Newest' }
    else {sortby = 'Relevance'}

    if(rating == '3') {rated = '★★★ & up'}
    else if(rating == '4') {rated = '★★★★ & up'}
    else{rated = 'All'}
}

let sortBy:string;
let rate:string; 

const checkQuery = async(req:Request,res:Response,next:NextFunction)=>{   
    let{location,page_offset='0',sorts ='',ratings}:any = req.query;
     
    if(sorts == 'desc'){sortBy = 'Newest'}
    else {sortBy = 'Relevance', sorts = 'asc'}

    if(ratings == '3') {rate = '★★★ 3+'}
    else if(ratings == '4') {rate = '★★★★ 4+'}
    else{rate = 'All'}

    if(location === 'all') {location = ''}


    if(ratings && ratings > 1 && ratings <= 4)  {
        let query = {location: { "$regex": location, "$options": "i" },rating: {$gte: ratings}}
        let stayCount = await Stay.find(query).countDocuments();
        if(page_offset < 0){page_offset = 0}
        else if(page_offset > Math.floor(stayCount/10)){page_offset = Math.floor(stayCount/10)}
        res.locals.query = query;
        res.locals.stayCount = stayCount;
        res.locals.sorts = sorts;
        res.locals.page_offset = page_offset;
        res.locals.location = location;
        res.locals.sortBy = sortBy;
        res.locals.rate = rate;
        next()
    } else {
        let query = {location: { "$regex": location, "$options": "i" }}
        let stayCount = await Stay.find(query).countDocuments();
        if(page_offset < 0){page_offset = 0}
        else if(page_offset > Math.floor(stayCount/10)){page_offset = Math.floor(stayCount/10)}
        res.locals.query = query;
        res.locals.stayCount = stayCount;
        res.locals.sorts = sorts;
        res.locals.page_offset = page_offset;
        res.locals.location = location;
        res.locals.sortBy = sortBy;
        res.locals.rate = rate;
        next()
    }
  }

  module.exports = {checkQuery}