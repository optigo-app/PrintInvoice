import React from "react";
import footer1 from "../../assets/css/footers/footer1.module.css";
const Footer1 = () => {
  return (
    <div className={footer1.footer1Info}>
      <div className={`w-50 d-flex justify-content-center align-items-end ${footer1.borderRightF1} h-100`}>RECEIVER's NAME & SIGNATURE</div>
      <div className="w-50 d-flex justify-content-center align-items-end h-100">for,ORAIL SERVICE</div>
    </div>
  );
};

export default Footer1;
