
const GlobalMessages = Object.freeze({
  "networkRequestError": "Unable to connect to internet. Please check your connection.",
  "somethingWentWrong": "Something went wrong. Please try again later.",
  "serverError": "Server error. Please try again or Contact the administrator.",
  "loginError": "Unable to process your authentication. Please try again or contact administrator.",
  "networkRequestFailed": " Network request failed."
});

const UserType = Object.freeze({
  "customer": "customer",
  "customer": "customer",
})

const DateFormat = Object.freeze({
  "DDMMYYYY": "DD/MM/YYYY",
  "DashDDMMYYYY": "DD-MM-YYYY",
  "DashYYYYMMDD": "YYYY-MM-DD",
  "MMMDDYYYY": "MMM DD, YYYY",
  "DDMMMYYYY": "DD MMM, YYYY"
})

const UserStatus = Object.freeze({
  "active": "active",
  "blocked": "blocked",
  "deleted": "deleted",
  "inactive": "inactive",
  "bankPending": "bank_pending",
  "paymentPending": "payment_pending"
})

const ShortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ShortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const OwlCarouselSlider = Object.freeze({
  topBannerSlider: {
    0: { items: 1 },
    481: { items: 2 },
    768: { items: 2 },
    992: { items: 3 },
    1281: { items: 3 }
  },
  sevenItemSlider: {
    0: { items: 1, stagePadding: 25 },
    421: { items: 2, stagePadding: 30 },
    768: { items: 4, stagePadding: 0 },
    992: { items: 5 },
    1200: { items: 6 },
    1367: { items: 7 }
  },
  fiveItemSlider: {
    0: { items: 1, stagePadding: 25 },
    421: { items: 2, stagePadding: 30 },
    768: { items: 3, stagePadding: 0 },
    1200: { items: 4 },
    1367: { items: 5 }
  },
  fourItemSlider: {
    0: { items: 1, stagePadding: 25 },
    421: { items: 2, stagePadding: 30 },
    768: { items: 3, stagePadding: 0 },
    1200: { items: 4 },
    1367: { items: 4 }
  },
  offerSlider: {
    0: { items: 1, stagePadding: 25 },
    421: { items: 2, stagePadding: 30 },
    768: { items: 2, stagePadding: 60 },
    992: { items: 2, stagePadding: 120 },
    1200: { items: 3, stagePadding: 120 }
  },
  selectedCategorySlider: {
    0: { items: 2, stagePadding: 25 },
    421: { items: 3, stagePadding: 30 },
    575: { items: 4, stagePadding: 30 },
    768: { items: 4, stagePadding: 40 },
    992: { items: 6, stagePadding: 40 },
    1200: { items: 7, stagePadding: 40 },
    1367: { items: 9, stagePadding: 40 }
  }
})

export { UserType, DateFormat, UserStatus, GlobalMessages, ShortMonths, FullMonths, ShortDays, FullDays, OwlCarouselSlider }