import Head from 'next/head';
import Link from "next/link";
export default function RefundPolicy() {
    return (
        <>
            <Head>
                <title>Refund Policy | Teambuy</title>
            </Head>
            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                            <li className="breadcrumb-item">Policy</li>
                            <li className="breadcrumb-item active" aria-current="page">Refund Policy</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="mt-20 mb-20">
                <div className="container">
                    <div className="row">
                        <div className="col py-6">
                            <h3 className="text-center">Refund Policy</h3>
                            <hr />

                            <ul>
                                <li>
                                    <p className="text-left lead">1. Buyer may be entitled to a refund for prepaid Orders. Teambuy retains the right to retain the penalty payable by the Buyer in Section I(2) from the amount refundable to him/her. The Buyer shall also be entitled to a refund of proportionate value in the event packaging of an item in an Order or the complete Order, is either tampered or damaged and the Buyer refuses to accept at the time of delivery for the said reason.</p>
                                </li>

                                <li>
                                    <p className="text-left lead">2. Buyer may be entitled to a refund upto 100% of the Order value if Teambuy Delivery Executive fails to deliver the Order due to a cause attributable to either Delivery Executive or Teambuy, however such refunds will be assessed on a case to case basis by Teambuy.</p>
                                </li>

                                <li>
                                    <p className="text-left lead">
                                        3. Our decision on refunds shall be final and binding.
                                    </p>
                                </li>

                                <li>
                                    <p className="text-left lead">
                                        4. All refund amounts shall be credited to Buyer’s account as may be stipulated as per the payment mechanism of Buyer’s choice.
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