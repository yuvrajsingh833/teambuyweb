import '../styles/owl.carousel.css'
import '../styles/owl.theme.default.css'
import '../styles/bootstrap.min.css'
import '../styles/style.css'
import '../styles/responsive.css'
import '../styles/globals.css'

import Layout from '../component/layout';
import RouteGuard from '../middleware/routeGaurd'

import { wrapper, store } from "../store/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
	return <Provider store={store}>
		<RouteGuard>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</RouteGuard>
	</Provider>
}

export default wrapper.withRedux(MyApp);