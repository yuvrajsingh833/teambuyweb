import '../styles/bootstrap.min.css'
import '../styles/owl.carousel.css'
import '../styles/owl.theme.default.css'
import '../styles/style.css'
import '../styles/responsive.css'

import '../styles/globals.css'
import '../styles/globals.responsive.css'

import Layout from '../component/layout'
import Script from 'next/script';

import { wrapper } from "../store/store"

function MyApp({ Component, pageProps }) {
	return <>
		<Script id="common-google-tag-chat" strategy="lazyOnload" >
			{`
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','GTM-5MLWQT2');
                        `}
		</Script>
		<Layout>
			<Component {...pageProps} />
		</Layout>
	</>
}

export default wrapper.withRedux(MyApp);