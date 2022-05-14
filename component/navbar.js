export default function Navbar({ }) {
    return (
        <header className="header-wrap">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="main-logo">
                        <a href="index.html"><img src="img/logo.svg" /></a>
                    </div>
                    {/* <div className="header-address d-flex align-items-center">
                        <div className="had-icon">
                            <img src="img/location.svg" />
                        </div>
                        <div className="had-location">
                            <div className="had-area-name">Malviya Nagar</div>
                            <div className="had-area-desc">Corporate tower, Malviya Nagar 302017</div>
                        </div>
                    </div> */}
                    <div className="search-box">
                        <input type="text" className="search-input" placeholder="Search Store" />
                        <span className="search-icon"></span>
                    </div>
                    <div className="search-for-mobile">
                        <a href="javascript:void(0);" className="mobile-search"><img src="img/search.svg" /></a>
                    </div>
                    <div className="login-for-mobile">
                        <a href="#">Login</a>
                    </div>
                    <div className="main-menu">
                        <ul>
                            <li>
                                <a href="#">Category</a>
                            </li>
                            {/* <li>
                                <a href="#">Explore</a>
                            </li> */}
                            <li>
                                <a href="#">Login</a>
                            </li>
                        </ul>
                    </div>
                    <div className="wish-block">
                        <a href="#" className="wishlist-icon"></a>
                    </div>
                    <div className="cart-block">
                        <a href="#" className="cart-box">
                            <img src="img/cart-icon.svg" /> 0 Items
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
