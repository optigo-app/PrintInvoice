// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=UEUvMTMyLzIwMjU=&evn=c2FsZQ==&pnm=ZXN0aW1hdGlvbiAx&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=EstimatePrintK&pid=undefined

import React from "react";
import "../../assets/css/prints/Estimation1.scss";
import { ToWords } from "to-words";
import { useState } from "react";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import { useEffect } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  NumberWithCommas,
  fixedValues,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { cloneDeep } from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { deepClone } from "@mui/x-data-grid/utils/utils";

const Estimation1 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [purityWise, setPurityWise] = useState([]);

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(
          token,
          invoiceNo,
          printName,
          urls,
          evn,
          ApiVer
        );
        console.log("datadatadata", data);

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
          // setMsg(data?.Message);
          const err = checkMsg(data?.Message);
          console.log(data?.Message);
          setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    const copydata = cloneDeep(data);

    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );
    setResult(datas);

    let pwise = [];

    datas?.resultArray?.forEach((el) => {
      let obj = deepClone(el);
      let findRec = pwise?.findIndex(
        (a) => a?.MetalTypePurity === obj?.MetalTypePurity
      );
      if (findRec === -1) {
        pwise.push(obj);
      } else {
        pwise[findRec].grosswt += obj?.grosswt;
        pwise[findRec].NetWt += obj?.NetWt;
        pwise[findRec].LossWt += obj?.LossWt;
      }
    });
    pwise.sort((a, b) => {
      const purityA = parseInt(a.MetalTypePurity.match(/\d+/)[0]);
      const purityB = parseInt(b.MetalTypePurity.match(/\d+/)[0]);
      return purityA - purityB;
    });
    setPurityWise(pwise);
  };

  const finalAmount =
    (result?.mainTotal?.TotalAmount + result?.header?.FreightCharges) /
      result?.header?.CurrencyExchRate +
    result?.allTaxesTotal;
  const decimalPart = parseFloat(
    (finalAmount - Math.floor(finalAmount)).toFixed(2)
  );
  let roundedAmount = finalAmount;
  if (decimalPart < 0.5) {
    roundedAmount = finalAmount - decimalPart;
  } else {
    roundedAmount = finalAmount + (1 - decimalPart);
  }

  console.log("resultdata", result);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="estimation1_main">
                  <div className="d-flex justify-content-end align-items-center d_none_jts">
                    <Button />
                  </div>
                  <div className="topheaderMain">
                    <p className="copmName">
                      {result?.header?.CompanyFullName}
                    </p>
                    <p className="compPhone">Ph:09856589851/09856589851</p>
                    <p className="title_estimate">ESTIMATION</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "3px double #000", // double line on top
                        borderBottom: "3px double #000", // double line on bottom
                        padding: "5px 0",
                      }}
                    >
                      <p>
                        <span>Est No.: </span>
                        {result?.header?.InvoiceNo}
                      </p>
                      <p>
                        Date: <span>{result?.header?.EntryDate}</span>
                      </p>
                    </div>
                  </div>

                  {result?.resultArray
                    ?.slice() 
                    ?.sort((a, b) => {
                      const numA = parseInt(
                        a?.SrJobno?.split("/")?.[1] || 0,
                        10
                      );
                      const numB = parseInt(
                        b?.SrJobno?.split("/")?.[1] || 0,
                        10
                      );
                      return numA - numB;
                    })
                    ?.map((e, i) => {
                      return e?.metal?.map((el, id) => (
                        <div key={`${i}-${id}`} className="deatilSectionMain">
                          <div className="detail_section_main">
                            <div className="detail_Setion1">
                              <div style={{ display: "flex", gap: "10px" }}>
                                <p>{i + 1}.</p>
                                <p>{e?.SrJobno}</p>
                              </div>
                              <p>{e?.SubCategoryname}</p>
                              <p>
                                {e?.Categoryname}({e?.MetalPurity})
                              </p>
                              <p>{e?.metal_rate?.toFixed(2)}</p>
                            </div>
                            <div className="detail_Setion2">
                              <div className="detail_Setion2_sub1">
                                <p>Gr.Wt</p>
                                <p>Less St Wt</p>
                                <p>Net Wt </p>
                                <p>Value Added In Grm</p>
                                <p>Net Chg Wt</p>
                              </div>
                              <div className="detail_Setion2_sub2">
                                <p className="">{e?.grosswt?.toFixed(3)}</p>
                                <p>{(e?.grosswt - e?.NetWt)?.toFixed(3)}</p>
                                <p>{e?.NetWt?.toFixed(3)}</p>
                                <p>{e?.LossWt?.toFixed(3)}</p>
                                <p>{e?.MetalDiaWt?.toFixed(3)}</p>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              borderTop: "1px solid black",
                              borderBottom: "1px solid black",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>
                              <b>Gold Amt</b>
                            </p>
                            <p>
                              <b>{e?.TotalAmount?.toFixed(2)}</b>
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p style={{ width: "20%" }}>Diamond</p>
                            <p>{e?.totals?.diamonds?.Wt?.toFixed(3)}CT</p>
                            <p>{e?.totals?.diamonds?.Pcs} pcs </p>
                            <p>{e?.totals?.diamonds?.Amount?.toFixed(2)}</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p style={{ width: "20%" }}>ColorStone</p>
                            <p>{e?.totals?.colorstone?.Wt?.toFixed(3)}CT</p>
                            <p>{e?.totals?.colorstone?.Pcs} pcs </p>
                            <p>{e?.totals?.colorstone?.Amount?.toFixed(2)}</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>
                              <b>M/C Total</b>
                            </p>
                            <p>
                              <b>0.00</b>
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "3px double #000",
                            }}
                          >
                            <p>
                              <b>Other</b>
                            </p>
                            <p>
                              <b>0.00</b>
                            </p>
                          </div>
                        </div>
                      ));
                    })}
                  <div className="estimate_bottom_total">
                    <div style={{ width: "70%", borderRight: "1px solid" }}>
                      <p>TOTAL VALUE BEFORE GST</p>
                      <p>GST 4.00% VALUE </p>
                      <p>TOTAL VALUE OF ORNAMENTS</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        width: "30%",
                      }}
                    >
                      <p>
                        <b>{result?.mainTotal?.total_amount?.toFixed(2)}</b>
                      </p>

                      <p>
                        <b>{result?.header?.TotalGSTAmount?.toFixed(2)}</b>
                      </p>
                      <p>
                        <b>{result?.finalAmount?.toFixed(2)}</b>
                      </p>
                    </div>
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

export default Estimation1;
