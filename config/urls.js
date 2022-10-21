import { Config } from './config';

const WEB_BASE_URL = Config.BaseURL.web;
const FILE_SERVER_BASE_URL = Config.BaseURL.fileServer;
const ADMIN_BASE_URL = Config.BaseURL.admin;
const API_BASE_URL = Config.BaseURL.api;
const API = {
  /**
   * Set all the URLs here in the below provided format
   * key: { url: '', endPoint: '' },
   */
  //Auth urls
  uploadBusinessImage: { url: 'upload-customer-image', endPoint: 'auth' },
  register: { url: 'register', endPoint: 'auth' },
  sendOTP: { url: 'send-otp', endPoint: 'auth' },
  verifyOTP: { url: 'verify-otp', endPoint: 'auth' },
  logout: { url: 'logout', endPoint: 'auth' },

  //Master urls
  states: { url: '', endPoint: 'states' },
  cities: { url: '', endPoint: 'cities' },
  dashboard: { url: '', endPoint: 'dashboard' },
  settings: { url: '', endPoint: 'settings' },
  deliveryPinCode: { url: '', endPoint: 'delivery-pincode' },
  languages: { url: '', endPoint: 'languages' },
  languagesLabel: { url: '', endPoint: 'languages-label' },
  reverseGeoLocation: { url: 'reverse-geo-location', endPoint: 'location' },
  calculateDistance: { url: 'calculate-distance', endPoint: 'location' },
  searchSuggestion: { url: '', endPoint: 'search-suggestion' },
  search: { url: '', endPoint: 'search' },
  faqs: { url: '', endPoint: 'faqs' },
  subscribeNewsletter: { url: '', endPoint: 'subscribe-newsletter' },

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

  //Team urls
  getNearbyTeams: { url: 'nearby-team', endPoint: 'team' },
  uploadTeamImage: { url: 'update-team-image', endPoint: 'team' },
  createTeam: { url: 'create-team', endPoint: 'team' },
  teamInfo: { url: 'info', endPoint: 'team' },

  //Payment urls
  allPaymentTransactions: { url: 'all-transactions', endPoint: 'payment' },
  allWalletTransactions: { url: 'wallet-transactions', endPoint: 'payment' },
  createPayment: { url: 'create-payment', endPoint: 'payment' },
  paymentGateway: { url: 'gateway', endPoint: 'payment' },
  verifyPayment: { url: 'verify-payment', endPoint: 'payment' },
  updatePayment: { url: 'update-payment', endPoint: 'payment' },

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

};
export { WEB_BASE_URL, API_BASE_URL, API, FILE_SERVER_BASE_URL, ADMIN_BASE_URL }