import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  apiCall,
  CapitalizeWords,
  handleImageError,
  isObjectEmpty,
  numberToWord,
  NumberWithCommas,
} from "../../GlobalFunctions";
import convertor from "number-to-words";
import "../../assets/css/prints/invoiceprint2.css";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { taxGenrator } from "./../../GlobalFunctions";

const InvoicePrint2 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState();
  const [json1, setJson1] = useState();
  const [json2, setJson2] = useState();
  const [resultArray, setResultArray] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [inWords, setInWords] = useState("");
  const [summaryDetail, setSummaryDetail] = useState({});
  const [mainTotal, setMainTotal] = useState({});
  const [taxTotal, setTaxTotal] = useState([]);
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");

  async function loadData(data) {
    // console.log(data);
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      setJson1(data?.BillPrint_Json1);
      setJson2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      countCategorySubCategory(data?.BillPrint_Json1);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

  const organizeData = (json, json1, json2) => {
    let resultArr = [];
    let grandTotal = 0;
    let totAmt = 0;

    let mainTotal = {
      diamonds: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      colorstone: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      metal: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      misc: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      finding: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      totalnetwt: {
        netwt: 0,
      },
      totalgrosswt: {
        grosswt: 0,
      },
      totAmount: {
        TotalAmount: 0,
      },
      totlbrAmt: {
        Amount: 0,
      },
      totOthAmt: {
        Amount: 0,
      },
    };
    // eslint-disable-next-line array-callback-return
    json1?.map((e) => {
      let diamondlist = [];
      let colorstonelist = [];
      let metallist = [];
      let misclist = [];
      let findinglist = [];
      let totals = {
        diamonds: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        colorstone: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        metal: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        misc: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        finding: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        labour: {
          labourAmount: 0,
        },

        OtherCh: {
          OtherAmount: 0,
        },
      };

      // eslint-disable-next-line array-callback-return

      mainTotal.totAmount.TotalAmount += e?.TotalAmount;
      mainTotal.totOthAmt.Amount += e?.OtherCharges + e?.MiscAmount;
      mainTotal.totalgrosswt.grosswt += e?.grosswt;
      mainTotal.totalnetwt.netwt += e?.NetWt;
      totAmt += e?.TotalAmount;

      json2?.map((ele) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondlist.push(ele);
            totals.diamonds.Pcs += ele?.Pcs;
            totals.diamonds.Wt += ele?.Wt;
            totals.diamonds.Amount += ele?.Amount;
            totals.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Pcs += ele?.Pcs;
            mainTotal.diamonds.Wt += ele?.Wt;
            mainTotal.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Amount += ele?.Amount;
          }

          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstonelist.push(ele);
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Amount += ele?.Amount;
            totals.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Pcs += ele?.Pcs;
            mainTotal.colorstone.Wt += ele?.Wt;
            mainTotal.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misclist.push(ele);
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Amount += ele?.Amount;
            totals.colorstone.Rate += ele?.Rate;
            mainTotal.misc.Pcs += ele?.Pcs;
            mainTotal.misc.Wt += ele?.Wt;
            mainTotal.misc.Rate += ele?.Rate;
            mainTotal.misc.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metallist.push(ele);
            totals.metal.Pcs += ele?.Pcs;
            totals.metal.Wt += ele?.Wt;
            totals.metal.Amount += ele?.Amount;
            totals.metal.Rate += ele?.Rate;
            mainTotal.metal.Pcs += ele?.Pcs;
            mainTotal.metal.Wt += ele?.Wt;
            mainTotal.metal.Rate += ele?.Rate;
            mainTotal.metal.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            findinglist.push(ele);
            totals.finding.Pcs += ele?.Pcs;
            totals.finding.Wt += ele?.Wt;
            totals.finding.Amount += ele?.Amount;
            totals.finding.Rate += ele?.Rate;
            mainTotal.finding.Pcs += ele?.Pcs;
            mainTotal.finding.Wt += ele?.Wt;
            mainTotal.finding.Rate += ele?.Rate;
            mainTotal.finding.Amount += ele?.Amount;
          }
        }
      });

      let obj = { ...e };
      obj.diamondsDetails = diamondlist;
      obj.colorstoneDetails = colorstonelist;
      obj.metalDetails = metallist;
      obj.miscDetails = misclist;
      obj.findingDetails = findinglist;
      obj.AllJobsTotal = mainTotal;
      obj.JobWiseTotal = totals;
      resultArr.push(obj);
      setResultArray(resultArr);
    });

    setMainTotal(mainTotal);
    // let grandTot = totAmt + json?.AddLess + json?.TotalCGSTAmount + json?.TotalSGSTAmount;
    let grandTot = totAmt + json?.AddLess;

    let AllTax = taxGenrator(json, grandTot);

    setTaxTotal(AllTax);

    AllTax?.forEach((e) => {
      grandTot += +e?.amount;
    });

    // let words = CapitalizeWords(convertor?.toWords(Math.round(grandTot)));
    let words = numberToWord(grandTot)+" Only";

    setInWords(words);
    setGrandTotal(grandTot);
  };
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        // console.log(data);
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
  // useEffect(() => {
  //   // loadData();
  //   const sendData = async () => {
  //     try {
  //       const data = await apiCall(token, invoiceNo, printName, urls, evn);
  //       loadData(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   sendData();
  // }, []);

  const findKeyValuePair = (array, firstName, secondName) => {
    const counts = {};
    array.forEach((item) => {
      const key = `${item[firstName]} | ${item[secondName]}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

  const countCategorySubCategory = (data) => {
    const groupedData = data.reduce((result, item) => {
      const { Categoryname, ...rest } = item; // Destructure the object
      if (!result[Categoryname]) {
        result[Categoryname] = []; // Initialize an array for the category if it doesn't exist
      }
      result[Categoryname].push(rest); // Push the item to the corresponding category array
      return result;
    }, {});

    const lengthsArray = [];

    for (const key in groupedData) {
      if (Array.isArray(groupedData[key])) {
        lengthsArray.push({ [key]: groupedData[key].length });
      }
    }
    const formattedArray = lengthsArray.map((item) => {
      const [name, val] = Object.entries(item)[0];
      return { name, val };
    });

    let arr1 = formattedArray.slice(0, 3);
    let arr2 = formattedArray.slice(3, 6);
    let arr3 = formattedArray.slice(6, 9);
    let arr4 = formattedArray.slice(9, 12);
    let obj = {
      firstArr: arr1,
      secondArr: arr2,
      thirdArr: arr3,
      fourthArr: arr4,
    };
    setSummaryDetail(obj);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="btnpcl">
                <Button />
              </div>
              <div className="summary1Printinvp2 pad_60_allPrint">
                <div className="mainheaderivp2">
                  <div className="head3ivp2">
                    <div className="d-flex" style={{ width: "80%" }}>
                      <div className="fw-bold fs-4 px-2">INVOICE #: </div>
                      {/* <div className="fs-5 p-1">{headerData?.PrintRemark}</div> */}
                      <div className="fs-5 p-1" dangerouslySetInnerHTML={{__html:headerData?.Remark}}></div>
                    </div>
                    <div className="invoicehead3ivp2 d-flex flex-column">
                      <div className="d-flex justify-content-around align-items-center binvivp2">
                        <b className="binvivp2">DATE :</b>
                        {headerData?.EntryDate}
                      </div>
                      <div className="d-flex justify-content-around align-items-center binvivp2">
                        <b className="binvivp2">HSN :</b>
                        {headerData?.HSN_No}
                      </div>
                    </div>
                  </div>
                  <div className="head4ivp2">
                    <div className="samplehead4ivp2">
                      {headerData?.customerfirmname}
                    </div>
                    <div className="lhhead4ivp2">
                      {headerData?.customerstreet}
                    </div>
                    <div className="lhhead4ivp2">
                      Area {headerData?.customerAddress2}
                    </div>
                    <div className="lhhead4ivp2">
                      {headerData?.customercity}
                    </div>
                    <div className="lhhead4ivp2">
                      {headerData?.customermobileno}
                    </div>
                    <div className="lhhead4ivp2">
                      {headerData?.vat_cst_pan} |{" "}
                      {headerData?.Company_CST_STATE}-
                      {headerData?.Company_CST_STATE_No}
                    </div>
                  </div>
                </div>
                <div className="tableSectionivp2">
                  <div className="theadivp2">
                    <div className="wthivp2 srwivp2">SR#</div>
                    <div className="wthivp2 designwivp2">DESIGNS / CODE</div>
                    <div className="wthivp2">METAL</div>
                    <div className="wthivp2">GWT</div>
                    <div className="wthivp2">NWT</div>
                    <div className="wthivp2">DPCS</div>
                    <div className="wthivp2">DWT</div>
                    <div className="wthivp2">CSPCS</div>
                    <div className="wthivp2">CSWT.</div>
                    <div className="wthivp2">OTHER</div>
                    <div className="wthivp2 brightivp2">TOTAL</div>
                  </div>
                  {resultArray?.map((e, i) => {
                    return (
                      <div className="tbodyivp2" key={i}>
                        <div className="wtbivp2 srwivp2">{e?.SrNo}</div>
                        <div className="wtbivp2 designwivp2 d-flex justify-content-around p-1">
                          <div>
                            <img
                              src={e?.DesignImage}
                              alt="#invp2"
                              id="imgDyInvp2"
                              onError={(e) => handleImageError(e)}
                            />
                          </div>
                          <div className="designContentinvp2">
                            <p
                              className="brbdesigninvp2"
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                lineHeight: "8px",
                                fontSize: "12px",
                                height: "16px",
                              }}
                            >
                              {e?.designno}
                            </p>
                            <p className="brbdesigninvp2 brbinvp2">
                              {e?.SrJobno}
                            </p>
                          </div>
                        </div>
                        <div className="wtbivp2 alignleftinvp2">
                          {e?.MetalTypePurity}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {e?.grosswt?.toFixed(3)}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {e?.NetWt?.toFixed(3)}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {e?.JobWiseTotal?.diamonds?.Pcs}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {e?.JobWiseTotal?.diamonds?.Wt?.toFixed(3)}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {e?.JobWiseTotal?.colorstone?.Pcs}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {e?.JobWiseTotal?.colorstone?.Wt?.toFixed(3)}
                        </div>
                        <div className="wtbivp2 alignrightinvp2">
                          {/* {e?.OtherCharges?.toFixed(2)} */}
                          {NumberWithCommas(e?.OtherCharges, 2)}
                        </div>
                        <div className="wtbivp2 brightivp2 alignrightinvp2">
                        <p dangerouslySetInnerHTML={{__html: headerData?.Currencysymbol}}></p> {NumberWithCommas(e?.TotalAmount, 2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="secondheadinvp2">
                  {/* <div className='secondtbodyinvp2'>
                            </div> */}
                  <div>
                    <div className="tbodyinvp2second">
                      <div className="wtbinvp2 wtotalinvp2 htotalrowinvp2">
                        <b className="totrowfsinvp2">TOTAL</b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {mainTotal?.totalgrosswt?.grosswt?.toFixed(3)}
                        </b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {mainTotal?.totalnetwt?.netwt?.toFixed(3)}
                        </b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {mainTotal?.diamonds?.Pcs}
                        </b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {mainTotal?.diamonds?.Wt?.toFixed(3)}
                        </b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {mainTotal?.colorstone?.Pcs}
                        </b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {mainTotal?.colorstone?.Wt?.toFixed(3)}
                        </b>
                      </div>
                      <div className="wtbinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2">
                          {/* {mainTotal?.totOthAmt?.Amount?.toFixed(2)} */}
                          {NumberWithCommas(mainTotal?.totOthAmt?.Amount, 2)}
                        </b>
                      </div>
                      <div className="wtbinvp2 brightinvp2 htotalrowinvp2 alignrightinvp2">
                        <b className="totrowfsinvp2 d-flex">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: headerData?.Currencysymbol,
                            }}
                          ></p>{" "}
                          {/* {mainTotal?.totAmount?.TotalAmount?.toFixed(2)} */}
                          {NumberWithCommas(mainTotal?.totAmount?.TotalAmount, 2)}
                        </b>
                      </div>
                    </div>
                    <div className="totaldesigninvp2">
                      {/* <div className='d-flex justify-content-between wtotinvp2'><p className='totgstinvp2 gsttotsum1'>CGST @ {headerData?.CGST}% </p>	<p className='totgstinvp2'>{headerData?.TotalCGSTAmount?.toFixed(2)}</p></div>
                                    <div className='d-flex justify-content-between wtotinvp2'><p className='totgstinvp2 gsttotsum1'>SGST @ {headerData?.SGST}%</p>	<p className='totgstinvp2'>{headerData?.TotalSGSTAmount?.toFixed(2)}</p></div> */}
                      {taxTotal?.length > 0 &&
                        taxTotal?.map((e, i) => {
                          return (
                            <div
                              className="d-flex justify-content-between wtotinvp2"
                              key={i}
                            >
                              <div className="w-50 d-flex justify-content-end">
                                {e?.name} {e?.per}
                              </div>
                              <div className="w-50 d-flex justify-content-end">
                                {NumberWithCommas(e?.amount, 2)}
                              </div>
                            </div>
                          );
                        })}
                      <div className="d-flex justify-content-between wtotinvp2">
                        <p className="totgstinvp2 gsttotsum1 fw-bold">
                          {headerData?.AddLess > 0 ? "ADD" : "Less"}
                        </p>
                        <p className="totgstinvp2 fw-bold">
                          {headerData?.AddLess?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="grandtotalinvp2">
                      <div className="amtwordsinvp2 px-2">{inWords}</div>
                      <div className="amtwordsinvp2 wtotinvp2 d-flex align-items-center justify-content-end  wgtinvp2">
                        <div className="w-50 d-flex justify-content-end"> Grand Total :</div>{" "}
                        <div className="d-flex w-50 justify-content-end ">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: headerData?.Currencysymbol,
                            }}
                          ></p>{" "}
                          {/* {grandTotal?.toFixed(2)} /-{" "} */}
                          {NumberWithCommas(grandTotal, 2)} /-{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="summaryinvp2">
                    <div className="summaryinvp2fs">Summary Detail</div>
                    <div className="summaryDetailinvp2">
                      <div className="wsummaryinvp2">
                        {summaryDetail?.firstArr?.map((e, i) => {
                          return (
                            <div key={i} className="d-flex arrinvp2">
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "60%" }}
                              >
                                {e?.name}
                              </div>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "20%" }}
                              >
                                {" "}
                                :{" "}
                              </div>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "20%" }}
                              >
                                {e?.val}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="wsummaryinvp2">
                        {summaryDetail?.secondArr?.map((e, i) => {
                          return (
                            <div className="d-flex arrinvp2" key={i}>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "60%" }}
                              >
                                {e?.name}
                              </div>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "20%" }}
                              >
                                {" "}
                                :{" "}
                              </div>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "20%" }}
                              >
                                {e?.val}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="wsummaryinvp2">
                        {summaryDetail?.thirdArr?.map((e, i) => {
                          return (
                            <div className="d-flex arrinvp2" key={i}>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "60%" }}
                              >
                                {e?.name}
                              </div>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "20%" }}
                              >
                                :
                              </div>
                              <div
                                className="summwinvp2 fs13invp2"
                                style={{ width: "20%" }}
                              >
                                {e?.val}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="wsummaryinvp2">
                        {summaryDetail?.fourthArr?.map((e, i) => {
                          return (
                            <>
                              <div className="d-flex arrinvp2" key={i}>
                                <div
                                  className="summwinvp2 fs13invp2"
                                  style={{ width: "60%" }}
                                >
                                  {e?.name}
                                </div>
                                <div
                                  className="summwinvp2 fs13invp2"
                                  style={{ width: "20%" }}
                                >
                                  {" "}
                                  :{" "}
                                </div>
                                <div
                                  className="summwinvp2 fs13invp2"
                                  style={{ width: "20%" }}
                                >
                                  {e?.val}
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="notesinvp2">
                    <div className="noteinvp2">NOTE :</div>
                    <div
                      className="noteDemoinvp2"
                      dangerouslySetInnerHTML={{
                        __html: headerData?.Declaration,
                      }}
                    ></div>
                  </div>

                  <div className="footerinvp2">
                    <div className="footer1invp2">
                      <p className="footerSignValinvp2">
                        RECEIVER's NAME & SIGNATURE
                      </p>
                    </div>
                    <div className="footer1invp2">
                      <p className="footer2SignValinvp2 ">
                        for, {headerData?.CompanyFullName}
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

export default InvoicePrint2;
