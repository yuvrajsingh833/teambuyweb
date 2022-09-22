import '../styles/bootstrap.min.css'
import '../styles/globals.css'
import '../styles/owl.carousel.css'
import '../styles/owl.theme.default.css'
import '../styles/responsive.css'
import '../styles/style.css'

import Layout from '../component/layout'

import { wrapper } from "../store/store"

function MyApp({ Component, pageProps }) {
	return <Layout>
		<Component {...pageProps} />
	</Layout>
}

export default wrapper.withRedux(MyApp);