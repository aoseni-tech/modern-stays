import {Request, Response, NextFunction} from 'express';
import {staySchema,Stay} from '../models/staySchema';
const mbxGeocoder = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoder({ accessToken: mapBoxToken });
class Validator {
  error: string;
  value: string;
 
  constructor(error: string,value: string=' ') {
    this.error = error;
    this.value = value;
  }

}

let stayValidation:any = {};
let formStatus:string;
let isValidated:boolean = true;
const clearInfo = () =>{
  for (var member in stayValidation) delete stayValidation[member];
  formStatus = ''
}

const checkStayValidity = async (req:Request,res:Response,next:NextFunction)=>{   
  clearInfo();
  for(let value in req.body) {
    req.body[value] = req.body[value].replace(/[&\/\\#+()$~%:*?<>{}]/g,'')
  }
  const stay = new Stay(req.body);
  stay.host = req.user?._id;
  let {id} = req.params;
  let schema_error  = stay.validateSync();
  let requiredPaths = staySchema.requiredPaths();
  if(schema_error || !req.isAuthenticated()){
    formStatus = 'form-validated';
    requiredPaths.forEach((path:string)=>{
      let key  = path;
      stayValidation[key]= new Validator(schema_error?.errors[`${path}`]?.message!,stay.get(path))
    })      
   if(stayValidation['description'].value.length<10) stayValidation['description'].value = "";
   for(let data in req.body) {
    //@ts-ignore
     if(!stayValidation[data].error) stayValidation[data].error = staySchema.obj[data].validate.message();
    }
    isValidated = false;
    if(req.method === 'PUT') return res.redirect(`/stays/${id}/update`)
    res.redirect(`/stays/new`);
  } else {
    isValidated = true;
    let geoData = await geoCoder.forwardGeocode({
      query: stay.location.slice(0,stay.location.indexOf(' ')),
      limit: 1
    }).send()

    let geometry = geoData.body.features[0]?.geometry;

    if(geometry) {stay.geometry = geometry;}
    else {
      let geoData = await geoCoder.forwardGeocode({
        query: stay.location.slice(0,2),
        limit: 1
      }).send()
      stay.geometry = geoData.body.features[0]?.geometry;
    }

    if(req.method === 'PUT') {res.locals.geometry = stay.geometry;}
    else {res.locals.stay = stay;}
    next();
  }
}

const validationResult = (req:Request,res:Response,next:NextFunction)=>{
  if(!isValidated) {
    res.locals.formStatus = formStatus;
    res.locals.stayValidation = stayValidation;
  }else {
    res.locals.formStatus = '';
    res.locals.stayValidation = {};
  }   
  next();
}

module.exports = {checkStayValidity,validationResult}