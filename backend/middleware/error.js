const ErrorHandler = require('../utils/errohandler');

module.exports =  (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server ERROR"


    // Wrong MongoDB ID error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid : ${err.path}`
        err = new ErrorHandler(message, 400)
    }
    //mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }
    //wrong jwt
    if(err.name === "jsonWebTokenError"){
        const message = `Json web token is invalid try again`
        err = new ErrorHandler(message, 400)
    }
    //jwt expire error
    if(err.name === "TokenExpireError"){
        const message = `Json web token is expired, try again`
        err = new ErrorHandler(message, 400)
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}