import React, { useEffect, useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/invoiceprint_12.module.css";

const InvoicePrint_12 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState({});

  const loadData = (data) => {
    setHeaderData(data?.BillPrint_Json[0]);
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container container-fluid max_width_container mt-1 ${style?.InvoicePrint_12} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-0 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* Title */}
      <div className="py-1">
        <h4 className="text-center fs-4 fw-bold">
          {headerData?.PrintHeadLabel}
        </h4>
      </div>

      {/* header */}
      <div className="d-flex border p-2">
        <div className="col-8">
          <p>{headerData?.lblBillTo}</p>
          <p>{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerregion}</p>
          <p>{headerData?.customercity}{headerData?.customerpincode}</p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.vat_cst_pan}</p>
          <p>{headerData?.Cust_CST_STATE_No_},</p>
        </div>
        <div className="col-4 d-flex align-items-center">
          <div className="col-4">
            <p>Bill No </p>
            <p>DATE </p>
            <p>HSN/SAC </p>
            <p>{headerData?.Company_CST_STATE}</p>
            <p>PAN </p>
            <p>GSTIN </p>
            <p>MSME NO </p>
          </div>
          <div className="col-8">
            <p>: {headerData?.InvoiceNo}</p>
            <p>: {headerData?.EntryDate}</p>
            <p>: {headerData?.HSN_No}</p>
            <p>: {headerData?.Company_CST_STATE_No}</p>
            <p>: {headerData?.Pannumber}</p>
            <p>: 24AAAAA0000A1Z51</p>
            <p>: DL05A0000051</p>
          </div>
        </div>
      </div>

      {/* table header */}
    <div className="d-flex">
        <div className={style?.Sr}>
            <p className="fw-bold text-center">Sr#</p>
        </div>
        <div className={style?.Product}>
            <p className="fw-bold text-center">Product Description</p>
        </div>
        <div className={style?.KT}>
            <p className="fw-bold text-center">KT</p>
        </div>
        <div className={style?.Qty}>
            <p className="fw-bold text-center">Qty</p>
        </div>
        <div className={style?.Gross}>
            <p className="fw-bold text-center">Gross Wt(gm)</p>
        </div>
        <div className={style?.Dia}>
            <p className="fw-bold text-center">Dia Wt(ctw)</p>
        </div>
        <div className={style?.Stone}>
            <p className="fw-bold text-center">Stone Wt(ctw)</p>
        </div>
        <div className={style?.Net}>
            <p className="fw-bold text-center">Net Wt(gm)</p>
        </div>
        <div className={style?.Other}>
            <p className="fw-bold text-center">Other charges</p>
        </div>
        <div className={style?.Making}>
            <p className="fw-bold text-center">Making Amount</p>
        </div>
        <div className={style?.ProductVal}>
            <p className="fw-bold text-center">Product Value</p>
        </div>
    </div>

    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default InvoicePrint_12;
