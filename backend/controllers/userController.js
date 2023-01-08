const ErrorHandler = require('../utils/errohandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require("../models/userModels");
const sendToken = require('../utils/jwttoken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')

//Register an User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
    const {name,email,password} = req.body;
        try{
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id : myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    const message = `Welcome Mr./Mrs. ${user.name} to E-commerce. We're glad to have you with us.Find out awesome collection of products here. `
    
      await sendEmail ({
          email:user.email,
          subject: `Welcome to E-commerce`,
          message
      })
      res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`
      })
      sendToken(user,201,res)
   }catch (error) {
    return next(new ErrorHandler(error.message, 500))
 }
})

//Login User

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password"), 400)
    }
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Please Enter email or Password"),401)
    }
    const isPasswordMatched = await user.comparePassword(password)
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password"),401)
    }
    sendToken(user,200,res)
})

//log out user
exports.logout = catchAsyncErrors(async(req,res,next)=>{
        res.cookie("token",null,{
            expires: new Date(Date.now()),
            httpOnly: true,
        })


    res.status(200).json({
        success: true,
        message:"Logged Out"
    })
})

//forgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
   
    const user = await User.findOne({email: req.body.email})
    
    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    const resetToken = await user.getResetPasswordToken()
     await user.save({ validateBeforeSave: false})

     const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`


     const message = `Your password reset token is temp:= \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`

     try {
        await sendEmail ({
            email:user.email,
            subject: `Ecommerce password recovery`,
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
     } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500))
     }

})

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  //get user details
  exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id)

    res.status (200).json({
        success: true,
        user
    })

  })

  //update user password
  exports.updateUserPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect"),401)
    }

    if(req.body.newPassword !==req.body.confirmPassword){
        return next(new ErrorHandler("New password doesn't match"),401)
    }
    user.password = req.body.newPassword

     await user.save()

    sendToken(user,200,res)

  })

  //update user profile
  exports.updateUserProfile = catchAsyncErrors(async(req,res,next)=>{

    const newuserData ={
        name: req.body.name,
        email: req.body.email,

    }
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newuserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id,newuserData,{
        new: true,
        runValidators: true,
        useFindAndModify: true
    })

    res.status(200).json({
        success: true
    })
  })

  //get all users(admin)
  exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
  })
   //get single user(admin)
   exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
  })

  //update user role -- admin
  exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newuserData ={
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id,newuserData,{
        new: true,
        runValidators: true,
        useFindAndModify: true
    })

    res.status(200).json({
        success: true
    })
  })
// delete user -- admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not exist ${req.params.id}`))
    }

    await user.remove()

    res.status(200).json({
        success: true,
        message: 'user deleted successfully'
    })
  })
