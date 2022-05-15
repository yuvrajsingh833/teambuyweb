import '../styles/owl.carousel.css'
import '../styles/owl.theme.default.css'
import '../styles/bootstrap.min.css'
import '../styles/style.css'
import '../styles/responsive.css'
import '../styles/globals.css'

import Layout from '../component/layout';

function MyApp({ Component, pageProps }) {
  return <Layout>
    <Component {...pageProps} />
  </Layout>
}

export default MyApp
