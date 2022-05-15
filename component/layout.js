import Header from './header'
import Navbar from './navbar'
import Footer from './footer'
import FooterScript from './footerScript'

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <Navbar />

            {children}

            <Footer />
            <FooterScript />
        </>
    )
}
