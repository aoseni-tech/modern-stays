module.exports = function (fn:any) {
    return  function(req:Request,res:Response,next:any) {
        fn(req,res,next).catch((err:Error) => next(err))
    }
};