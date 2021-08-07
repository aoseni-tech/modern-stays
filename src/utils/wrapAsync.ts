import { NextFunction } from "express"

module.exports = function (fn:any) {
    return  function(req:Request,res:Response,next:NextFunction) {
        fn(req,res,next).catch((err:Error) => next(err))
    }
};