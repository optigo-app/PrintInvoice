import React from "react";
import "../../assets/css/prints/summary2.css";
import { useState } from "react";
import { useEffect } from "react";
import {
  FooterComponent,
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";

const Summary2 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [result, setResult] = useState(null);
  const [classIs, setClassIs] = useState({
    col1: "thcol1s2",
    col2: "thcol2s2",
    col3: "thcol3s2",
    col4: "thcol4s2",
    col5: "thcol5s2",
    col6: "thcol6s2",
    col7: "thcol7s2",
    col8: "thcol8s2",
    col9: "thcol9s2",
    col10: "thcol10s2",
    col11: "thcol11s2",
    col12: "thcol12s2",
    col13: "thcol13s2",
    col14: "thcol14s2",
  });
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [footerComp, setFooterComp] = useState(null);
  const [hsnetwt, sethsnetwt] = useState(true);
  const [hsimg, sethsimg] = useState(true);
  const [hsbrand, sethsbrand] = useState(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let print_name = atob(printName);
    console.log(print_name);
    if (print_name === "invoice print 5") {
      setClassIs({
        col1: "thcol1s2",
        col2: "thcol1s2",
        col3: "thcol1s2",
        col4: "thcol1s2",
        col5: "thcol1s2",
        col6: "thcol1s2",
        col7: "thcol1s2",
        col8: "thcol1s2",
        col9: "thcol1s2",
        col10: "thcol1s2",
        col11: "thcol1s2",
        col12: "thcol1s2",
        col13: "thcol1s2",
        col14: "thcol1s2",
      });
    }
    if (print_name === "invoice print 7") {
      setClassIs({
        col1: "thcol1s2",
        col2: "thcol1s2",
        col3: "thcol1s2",
        col4: "thcol1s2",
        col5: "thcol1s2",
        col6: "thcol1s2",
        col7: "thcol1s2",
        col8: "thcol1s2",
        col9: "thcol1s2",
        col10: "thcol1s2",
        col11: "thcol1s2",
        col12: "thcol1s2",
        col13: "thcol1s2",
        col14: "thcol1s2",
      });
    }
  }, [printName]);

  function loadData(data) {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    const footerCom = FooterComponent(
      data?.BillPrint_Json[0]?.HeaderNo,
      data?.BillPrint_Json[0]
    );
    setFooterComp(footerCom);
    setResult(datas);
    console.log(datas.resultArray);
  }

  const handlenetwtcol = (e) => {
    let val = e.target.value;
    if (val === "netwts2") {
      if (hsnetwt) {
        sethsnetwt(false);
      } else {
        sethsnetwt(true);
      }
    }
    if (val === "images2") {
      if (hsimg) {
        sethsimg(false);
      } else {
        sethsimg(true);
      }
    }
    if (val === "brands2") {
      if (hsbrand) {
        sethsbrand(false);
      } else {
        sethsbrand(true);
      }
    }
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerS2">
                {/* print and hide show buttons */}
                <div className="d-flex justify-content-end align-items-center mb-3 mx-2 fw-bold user-select-none hidebtns2">
                  <div className="px-1">
                    <input
                      type="checkbox"
                      checked={hsnetwt}
                      id="netwts2"
                      value="netwts2"
                      className="mx-1"
                      onChange={handlenetwtcol}
                    />
                    <label htmlFor="netwts2">With NetWt</label>
                  </div>
                  <div className="px-1">
                    <input
                      type="checkbox"
                      checked={hsimg}
                      id="imgshs2"
                      value="images2"
                      className="mx-1"
                      onChange={handlenetwtcol}
                    />
                    <label htmlFor="imgshs2">With Image</label>
                  </div>
                  <div className="px-1">
                    <input
                      type="checkbox"
                      checked={hsbrand}
                      id="brandshs2"
                      value="brands2"
                      className="mx-1"
                      onChange={handlenetwtcol}
                    />
                    <label htmlFor="brandshs2">With Brand</label>
                  </div>
                  <div>
                    <button
                      className="btn_white blue m-0 mx-2 p-1"
                      onClick={(e) => handlePrint(e)}
                    >
                      Print
                    </button>
                  </div>
                </div>
                <div></div>
                {/* headers */}
                <div className="headers2 d-flex justify-content-between p-2 border-bottom ">
                  <div className="subdiv1s2 w-75">
                    <div className="fw-bold  fs-5">
                      {result?.header?.CompanyFullName}
                    </div>
                    <div className="lhs2">{result?.header?.CompanyAddress}</div>
                    <div className="lhs2">
                      {result?.header?.CompanyAddress2}
                    </div>
                    <div className="lhs2">
                      {result?.header?.CompanyCity}-
                      {result?.header?.CompanyPinCode},
                      {result?.header?.CompanyState}(
                      {result?.header?.CompanyCountry})
                    </div>
                    <div className="lhs2">
                      T {result?.header?.CompanyTellNo} | TOLL FREE{" "}
                      {result?.header?.CompanyTollFreeNo}{" "}
                    </div>
                    <div className="lhs2">{result?.header?.CompanyEmail}</div>
                    <div className="lhs2">
                      {result?.header?.Company_VAT_GST_No} |{" "}
                      {result?.header?.Company_CST_STATE}-
                      {result?.header?.Company_CST_STATE_No} | PAN-
                      {result?.header?.Pannumber}
                    </div>
                  </div>
                  <div className="subdiv1s2 w-25 d-flex justify-content-end">
                    <img
                      src={result?.header?.PrintLogo}
                      className="printlogos2"
                      alt="comapanylogo"
                    />
                  </div>
                </div>
                {/* sub headers */}
                <div className="subhead1s2 border mt-2 p-1 d-flex justify-content-between">
                  <div>
                    INVOICE#: <b>{result?.header?.InvoiceNo}</b>
                  </div>
                  <div className="pe-2">
                    <div>
                      DATE : <b>{result?.header?.EntryDate}</b>
                    </div>
                    <div>
                      {result?.header?.HSN_No_Label} :{" "}
                      <b>{result?.header?.HSN_No}</b>
                    </div>
                  </div>
                </div>
                <div className="subhead2s2 d-flex justify-content-between p-2 border border-top-0">
                  <div className="d-flex">
                    <div className="fw-bold pe-2">TO,</div>
                    <div>
                      <div className="fw-bold">
                        {result?.header?.customerfirmname}
                      </div>
                      <div>{result?.header?.customerstreet}</div>
                      <div>{result?.header?.customerregion}</div>
                      <div>
                        {result?.header?.customercity}
                        {result?.header?.customerpincode}
                      </div>
                      <div>Phno:-{result?.header?.customermobileno}</div>
                      <div>
                        {result?.header?.vat_cst_pan} |{" "}
                        {result?.header?.Cust_CST_STATE}-
                        {result?.header?.Cust_CST_STATE_No}
                      </div>
                    </div>
                  </div>
                  <div className="fw-bold">
                    {result?.header?.MetalRate24K?.toFixed(2)}
                  </div>
                </div>
                {/* table */}
                <div>
                  {/* table head */}
                  <div className="d-flex fw-bold border border-top-0 theads2">
                    <div className={`${classIs.col1} border-end centers2`}>
                      SR#
                    </div>
                    <div className={`${classIs.col2} border-end starts2 ps-1`}>
                      DESIGN
                    </div>
                    <div className={`${classIs.col3} border-end centers2`}>
                      PURITY
                    </div>
                    <div className={`${classIs.col4} border-end centers2`}>
                      QLTY
                    </div>
                    <div className={`${classIs.col5} border-end centers2`}>
                      DIA WT
                    </div>
                    <div className={`${classIs.col6} border-end centers2`}>
                      DIA RATE
                    </div>
                    <div className={`${classIs.col7} border-end centers2`}>
                      DIA AMT
                    </div>
                    <div className={`${classIs.col8} border-end centers2`}>
                      G WT
                    </div>
                    <div className={`${classIs.col9} border-end centers2`}>
                      NWT
                    </div>
                    <div className={`${classIs.col10} border-end centers2`}>
                      MAKING
                    </div>
                    <div className={`${classIs.col11} border-end centers2`}>
                      CSAMT
                    </div>
                    <div className={`${classIs.col12} border-end centers2`}>
                      GOLD FINE
                    </div>
                    <div className={`${classIs.col13} border-end centers2`}>
                      GOLD AMT
                    </div>
                    <div className={`${classIs.col14} centers2`}>AMOUNT</div>
                  </div>
                  {/* table body */}
                  <div>
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <div className="d-flex border border-top-0 trows2">
                          <div className={`${classIs.col1} border-end centers2`}>{e?.SrNo}</div>
                          <div className={`${classIs.col2} border-end d-flex flex-column ps-1`}>
                            <div className="fw-bold">{e?.designno}</div>
                            <div className="fw-bold">{e?.SrJobno}</div>
                            <div className="centers2"><img src={e?.DesignImage} alt="designimage" className="desImgs2" onError={(e) => handleImageError(e)} /></div>
                            <div className="centers2">{e?.HUID}</div>
                            <div className="centers2 fw-bold">Tunch : {e?.Tunch?.toFixed(3)}</div>
                          </div>
                          <div className={`${classIs.col3} border-end centers2`}>{e?.MetalTypePurity}</div>
                          <div className={`${classIs.col4} border-end centers2`}>QLTY</div>
                          <div
                            className={`${classIs.col5} border-end centers2`}
                          >
                            DIA WT
                          </div>
                          <div
                            className={`${classIs.col6} border-end centers2`}
                          >
                            DIA RATE
                          </div>
                          <div
                            className={`${classIs.col7} border-end centers2`}
                          >
                            DIA AMT
                          </div>
                          <div className={`${classIs.col8} border-end tops2 pe-1`}>{e?.grosswt?.toFixed(3)}</div>
                          <div className={`${classIs.col9} border-end tops2 pe-1`}>{e?.NetWt?.toFixed(3)}</div>
                          <div
                            className={`${classIs.col10} border-end centers2`}
                          >
                            MAKING
                          </div>
                          <div className={`${classIs.col11} border-end tops2 pe-1`}>{formatAmount(e?.CsAmount)}</div>
                          <div
                            className={`${classIs.col12} border-end centers2`}
                          >
                            GOLD FINE
                          </div>
                          <div className={`${classIs.col13} border-end tops2 pe-1`}>{formatAmount(e?.MetalAmount)}</div>
                          <div className={`${classIs.col14} tops2 pe-1`}>{formatAmount(e?.TotalAmount)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default Summary2;
