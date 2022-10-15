export const Config = {
    BaseURL: {
        web: 'https://teambuy.co.in/',
        admin: 'https://admin.teambuy.co.in/',
        fileServer: 'https://admin.teambuy.co.in/',
        api: 'https://api.teambuy.co.in/v1/',
    },

    FilePath: {
        categoryIcon: 'category_icon/',
        subCategoryIcon: 'sub_category_icon/',
        productBanner: 'product_banner/',
        promotionalBanner: 'promotional_banner/',
        promotionalCategoryBanner: 'promotional_category/',
        promotionalDealBanner: 'promotional_deal/',
        userAvatar: 'user_avatar/',
    },

    PageSize: 30,
    DateFormat: 'DD MMM, YYYY ',

    AndroidAPIKey: 'AIzaSyDoCKdscp-j7pEv5HR8oUsfqUFAcgLqMUA',

    GoogleConfig: {
        scopes: ['email', 'profile', 'openid'],
        webClientId: '833638739060-b5ddi6vb3r1hbted44c2afsd4bvp5apl.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true,
    },
};