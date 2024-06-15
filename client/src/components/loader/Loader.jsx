import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <>
      <section className="mainsection">
        {/* <img src={require("../../../assests/img/rsflogo.webp")} alt="preloader" className='img-fluid'  /> */}
        <div className="mainloader-container">
          <span className="mainloader"></span>
        </div>
        <span className="mainloading">Loading</span>
      </section>
    </>
  );
};

export default Loader;
