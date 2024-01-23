import React from "react";
import "../../assets/css/prints/detailprint3.css";
const DetailPrint3 = () => {
  return (
    <div className="containerdp3">
      <div>
        <div className="headlabeldp3">JEWELLERY INVOICE</div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="w-25">
            <div>To,</div>
            <div className="fw-bold">prashant</div>
          </div>
          <div className="w-25">
            <div className="d-flex w-100">
              <div className="w-50 end_dp3">Invoice#&nbsp;&nbsp;&nbsp;:</div>
              <div className="fw-bold w-50 end_dp3">SK19672022</div>
            </div>
            <div className="d-flex w-100">
              <div className="w-50 end_dp3">Date&nbsp;&nbsp;&nbsp;:</div>
              <div className="fw-bold w-50 end_dp3">16 Jan 2024</div>
            </div>
            <div className="d-flex w-100">
              <div className="w-50 end_dp3">HSN&nbsp;&nbsp;&nbsp;:</div>
              <div className="fw-bold w-50 end_dp3">85213</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
            <div>sr</div>
        </div>
        <div>tbody</div>
      </div>
      <div>footer</div>
    </div>
  );
};

export default DetailPrint3;
