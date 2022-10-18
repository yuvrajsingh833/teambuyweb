import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Feature from '../component/feature';

export default function FourOhFour() {
    return <>
        <Head>
            <title>Error 404 | Teambuy</title>
        </Head>
        <section className="cart-wrap">
            <div className="empty-cart">
                <div className="ce-icon text-center">
                    <Image
                        alt="fail"
                        src="/bgicon/fail.png"
                        height={130}
                        width={130}
                    />
                </div>
                <div className="sm-heading text-center mt-30">Oops! Error 404</div>
                <div className="xs-heading text-center font-12">The page you are looking for might have been removed,<br /> had it’s name changed or is temporairly unavailable</div>
                <div className="text-center mt-20">
                    <Link href="/">
                        <button className="green-btn">Go to Home</button>
                    </Link>
                </div>
            </div>
        </section>
        <Feature />
    </>
}