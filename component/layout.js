import Header from './header'
import Navbar from './navbar'
import AuthSideBar from './authSidebar'
import Footer from './footer'
import FooterScript from './footerScript'

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <Navbar />
            <AuthSideBar />

            {children}

            <Footer />
            <FooterScript />
        </>
    )
}
