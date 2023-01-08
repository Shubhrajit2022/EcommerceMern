const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllProductReviews, deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts)

router.route('/admin/products/new').post(isAuthenticatedUser,authorizedRoles("admin"),createProduct)

router.route('/admin/products/:id')
.put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct)

router.route('/products/:id').get(getProductDetails)

router.route('/review').put(isAuthenticatedUser,createProductReview)

router.route('/allreviews').get(getAllProductReviews).delete(isAuthenticatedUser,deleteReview)

module.exports = router