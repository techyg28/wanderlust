// To handle Asynchronous errors
module.exports= (fn) => {
       return (req,res,next)=> {
          fn(req,res,next).catch(next);
       }
}