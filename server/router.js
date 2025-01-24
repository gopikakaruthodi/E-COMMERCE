import { Router } from "express";
import * as rh from './requestHandler.js'
import Auth from "./middleware/Auth.js";

const router=Router()

router.route('/signup').post(rh.signup)
router.route('/signin').post(rh.signin)
router.route('/email').post(rh.checkEmail)
router.route('/changepassword').put(rh.changePassword)
router.route('/displayprofile').get(Auth,rh.displayProfile)
router.route('/editprofile').put(Auth,rh.editProfile)
router.route('/address').post(Auth,rh.addAddress)
router.route('/getAddress').get(Auth,rh.displayAddress)
router.route('/editAddress/:_id').put(Auth,rh.editAddress)
router.route('/deleteAddress/:_id').delete(rh.deleteAddress)
// company
router.route('/editcompany').post(Auth,rh.editComapany)
router.route('/getcompany').get(Auth,rh.getCompany)

// category
router.route('/category').post(rh.category)
router.route('/getcategory').get(rh.getCategory)

// product
router.route('/addproduct').post(Auth,rh.addProduct)
router.route('/getproducts').get(Auth,rh.getProducts)
router.route('/getproduct/:_id').get(Auth,rh.getProduct)
router.route('/getcatproducts/:category').get(rh.getCatProducts)
router.route('/editproduct/:_id').put(rh.editProduct)
router.route('/deleteproduct/:_id').delete(rh.deleteProduct)
router.route('/displayproducts').get(Auth,rh.displayProducts)

// wishlist
router.route('/addtowishlist').post(Auth,rh.addToWishlist)
router.route('/removewishlist/:id').delete(Auth,rh.removeFromWishlist)
router.route('/displaywish').get(Auth,rh.displayWishlist)


// orders
router.route('/placeorders').post(Auth,rh.addOrders)
router.route('/getorders').get(Auth,rh.getOrders)
router.route('/forconfirm').get(Auth,rh.forConfirmOrder)
router.route('/accept/:oid').post(Auth,rh.acceptOrder)
router.route('/reject/:oid').post(Auth,rh.rejectOrder)

// cart
router.route('/addtocart').post(Auth,rh.addToCart)
router.route('/removecartitem/:_id').delete(rh.removeCartItem)
router.route('/displaycart').get(Auth,rh.displayCart)
router.route('/singlecart/:_id').get(Auth,rh.singleCart)
router.route('/updatequantity/:_id').put(Auth,rh.updateQuantity)







export default router