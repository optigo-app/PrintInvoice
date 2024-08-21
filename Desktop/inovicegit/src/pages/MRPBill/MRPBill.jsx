import React, { useState } from "react";
import "./mrpbill.css";

const MRPBill = () => {

    const [searchVal, setSearchVal] = useState('');
    const [selectVal, setSelectVal] = useState('');

  return (
    <>
      <div className="container_mrp">
        <div className="head_mrp">ADD MRP AND PROCCED TO BILL</div>
        <div>
          <div className="d-flex align-items-center p-2 pt-4">
            <div className="d-flex align-items-center w-75">
                <label className="cust_name_title" htmlFor="custtitle">CUSTOMER NAME</label>
                <div className="w-25">
                    <input type="text" value={searchVal} placeholder="customer name" className="form-control p-2 w_inp" id="custtitle" />
                </div>
            </div>
            <div className="w-25">
            <div className="w-75 d-flex align-items-center ">
                <label htmlFor="currency" className="pe-3 cust_name_title">Currency</label>
                <select name="currency" id="currency" className="form-select" value={selectVal}>
                    <option value="inr">INR</option>
                    <option value="usd">USD</option>
                </select>
            </div>
          </div>
          </div>
         
        </div>
        <div>scan section and info</div>
        <div>table</div>
        <div>continue button</div>
      </div>
    </>
  );
};

export default MRPBill;
