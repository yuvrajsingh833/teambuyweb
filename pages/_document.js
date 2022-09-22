
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>

                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}