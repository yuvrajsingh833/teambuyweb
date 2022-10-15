import Header from './header'
import Navbar from './navbar'
import Footer from './footer'
import FooterScript from './footerScript'
import WishlistSidebar from './wishlistSidebar'

import RouteGuard from '../middleware/routeGaurd'

import SnackbarProvider from 'react-simple-snackbar'

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <Navbar />
            <RouteGuard>
                <SnackbarProvider>
                    {children}

                    <Footer />
                </SnackbarProvider>
            </RouteGuard>
            <FooterScript />
        </>
    )
}

