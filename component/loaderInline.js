import React from "react"
import Image from "next/image"

const LoaderInline = () => {
    return (
        <div className="container">
            <div className="d-flex justify-content-center">
                <Image
                    layout="raw"
                    alt="loader"
                    width={100}
                    height={100}
                    style={{ maxHeight: '100px', maxWidth: '100px', alignSelf: 'center' }}
                    priority
                    src="/loading.gif"
                />
            </div>
        </div>
    );
};

export default LoaderInline;