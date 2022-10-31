import Head from 'next/head';
import Link from "next/link";
export default function CancellationPolicy() {
    return (
        <>
            <Head>
                <title>Cancellation Policy | Teambuy</title>
            </Head>
            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                            <li className="breadcrumb-item">Policy</li>
                            <li className="breadcrumb-item active" aria-current="page">Cancellation Policy</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="mt-20 mb-20">
                <div className="container">
                    <div className="row">
                        <div className="col py-6">
                            <h3 className="text-center">Cancellation Policy</h3>
                            <hr />

                            <ul>
                                <li>
                                    <p className="text-left lead">1. The Orders placed by Buyers using the Platform are non-cancellable and non-refundable except if refund is requested under the following conditions –
                                        <ul>
                                            <li> 1.1. If the Order could not be delivered within the estimated time while placing the order;</li>
                                            <li> 1.2. If the Order has not been picked by the Delivery Executive</li>
                                        </ul>
                                    </p>
                                </li>

                                <li>
                                    <p className="text-left lead">2. If the Merchant doesn't accept or cancels the Order due to reasons not attributable to Buyer, including but not limited to store being closed, non-availability of items, store cannot service online orders at that moment, store is overcrowded, etc.</p>
                                </li>

                                <li>
                                    <p className="text-left lead">
                                        3. If Teambuy cancels the Order due to reasons not attributable to Buyer, including but not limited to non-availability of Delivery Executives, etc.
                                    </p>
                                </li>

                                <li>
                                    <p className="text-left lead">
                                        4. Teambuy reserves the right to look into the cancellation request of the Buyer and determine if such cancelation request falls under the conditions mentioned above. If Teambuy is satisfied that the request and same fulfills any of the aforesaid conditions, then Teambuy shall process the cancellation request and refund amounts to the Buyer.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}