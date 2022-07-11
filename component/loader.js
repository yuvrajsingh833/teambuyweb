import React from "react"
import Image from "next/image"

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-ball">
        <Image
          layout="raw"
          alt="loader"
          width={100}
          height={100}
          priority
          src="/loading.gif"
        />
      </div>
    </div>
  );
};

export default Loader;