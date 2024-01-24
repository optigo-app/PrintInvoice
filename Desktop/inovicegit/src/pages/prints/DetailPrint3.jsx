import React from "react";
import "../../assets/css/prints/detailprint3.css";
const DetailPrint3 = () => {
  return (
    <div className="containerdp3">
      <div>
        <div className="headlabeldp3 fw-bold">JEWELLERY INVOICE</div>
        <div className="d-flex justify-content-between align-items-center fs_dp3">
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
        <div className="d-flex theaddp3 fw-bold fs_dp3">
            <div className="col1_dp3 border-secondary border-end center_dp3">Sr</div>
            <div className="col2_dp3 border-secondary border-end center_dp3">Design</div>
            <div className="col3_dp3 border-secondary border-end">
                <div className="w-100 center_dp3 h-50">Diamond</div>
                <div className="d-flex w-100 border-secondary border-top h-50">
                    <div className="center_dp3 col_w_dp3 border-secondary border-end">Code</div>
                    <div className="center_dp3 col_w_dp3 border-secondary border-end">Wt</div>
                    <div className="center_dp3 col_w_dp3">Amount</div>
                </div>
            </div>
            <div className="col4_dp3 border-secondary border-end">
                    <div className="center_dp3 h-50 w-100">Metal</div>
                    <div className="d-flex h-50 w-100 border-secondary border-top">
                        <div className="center_dp3 w-25 border-secondary border-end">Quality</div>
                        <div className="center_dp3 w-25 border-secondary border-end">Wt(M+D)</div>
                        <div className="center_dp3 w-25 border-secondary border-end">N+L</div>
                        <div className="center_dp3 w-25">Amount</div>
                    </div>
            </div>
            <div className="col5_dp3 border-secondary border-end">
            <div className="w-100 center_dp3 h-50">Stone</div>
                <div className="d-flex w-100 border-secondary border-top h-50">
                    <div className="center_dp3 col_w_dp3 border-secondary border-end">Code</div>
                    <div className="center_dp3 col_w_dp3 border-secondary border-end">Wt</div>
                    <div className="center_dp3 col_w_dp3">Amount</div>
                </div>
            </div>
            <div className="col6_dp3 border-secondary border-end center_dp3">Other</div>
            <div className="col7_dp3 border-secondary border-end">
                <div className="h-50 center_dp3 w-100">Labour</div>
                <div className="d-flex w-100 border-secondary border-top h-50">
                    <div className="w-100 border-secondary border-end center_dp3">Rate</div>
                    <div className="w-100 center_dp3">Amount</div>
                </div>
            </div>
            <div className="col8_dp3 center_dp3">Total Amount</div>
        </div>
        <div>
         <div className="d-flex border-secondary border-start border-end border-bottom w-100">
            <div className="col1_dp3 border-secondary border-end center_top_dp3">1</div>
            <div className="col2_dp3 border-secondary border-end">
                <div className="d-flex justify-content-between align-items-start">
                    <div>1998</div>
                    <div>1/16612</div>
                </div>
                <div>
                    <img src="" alt="" />
                </div>
                <div>huid</div>
                <div className="fw-bold center_dp3 border-secondary border-top">8.55 gross</div>
            </div>
            <div className="col3_dp3 border-secondary border-end"></div>
            <div className="col4_dp3 border-secondary border-end">metal</div>
            <div className="col5_dp3 border-secondary border-end">stone</div>
            <div className="col6_dp3 border-secondary border-end">other</div>
            <div className="col7_dp3 border-secondary border-end">labour</div>
            <div className="col8_dp3">total amount</div>
         </div>
        </div>
      </div>
      <div>footer</div>
    </div>
  );
};

export default DetailPrint3;
