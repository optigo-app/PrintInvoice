import React from "react";
import style from "../../assets/css/headers/header1.module.css";
const Header1 = ( { data }  ) => {
    console.log(data);
  return (
    <>
      <div className={style.headline}>{data?.PrintHeadLabel}</div>
      <div className={style.companyDetails}>
        <div className={style.companyhead}>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.CompanyFullName}
          </span>
          <span className={style.lines}>{data?.CompanyAddress}</span>
          <span className={style.lines}>{data?.CompanyAddress2}</span>
          <span className={style.lines}>{data?.CompanyCity}-{data?.CompanyPinCode},{data?.CompanyState}({data?.CompanyCountry})</span>
          <span className={style.lines}>Tell No: {data?.CompanyTellNo}</span>
          <span className={style.lines}>
            {data?.CompanyEmail} | {data?.CompanyWebsite}
          </span>
          <span className={style.lines}>
            {data?.Company_VAT_GST_No} | {data?.Company_CST_STATE}-GSTIN-25GJERDR202314
          </span>
        </div>
        <div style={{width:"30%"}} className="d-flex justify-content-center align-item-center h-100"><img src={data?.PrintLogo} alt="" className={style.headerImg} /></div>
      </div>
      <div className={style.custBlock}>
        <div className={style.custDetails}>
          <span className={style.lines}>Bill To,</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={style.lines}>{data?.customerAddress2}</span>
          <span className={style.lines}>{data?.customerAddress1}</span>
          <span className={style.lines}>{data?.customerAddress3}</span>
          <span className={style.lines}>{data?.customercity} {data?.customerpincode}</span>
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
          <span className={style.lines}>{data?.customercity}, {data?.State}</span>
          <span className={style.lines}>India-{data?.customerpincode}</span>
          <span className={style.lines}>Mobile No : {data?.customermobileno}</span>
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
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            
          </span>
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
    </>
  );
};

export default Header1;
