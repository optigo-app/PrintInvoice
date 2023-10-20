import React from "react";
import style from "../subhead2/subhead2.module.css";
const Subhead2 = ({ data }) => {
  return (
    <div>
      <div className={style.custBlock}>
        <div className={style.custDetails}>
          <span className={style.lines}>Bill To,</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={style.lines}>{data?.customerAddress2}</span>
          <span className={style.lines}>{data?.customerAddress1}</span>
          <span className={style.lines}>{data?.customerAddress3}</span>
          <span className={style.lines}>
            {data?.customercity} {data?.customerpincode}
          </span>
          <span className={style.lines}>{data?.customeremail1}</span>
          <span className={style.lines}>GSTIN-25GJERDR202314</span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
        <div className={style.custDetails}>
          <span className={style.lines}>Ship to</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={style.lines}>{data?.CustName}</span>
          <span className={style.lines}>{data?.customerstreet}</span>
          <span className={style.lines}>
            {data?.customercity}, {data?.State}
          </span>
          <span className={style.lines}>India-{data?.customerpincode}</span>
          <span className={style.lines}>
            Mobile No : {data?.customermobileno}
          </span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
        <div className={style.custDetails}>
          <span className={style.invoice}>
            <span className={style.lines}>BILL NO</span>
            <span className={style.lines}>{data?.InvoiceNo}</span>
          </span>
          <span className={style.invoice}>
            <span className={style.lines}>DATE</span>
            <span className={style.lines}>{data?.EntryDate}</span>
          </span>
          <span className={style.invoice}>
            <span className={style.lines}>HSN</span>
            <span className={style.lines}>{data?.HSN_No}</span>
          </span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
        <div className={style.custDetails}>
          <span className={style.lines}>E Way Bill</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
      </div>
    </div>
  );
};

export default Subhead2;
