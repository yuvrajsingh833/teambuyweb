import { Config } from './appConfig';

const WEB_BASE_URL = Config.BaseURL[Config.Env].web;
const API_BASE_URL = Config.BaseURL[Config.Env].api;
const API = {
  /**
   * Set all the URLs here in the below provided format
   * key: { url: '', endPoint: '' },
   */
  //Auth urls
  uploadBusinessImage: { url: 'upload-business-image', endPoint: 'auth' },
  register: { url: 'register', endPoint: 'auth' },
  sendOTP: { url: 'send-otp', endPoint: 'auth' },
  verifyOTP: { url: 'verify-otp', endPoint: 'auth' },
  logout: { url: 'logout', endPoint: 'auth' },

  //Master urls
  dashboard: { url: '', endPoint: 'dashboard' },
  reverseGeoLocation: { url: 'reverse-geo-location', endPoint: 'location' },
  calculateDistance: { url: 'calculate-distance', endPoint: 'location' },
  search: { url: '', endPoint: 'search' },

  //Category urls
  allCategory: { url: 'all', endPoint: 'category' },
  subCategory: { url: 'sub', endPoint: 'category' },

  //Product urls
  allProducts: { url: 'all-products', endPoint: 'product' },
  allProductByCategory: { url: 'all-products/category', endPoint: 'product' },
  productDetail: { url: 'get-detail', endPoint: 'product' },

  //Checkout urls
  getCart: { url: 'cart', endPoint: 'checkout' },
  getAllCoupons: { url: 'get-coupon', endPoint: 'checkout' },
  checkCouponValidation: { url: 'check-coupon', endPoint: 'checkout' },

  //Notification urls
  allNotification: { url: 'all', endPoint: 'notification' },
  markNotificationRead: { url: 'mark-read', endPoint: 'notification' },

  //User urls
  getUserDetail: { url: 'detail', endPoint: 'user' },
  updateUserAvatar: { url: 'update-profile-image', endPoint: 'user' },
  updateUserProfileInfo: { url: 'update-profile-detail', endPoint: 'user' },
  getUserAddresses: { url: 'addresses', endPoint: 'user' },
  addUserAddress: { url: 'add-address', endPoint: 'user' },
  updateUserAddress: { url: 'update-address', endPoint: 'user' },
  getUserWishlist: { url: 'product/get-wishlist', endPoint: 'user' },
  updateUserWishlist: { url: 'product/update-wishlist', endPoint: 'user' },
  updateUserCart: { url: 'product/update-cart', endPoint: 'user' },
  addProductReview: { url: 'product/add-review', endPoint: 'user' },
  getAllOrders: { url: 'order/all', endPoint: 'user' },
  getOrderDetail: { url: 'order/detail', endPoint: 'user' },


  //Payment urls
  allPaymentTransactions: { url: 'all-transactions', endPoint: 'payment' },
  allWalletTransactions: { url: 'wallet-transactions', endPoint: 'payment' },
  createPayment: { url: 'create-payment', endPoint: 'payment' },
  paymentGateway: { url: 'gateway', endPoint: 'payment' },
  verifyPayment: { url: 'verify-payment', endPoint: 'payment' },
  updatePayment: { url: 'update-payment', endPoint: 'payment' },

};
export { WEB_BASE_URL, API_BASE_URL, API }