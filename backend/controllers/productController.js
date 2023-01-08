const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errohandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
//create product---admin
exports.createProduct = catchAsyncErrors(async (req, res) => {

    req.body.user = req.user.id
    
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})
//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    // return next(new ErrorHandler("This is my temp error",500))
    const resultPerPage = 6;
    const productsCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter()

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    //  products = await apiFeature.query;

    res.status(200).json({ success: true, products, productsCount,resultPerPage,filteredProductsCount})
}
)
//get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    })
}
)
//update products---admin

exports.updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product notr found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})

//delete product ---admin

exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: " Product deleted successfully"
    })
}
)
//create New or update review
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{


    const {rating,comment,productID} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productID)

    const isReviewed = product.reviews.find(rev=> rev.user.toString()===req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if (rev=> rev.user.toString()===req.user._id.toString())
            rev.rating = rating,
            rev.comment = comment
        })
    }
    else{
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    let avg = 0

     product.reviews.forEach((rev)=>{
        avg += rev.rating
    })

    product.ratings = avg/product.reviews.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true
    })
})

//get all product reviews
exports.getAllProductReviews =catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//delete product review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });