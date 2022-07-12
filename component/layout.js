import Header from './header'
import Navbar from './navbar'
import AuthSideBar from './authSidebar'
import Footer from './footer'
import FooterScript from './footerScript'
import WishlistSidebar from './wishlistSidebar'

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <Navbar />
            <AuthSideBar />
            <WishlistSidebar />

            {children}

            <Footer />
            <FooterScript />
        </>
    )
}
