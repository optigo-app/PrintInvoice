import React from "react";
import style from "../../assets/css/headers/header3.module.css";
import QrCodeForPrint from "../QrCodeForPrint";

const Header3 = ({ data }) => {
  // console.log(data);
  return (
    <div className={style.header3}>

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
          <div className={`fw-bold fs-5 ${style.linesmain}`}>{data?.CompanyFullName}</div>
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
          <div className={style.qrcodeupperdivh3}>
            <QrCodeForPrint text="hellosdkjnksdfbnkjbsfkjbbdasfklnenfsdeflkhnresglkjgklkndfkgjngkjngklnasdfkjndfdglkndfgknkdfgjnkjadekjsdnkj" />
          </div>
          <div className="w-100 d-flex justify-content-center align-items-center fw-bold fs-5 pe-2">
            {data?.InvoiceBillType}
          </div>
        </div>
      </div>
      <div className={style.tranDetails}>
        <div className={style.einvdetails}>1.e-Invoice Details</div>
        <div className={style.einvoiceDetails}>
            <div className="d-flex">
                <div className={`fw-bold ${style.fshead3comp}`}>IRN : </div>
                <div className={style.fshead3comp}> long number</div>
            </div>
            <div className="d-flex">
                <div className={`fw-bold ${style.fshead3comp}`}>Ack No.</div>
                <div className={style.fshead3comp}> 3498757359795797</div>
            </div>
            <div className="d-flex">
                <div className={`fw-bold ${style.fshead3comp}`}>Ack. Date :</div>
                <div className={style.fshead3comp}> 2023-10-20 15:12:00</div>
            </div>
        </div>
      </div>
      <div className={style.tranDetails}>
        <div className={style.einvdetails}>2.Transaction Details</div>
        <div className={style.einvoiceDetails}>
          <div className={style.commonwidthh3}>
            <div><b>Category : </b> B2B</div>
            <div><b>Invoice Type : </b> Tax Invoice</div>
          </div>
          <div className={style.commonwidthh3}>
            <div><b>Invoice No : </b> {data?.InvoiceNo}</div>
            <div><b>Invoice Date : </b> {data?.EntryDate}</div>
          </div>
          <div className={style.commonwidthh3}>
            <div><b>IGST on INTRA : </b> NA</div>
            <div><b>Description : </b> Jewellery</div>
          </div>
        </div>
      </div>
            
    </div>
  );
};

export default Header3;
