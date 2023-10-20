import React from "react";
import style from "../../assets/css/headers/header3.module.css";
import QRCodeGenerator from "../QRCodeGenerator";
import { HeaderComponent } from "./../../GlobalFunctions";

const Header3 = ({ data }) => {
  console.log(data);
  return (
    <div className="w-100">
      <div className={style.headline}>
        <div className="fs-4">{data?.PrintHeadLabel}</div>
        <div className="fs-4">Government of India e-Invoice System</div>
      </div>
      <div
        className={`${style.companyDetails} d-flex justify-content-between align-items-center w-100 `}
      >
        <div className="w-75">
          <div>
            <img src={data?.PrintLogo} alt="home" className={style.headerImg} />
          </div>
          <div className={`fw-bold fs-5 ${style.lines}`}>{data?.CompanyFullName}</div>
          <div className={style.lines}>{data?.CompanyAddress}</div>
          <div className={style.lines}>{data?.CompanyCity} {data?.CompanyAddress2}</div>
          <div className={style.lines}>{data?.CompanyCity} - {data?.CompanyPinCode} {data?.CompanyState} ({data?.CompanyCountry})</div>
          <div className={style.lines}>T {data?.CompanyTellNo}</div>
          <div className={style.lines}>
            {data?.CompanyEmail} | {data?.CompanyWebsite}
          </div>
          <div className={style.lines}>
            {data?.Company_VAT_GST_No} | {data?.Company_CST_STATE} - {data?.Company_CST_STATE_No}
          </div>
        </div>
        <div className="w-25">
          <div className="w-100 d-flex justify-content-end align-items-center">
            <QRCodeGenerator text="hellosdkjnksdfbnkjbsfkjbbdasfklnenfsdeflkhnresglkjgklkndfkgjngkjngklnasdfkjndfdglkndfgknkdfgjnkjadekjsdnkj" />
          </div>
          <div className="w-100 d-flex justify-content-center align-items-center fw-bold fs-4">
            Tax Invoice for Supply of Services Issued u/section 31(2) of CGST
            ACT, 2017
          </div>
        </div>
      </div>
      <div style={{border:"1px solid #e8e8e8", marginTop:"1rem"}}>
        <div className={style.einvdetails}>1.e-Invoice Details</div>
        <div className={style.einvoiceDetails}>
            <div className="d-flex">
                <div className={`fw-bold ${style.fshead3comp}`}>IRN : </div>
                <div className={style.fshead3comp}>kjnfkjnskfjbnkjbgkj005yu9u090909uj90u77gt7guhn987nkjbnfkjnfkjnfkjnfkjnf</div>
            </div>
            <div className="d-flex">
                <div className={`fw-bold ${style.fshead3comp}`}>Ack No.</div>
                <div className={style.fshead3comp}>3498757359795797</div>
            </div>
            <div className="d-flex">
                <div className={`fw-bold ${style.fshead3comp}`}>Ack. Date :</div>
                <div className={style.fshead3comp}>2023-10-20 15:12:00</div>
            </div>
        </div>
      </div>
      <div style={{border:"1px solid #e8e8e8", marginTop:"0.5rem", marginBottom:"0.5rem"}}>
        <div className={style.einvdetails}>2.Transaction Details</div>
        <div className={style.einvoiceDetails}>
                <div style={{width:"33.33%"}}>
                    <div className="w-100 d-flex border-end"><span className={`fw-bold ${style.trlinesh3}`}>Category : </span><span className={style.trlinesh3}>B2B</span></div>
                    <div className="w-100 d-flex"><span className={`fw-bold ${style.trlinesh3}`}>Invoice Type : </span><span className={style.trlinesh3}>Tax Invoice</span></div>
                </div>
                <div style={{width:"33.33%"}}>
                    <div className="w-100 d-flex"><span className={`fw-bold ${style.trlinesh3}`}>Invoice No : </span><span className={style.trlinesh3}>{data?.InvoiceNo}</span></div>
                    <div className="w-100 d-flex"><span className={`fw-bold ${style.trlinesh3}`}>Invoice Date : </span><span className={style.trlinesh3}>20 OCT 2023</span></div>
                </div>
                <div style={{width:"33.33%"}}>
                    <div className="w-100 d-flex"><span className={`fw-bold ${style.trlinesh3}`}>IGST on INTRA : </span><span className={style.trlinesh3}>NA</span></div>
                    <div className="w-100 d-flex"><span className={`fw-bold ${style.trlinesh3}`}>Description : </span><span className={style.trlinesh3}>Jewelllary</span></div>
                </div>
                
            
        </div>
      </div>
      
    </div>
  );
};

export default Header3;
