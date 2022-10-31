import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Loader from '../../../component/loader';

import * as MasterService from "../../../services/master";

export default function FAQs(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [FAQData, setFAQData] = useState([]);

    const getAllFAQs = () => {
        MasterService.faqs({ type: 'customer' }).then(response => {
            setFAQData(response.data)
            setIsLoading(false)
        }).catch(e => {
            console.log(`faqs error : ${e}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getAllFAQs()
    }, [props])

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>FAQs | Teambuy</title>
                <meta name="description" content="FAQs | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                            <li className="breadcrumb-item active" aria-current="page">FAQs</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="mt-20 mb-20">
                <div className="container">
                    <div className="row">
                        <div className="col py-6 text">
                            <h3 className="text-center">Frequently asked questions</h3>
                        </div>
                    </div>

                    <div className="container-fluid pt-40">
                        <div className="accordion faq-accordion mt-40" id="accordionExample">

                            {FAQData.map((item, index) => {
                                return <div key={`FAQ_list_${index}_${item.id}`} className="accordion-item">
                                    <h2 className="accordion-header" id={`headingOne${index}`}>
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne${index}`} aria-expanded="false" aria-controls={`collapseOne${index}`}>
                                            {index + 1}. {item.title}
                                        </button>
                                    </h2>
                                    <div id={`collapseOne${index}`} className="accordion-collapse collapse" aria-labelledby={`headingOne${index}`} data-bs-parent="#accordionExample">
                                        <div className="accordion-body" dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
