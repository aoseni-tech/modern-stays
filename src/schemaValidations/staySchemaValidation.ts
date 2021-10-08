import express, {Request, Response, NextFunction} from 'express';
import {schema,StayModel} from '../models/staySchema'
class Validator {
  error: string;
  value: string;
 
  constructor(error: string,value: string=' ') {
    this.error = error;
    this.value = value;
  }

}

let stayInfo:any = {};
let formStatus:string;
const clearInfo = () =>{
  for (var member in stayInfo) delete stayInfo[member];
  formStatus = ''
}

const createNewStay = (req:Request, res: Response)=>{
  const title = 'Add new.MS';
  const page = 'new';
  res.render('pages/new',{title,page,stayInfo,formStatus})
  clearInfo()
}

const updateStay = async(req:Request, res: Response)=>{
  const stay = await StayModel.findById(req.params.id);
  const title = stay?.title;
  const page = 'update';  
  res.render('pages/update',{title:`Update ${title}.MS`,stay,page,stayInfo,formStatus});
  clearInfo(); 
}

const checkStayValidity = (req:Request,res:Response,next:NextFunction)=>{   
  const stay = new StayModel(req.body);
  stay.host = req.user?._id;
  let {id} = req.params;
  let schema_error  = stay.validateSync();
  let requiredPaths = schema.requiredPaths();
  if(schema_error){
    formStatus = 'form-validated';
    requiredPaths.forEach((path:string)=>{
      let key  = path;
      stayInfo[key]= new Validator(schema_error?.errors[`${path}`]?.message!,stay.get(path))
    }) 
      
   if(stayInfo['description'].value.length<10) stayInfo['description'].value = "";
   for(let data in req.body) {
     if(!stayInfo[data].error) stayInfo[data].error = schema.obj[data].validate.message();
    }    
   if(req.method === 'PUT') return res.redirect(`/stays/${id}/update`)
   res.redirect(`/stays/new`);
  } else {
    res.locals.stay = stay;
    next();
  }
}

module.exports = {checkStayValidity,createNewStay,updateStay}