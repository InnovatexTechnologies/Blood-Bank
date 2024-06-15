import React from "react";

const Footer = () => {
  return (
    <>
      <div className="mt-3">
        <div
          className="  text-white text-center py-3 mt-5 position-static bottom-0"
          style={{ backgroundColor: "#880808" }}
        >
          <h6>
            EasyBlood: Engineered by Faspi Enterprises Pvt Ltd, Marketed by
            Rajvanshi Trading Company
            <br />
            (Empowering blood banks with seamless operations and effective
            outreach)
          </h6>
          {/* <div className=" text-dark bg-white text-center py-1" style={{borderRadius:"6px"}}> */}
          <h6 className=" text-dark bg-white text-center py-1 d-inline px-3 " style={{borderRadius:"8px"}}>
          For Sales/Support contact us : +91 73513 60366
          </h6>
        {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default Footer;
