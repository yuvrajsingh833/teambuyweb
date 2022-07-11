import dynamic from "next/dynamic";
import Link from "next/link";
import Head from 'next/head';
export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy | Teambuy</title>
            </Head>
            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Privacy Policy</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="mt-20 mb-20">
                <div className="container">
                    <div className="row">
                        <div className="col text-center py-6">
                            <h3>Privacy Policy</h3>
                            <p className="lead text-start mt-20">
                                All the terms of services must be read very carefully. If you use
                                the website it clearly implies that you agree to abide by all the
                                terms and conditions prescribed by Teambuy. By using the
                                website, you accept that this will form a legal binding agreement
                                between you and . All information displayed
                                on <a href="https://www.teambuy.co.in">https://www.teambuy.co.in</a> is meant for general
                                information.
                                Visitors may download information available on the website for
                                non-commercial, personal use only and no part of information,
                                either in whole or part, shall be printed, distributed, transmitted,
                                modified, displayed or otherwise reproduced without the prior
                                written permission of Teambuy.<br /><br />
                                Teambuy reserves the right to make changes, extend or
                                partly/completely delete any material/content on the website and
                                all other information including the offers, if any, without notice. No
                                responsibility will be accepted by Teambuy for damage or loss or
                                any kind of hardships or expense encountered by its customers or
                                any other person or entities for such changes, additions,
                                deletions, omissions or errors, no matter how they are caused.<br /><br />
                                Every effort is made to keep the website up and running
                                smoothly. However, Teambuy takes no responsibility for and will
                                not be liable for the website being temporarily unavailable due to
                                technical issues beyond its control.<br /><br />
                                Teambuy may at any time modify the Terms of Use without any
                                prior notification. You can access the latest version of the Terms
                                of Use at any given time. You should regularly review the Terms
                                of Use. Visitors of our website(s) hereby agree to indemnify and
                                hold Teambuy, its management, employees, Merchants,
                                information providers and other persons or entities associated
                                with Teambuy harmless for any claims, losses or damages
                                resulting from the breach of these terms or relying upon or use of
                                its web site(s) as well as any links to or from other sites or other
                                resources.
                                <br /><br /><br /><br />
                                This agreement is governed and construed in accordance with the
                                Laws of Union of India. You hereby irrevocably consent to the
                                exclusive jurisdiction and venue of courts in Jaipur, District Jaipur,
                                Rajasthan India in all disputes arising out of or relating to the use
                                of the website.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}