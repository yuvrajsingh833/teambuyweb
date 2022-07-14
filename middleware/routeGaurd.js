import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux'

export default function RouteGuard({ children }) {
    const userData = useSelector(state => state.userData)
    const user = userData?.userData

    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url) {

        let signedIn = false;
        try {
            signedIn = user.token.length > 0 ? true : false;
        } catch (error) {
            signedIn = false;
        }

        // redirect to login page if accessing a private page and not logged in 
        if (!signedIn && (url.includes('/account') || url.includes('/cart') || url.includes('/checkout'))) {
            setAuthorized(false);
            router.push({
                pathname: '/',
            });
        } else {
            setAuthorized(true);
        }
    }

    return (authorized && children);
}