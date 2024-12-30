import { Router } from "express";
import * as rh from './requestHandler.js'
import Auth from "./middleware/Auth.js";

const router=Router()

router.route('/signup').post(rh.signup)
router.route('/signin').post(rh.signin)
router.route('/email').post(rh.checkEmail)
router.route('/displayprofile').get(Auth,rh.displayProfile)
router.route('/editprofile').put(Auth,rh.editProfile)
router.route('/address').post(rh.addAddress)
router.route('/getAddress').get(rh.displayAddress)
router.route('/editAddress/:_id').put(rh.editAddress)
router.route('/deleteAddress/:_id').delete(rh.deleteAddress)
// company
router.route('/editcompany').post(Auth,rh.editComapany)
router.route('/getcompany').get(Auth,rh.getCompany)

// category
router.route('/category').post(rh.category)
router.route('/getcategory').get(rh.getCategory)

// product
router.route('/addproduct').post(rh.addProduct)
router.route('/getproducts').get(rh.getProducts)
router.route('/getcatproducts/:category').get(rh.getCatProducts)




export default router