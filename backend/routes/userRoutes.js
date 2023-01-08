const express = require('express')
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController')

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router()


router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route("/logout").get(logout)

router.route('/me').get(isAuthenticatedUser,getUserDetails)

router.route('/password/update').put(isAuthenticatedUser,updateUserPassword)

router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizedRoles("admin"),getAllUsers)

router.route('/admin/user/:id')
.get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser)

module.exports = router