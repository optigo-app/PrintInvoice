import React, { useEffect, useState } from "react";
import {
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/TaxInvoice3.module.css";

const TaxInvoice3 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [address, setAddress] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [image, setImage] = useState(true);

  const loadData = (data) => {
    console.log(data);
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
    setAddress(adr);
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
      className={`container container-fluid max_width_container mt-1 ${style?.taxinvoice3} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check pe-3 pt-2">
          <input
            className="form-check-input border-dark"
            type="checkbox"
            checked={image}
            onChange={(e) => setImage(!image)}
          />
          <label className="form-check-label">With Image</label>
        </div>
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-0 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header */}
      {header}
      {/* sub header */}
      <div className="d-flex border mb-1">
        <div className="col-4 border-end p-2">
          <p>{headerData?.lblBillTo}</p>
          <p className="fw-semibold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress3}</p>
          <p>
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.customeremail1}</p>
          <p>GSTIN-{headerData?.CustGstNo}</p>
          {headerData?.Cust_CST_STATE_No !== "" && (
            <p>
              {headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}
            </p>
          )}
          <p>{headerData?.vat_cst_pan}</p>
        </div>
        <div className="col-4 border-end p-2">
          <p>Ship To,</p>
          <p className="fw-semibold">{headerData?.customerfirmname}</p>
          {address.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </div>
        <div className="col-4 p-2">
          <p>
            <span className="fw-semibold pe-2">BILL NO </span>{" "}
            {headerData?.InvoiceNo}
          </p>
          <p>
            <span className="fw-semibold pe-2">DATE </span>{" "}
            {headerData?.EntryDate}
          </p>
          <p>
            <span className="fw-semibold pe-2">HSN </span> {headerData?.HSN_No}
          </p>
          <p>
            <span className="fw-semibold pe-2">NAME OF GOODS </span> Jewellery
          </p>
          <p>
            <span className="fw-semibold pe-2">PLACE OF SUPPLY </span> Gujarat
          </p>
          <p>
            <span className="fw-semibold pe-2">TERMS </span> 0
          </p>
        </div>
      </div>
      {/* table Header */}
      <div className="d-flex mt-1 border">
        <div
          className={`${style?.Sr} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Sr#</p>
        </div>
        <div
          className={`${style?.Item} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Item</p>
        </div>
        <div
          className={`${style?.Purity} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Purity</p>
        </div>
        <div
          className={`${style?.Qty} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Qty</p>
        </div>
        <div className={`${style?.Gold} border-end`}>
          <div className="d-grid h-100">
            <div className="d-flex justify-content-center border-bottom">
              <p className="text-center fw-bold">Gold</p>
            </div>
            <div className="d-flex">
              <p className="col-6 text-center fw-bold border-end">Wt.</p>
              <p className="col-6 text-center fw-bold">Amount</p>
            </div>
          </div>
        </div>
        <div className={`${style?.Diamond} border-end`}>
          <div className="d-grid h-100">
            <div className="d-flex justify-content-center border-bottom">
              <p className="text-center fw-bold">Diamond</p>
            </div>
            <div className="d-flex">
              <p className="col-6 text-center fw-bold border-end">Wt.</p>
              <p className="col-6 text-center fw-bold">Amount</p>
            </div>
          </div>
        </div>
        <div className={`${style?.ColorStone} border-end`}>
          <div className="d-grid h-100">
            <div className="d-flex justify-content-center border-bottom">
              <p className="text-center fw-bold">ColorStone</p>
            </div>
            <div className="d-flex">
              <p className="col-6 text-center fw-bold border-end">Wt.</p>
              <p className="col-6 text-center fw-bold">Amount</p>
            </div>
          </div>
        </div>
        <div
          className={`${style?.Others} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Others</p>
        </div>
        <div
          className={`${style?.Labour} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Labour</p>
        </div>
        <div
          className={`${style?.Total} d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Total</p>
        </div>
      </div>
      {/* table data */}
      <div className="d-flex border-start border-end border-bottom ">
        <div className={`${style?.Sr} border-end p-1`}>
          <p className="text-center">1</p>
        </div>
        <div className={`${style?.Item} border-end p-1`}>
          <p className="">1715 </p>
        </div>
        <div className={`${style?.Purity} border-end p-1`}>
          <p className="">18K </p>
        </div>
        <div className={`${style?.Qty} border-end p-1`}>
          <p className="text-end">1 </p>
        </div>
        <div className={`${style?.Gold} d-flex border-end`}>
          <div className="col-6 border-end">
            <p className="text-end p-1">10.084 </p>
          </div>
          <div className="col-6">
            <p className="text-end p-1">3,831.92 </p>
          </div>
        </div>
        <div className={`${style?.Diamond} d-flex border-end`}>
          <div className="col-6 border-end">
            <p className="text-end p-1">0.080 </p>
          </div>
          <div className="col-6">
            <p className="text-end p-1">800.00 </p>
          </div>
        </div>
        <div className={`${style?.ColorStone} d-flex border-end`}>
          <div className="col-6 border-end">
            <p className="text-end p-1">0.080 </p>
          </div>
          <div className="col-6">
            <p className="text-end p-1">800.00 </p>
          </div>
        </div>
        <div className={`${style?.Others} border-end p-1`}>
          <p className="text-end">50.00 </p>
        </div>
        <div className={`${style?.Labour} border-end p-1`}>
          <p className="text-end">1,497.60 </p>
        </div>
        <div className={`${style?.Total} p-1`}>
          <p className="text-end">6,179.52</p>
        </div>
      </div>
      {/* table total */}
      <div className="d-flex border-start border-end border-bottom">
        <div className={`${style?.Sr} border-end p-1`}>
          <p className="text-center"></p>
        </div>
        <div className={`${style?.Item} border-end p-1`}>
          <p className="fw-bold">TOTAL </p>
        </div>
        <div className={`${style?.Purity} border-end p-1`}>
          <p className=""> </p>
        </div>
        <div className={`${style?.Qty} border-end p-1`}>
          <p className="text-end"> </p>
        </div>
        <div className={`${style?.Gold} d-flex border-end`}>
          <div className="col-6 border-end">
            <p className="text-end fw-semibold p-1">10.084 </p>
          </div>
          <div className="col-6">
            <p className="text-end fw-semibold p-1">3,831.92 </p>
          </div>
        </div>
        <div className={`${style?.Diamond} d-flex border-end`}>
          <div className="col-6 border-end">
            <p className="text-end fw-semibold p-1">0.080 </p>
          </div>
          <div className="col-6">
            <p className="text-end fw-semibold p-1">800.00 </p>
          </div>
        </div>
        <div className={`${style?.ColorStone} d-flex border-end`}>
          <div className="col-6 border-end">
            <p className="text-end fw-semibold p-1">0.080 </p>
          </div>
          <div className="col-6">
            <p className="text-end fw-semibold p-1">800.00 </p>
          </div>
        </div>
        <div className={`${style?.Others} border-end p-1`}>
          <p className="text-end fw-semibold">50.00 </p>
        </div>
        <div className={`${style?.Labour} border-end p-1`}>
          <p className="text-end fw-semibold">1,497.60 </p>
        </div>
        <div className={`${style?.Total} p-1`}>
          <p className="text-end fw-semibold">6,179.52</p>
        </div>
      </div>
      {/* In Words */}
      <div className="d-flex border-start border-end border-bottom">
        <div
          className={`${style?.words} border-end p-1 d-flex justify-content-end flex-column`}
        >
          <p>In Words Indian Rupees</p>
          <p className="fw-bold">
            Eighty-Five Thousand Five Hundred and Twenty-Four Point Ninety-Two
            Only
          </p>
        </div>
        <div className={`${style?.grandTotal}`}>
          <div className="d-flex">
            <div className="col-6 text-end border-end p-1">
              <p> CGST @ 0.13%</p>
              <p>SGST @ 0.13%</p>
              <p>Less</p>
            </div>
            <div className="col-6 p-1 text-end">
              <p> 110.89 </p>
              <p>110.89 </p>
              <p>-0.23</p>
            </div>
          </div>
          <div className="d-flex border-top">
            <div className="col-6 text-end border-end p-1">
              <p className="fw-bold">GRAND TOTAL</p>
            </div>
            <div className="col-6 p-1 text-end">
              <p className="fw-bold">85,524.92</p>
            </div>
          </div>
        </div>
      </div>
      {/* declaration */}
      <div className="border-start border-end border-bottom p-2" dangerouslySetInnerHTML={{__html: headerData?.Declaration}}></div>
      {/* remarks */}
      <div className="d-flex border-start border-end border-bottom p-2">
          <p><span className="fw-bold">REMARKS : </span>Insert remark here</p>
      </div>
    </div>
    
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default TaxInvoice3;
