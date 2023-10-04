import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/prints/invoiceprint3.css";
import { apiCall, CapitalizeWords, isObjectEmpty } from "../../GlobalFunctions";
import convertor from "number-to-words";
import { taxGenrator } from "./../../GlobalFunctions";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";

const InvoicePrint3 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState();
  const [json1, setJson1] = useState();
  const [json2, setJson2] = useState();
  const [resultArray, setResultArray] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [totDiscount, setTotDiscount] = useState(0);
  const [inWords, setInWords] = useState("");
  const [mainTotal, setMainTotal] = useState({});
  const [groupedArr, setGroupedArr] = useState([]);
  const [groupedArrAmountTotal, setGroupedArrAmountTotal] = useState(0);
  const [LOM, setLOM] = useState([]);
  const [descArr, setDescArr] = useState("");
  const [taxTotal, setTaxTotal] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  // async function loadData() {
  //   try {
  //     const body = {
  //       token: token,
  //       invoiceno: invoiceNo,
  //       printname: printName,
  //       Eventname: evn,
  //     };

  //     const data = await axios.post(urls, body);
  //     if (data?.data?.Status == 200) {
  //       let datas = data?.data?.Data;
  //       // setResponsejson(datas);
  //       setHeaderData(datas?.BillPrint_Json[0]);
  //       setJson1(datas?.BillPrint_Json1);
  //       setJson2(datas?.BillPrint_Json2);
  //       organizeData(
  //         datas?.BillPrint_Json[0],
  //         datas?.BillPrint_Json1,
  //         datas?.BillPrint_Json2
  //       );
  //       // countCategorySubCategory(datas?.BillPrint_Json1);
  //       // countCategories(datas?.BillPrint_Json1);
  //     } else {
  //       console.log(data?.data?.Status, data?.data?.Message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const organizeData = (json, json1, json2) => {
    let resultArr = [];
    let grandTotal = 0;
    let totAmt = 0;
    let totdis = 0;
    let groupedAmtTotal = 0;
    let totOthAmt = 0;
    let totLbrAmt = 0;
    let totmiscAmt = 0;
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
    json1.map((e) => {
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

      totdis = totdis + e?.DiscountAmt;
      mainTotal.totAmount.TotalAmount += e?.TotalAmount;
      mainTotal.totOthAmt.Amount += e?.OtherCharges + e?.MiscAmount;
      mainTotal.totalgrosswt.grosswt += e?.grosswt;
      mainTotal.totalnetwt.netwt += e?.NetWt;
      totAmt += e?.TotalAmount;
      totLbrAmt += e?.MakingAmount;
      totOthAmt += e?.OtherCharges;
      totmiscAmt += e?.MiscAmount;

      json2.map((ele) => {
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
    let arr = [];

    json2.map((ele) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex(
            (e) =>
              e?.ShapeName === ele?.ShapeName &&
              e?.Rate === ele?.Rate &&
              e?.QualityName === ele?.QualityName
          );
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex((e) => e?.Rate === ele?.Rate);
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex((e) => e?.Rate === ele?.Rate);
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
        if (arr.length === 0) {
          arr.push(ele);
        } else {
          let findIndex = arr.findIndex((e) => e?.Rate === ele?.Rate);
          if (findIndex === -1) {
            arr.push(ele);
          } else {
            arr[findIndex].Wt += ele?.Wt;
            arr[findIndex].Amount += ele?.Amount;
          }
        }
      }
    });
    let aa = 0;
    json1?.map((e) => {
      aa += e?.TotalAmount;
    });

    groupedAmtTotal = groupedAmtTotal + totLbrAmt + totOthAmt;
    let obj1 = {
      ShapeName: "OTHER",
      QualityName: "",
      Amount: totOthAmt,
    };
    let obj2 = {
      ShapeName: "LABOUR",
      QualityName: "",
      Amount: totLbrAmt,
    };
    let obj3 = {
      ShapeName: "MISC",
      QualityName: "",
      Amount: totmiscAmt,
    };
    let LOM = [];
    LOM.push(obj3, obj2, obj1);
    setLOM(LOM);
    setGroupedArrAmountTotal(groupedAmtTotal);
    setGroupedArr(arr);

    setMainTotal(mainTotal);

    let grandTot = totAmt + json?.AddLess;

    let allTax = taxGenrator(json, aa);
    setTaxTotal(allTax);

    allTax?.forEach((e) => {
      aa += +e?.amount;
    });
    let words = CapitalizeWords(convertor.toWords(Math.round(aa)));
    setInWords(words);
    setGrandTotal(aa);
    setTotDiscount(totdis);
    const groupedData = arr.reduce((result, item) => {
      let groupName;

      switch (item.MasterManagement_DiamondStoneTypeid) {
        case 1:
          groupName = "Diamond";
          break;
        case 2:
          groupName = "ColorStone";
          break;
        case 3:
          groupName = "CZ";
          break;
        case 4:
          groupName = "Gold";
          break;
        default:
          groupName = "Other";
      }

      // Initialize the group if it doesn't exist
      if (!result[groupName]) {
        result[groupName] = [];
      }

      // Add the item to the corresponding group
      result[groupName].push(item);

      return result;
    }, {});

    const groupNamesArray = Object.keys(groupedData);
    const sentence = groupNamesArray.join(", ");
    setDescArr(sentence);
  };
  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      setJson1(data?.BillPrint_Json1);
      setJson2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      // countCategorySubCategory(data?.BillPrint_Json1);

      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }
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
  // useEffect(() => {
  //   loadData();
  // }, []);

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
              <div className="containerinvp3" id="divToPrint">
                <div className="headinvp3">
                  <div className="headerinvp3">
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">BILL NO</p>
                      <p className="fsinvp3">{headerData?.PrintRemark}</p>
                    </div>
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">DATE</p>
                      <p className="fsinvp3">{headerData?.EntryDate}</p>
                    </div>
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3">HSN</p>
                      <p className="fsinvp3">{headerData?.HSN_No}</p>
                    </div>
                  </div>
                </div>
                <div className="header2invp3">
                  <div>
                    <p className="fw-bold fs-6">
                      {headerData?.customerfirmname}
                    </p>
                    <p className="fsinvp3">{headerData?.customerstreet}</p>
                    <p className="fsinvp3">{headerData?.customerregion}</p>
                    <p className="fsinvp3">
                      {headerData?.customercity} {headerData?.customerpincode}
                    </p>
                    <p className="fsinvp3">
                      Mobile : {headerData?.customermobileno}
                    </p>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between winvp3">
                      <p className="fw-bold fsinvp3">
                        {headerData?.vat_cst_pan?.split("|")?.[0]}
                      </p>
                      {/* <p className='fw-bold'>{headerData?.vat_cst_pan?.split("|")?.[1]}</p> */}
                      {/* <p className='w-50 fw-bold fsinvp3'>GSTIN :</p><p className='w-50 fsinvp3'>{headerData?.vat_cst_pan?.split("-")[1]}</p> */}
                    </div>
                    <p className="fw-bold fsinvp3">
                      {headerData?.vat_cst_pan?.split("|")?.[1]}
                    </p>
                    <div className="d-flex justify-content-between winvp3">
                      <p className="w-50 fw-bold fsinvp3">
                        {headerData?.Cust_CST_STATE}
                      </p>
                      <p className="w-50 fsinvp3">
                        {headerData?.Cust_CST_STATE_No}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{
                    borderBottom: "2px solid #d8d7d7",
                    borderLeft: "2px solid #d8d7d7",
                  }}
                >
                  <div className="w-50 d-flex flex-column justify-content-between position-relative d-flex">
                    <div className="w-100">
                      <div className="discHeadinvp3">DESCRIPTION</div>
                      <div className="w-100">{descArr}</div>
                    </div>
                    <div className="empdivinvp3"></div>
                  </div>
                  {/* <div className="d-flex flex-column justify-content-between w-50 h-100">
                    <div className="descinvp3">
                      <div className="discHeadinvp3">DESCRIPTION</div>
                      <div className="discBodyinvp3">
                        <div className="d-flex flex-column justify-content-between h-100">
                          <p>{descArr}</p>
                        </div>
                      </div>
                    </div>
                    <div className="totspaceinvp3"></div>
                  </div> */}
                  <div className="tableinvp3">
                    <div className="theadinvp3">
                      {/* <p className='wp1invp3 fsinvp3' style={{ borderRight: "2px solid #d8d7d7" }}>DESCRIPTION</p> */}
                      <p
                        className="wp1invp3 fsinvp3"
                        style={{
                          justifyContent: "flex-start",
                          paddingLeft: "3px",
                        }}
                      >
                        DETAIL
                      </p>
                      <p className="wp3invp3 fsinvp3">WEIGHT</p>
                      <p className="wp3invp3 fsinvp3">RATE</p>
                      <p className="wp3invp3 fsinvp3">AMOUNT</p>
                    </div>
                    <div className="tablebodyinvp3">
                      {
                        // json1?.map((e, i) => {
                        groupedArr?.map((e, i) => {
                          return (
                            <div className="tbodyinvp3" key={i}>
                              <p className="wp1tbinvp3 fsinvp3">
                                {e?.MasterManagement_DiamondStoneTypeid === 4
                                  ? e?.ShapeName + " " + e?.QualityName
                                  : e?.MasterManagement_DiamondStoneTypeName}
                              </p>
                              <p className="wp3tbinvp3 fsinvp3">
                                {e?.Wt?.toFixed(3)}
                              </p>
                              <p className="wp3tbinvp3 fsinvp3">{e?.Rate}</p>
                              <p className="wp3tbinvp3 fsinvp3">
                                {e?.Amount?.toFixed(2)}
                              </p>
                            </div>
                          );
                        })
                      }
                      {LOM.map((e, i) => {
                        return (
                          <div className="tbodyinvp3" key={i}>
                            {/* <p className='wp1tbinvp3 brrightinvp3 fsinvp3'></p> */}
                            {e?.ShapeName === "MISC" && e?.Amount === 0 ? (
                              ""
                            ) : (
                              <p className="wp1tbinvp3 fsinvp3">
                                {e?.ShapeName}
                              </p>
                            )}
                            <p className="wp3tbinvp3 fsinvp3">
                              {e?.Wt?.toFixed(3)}
                            </p>
                            <p className="wp3tbinvp3 fsinvp3">{e?.Rate}</p>
                            {e?.ShapeName === "MISC" && e?.Amount === 0 ? (
                              ""
                            ) : (
                              <p className="wp3tbinvp3 fsinvp3">
                                {e?.Amount?.toFixed(2)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      <div className="tbodyinvp3 brtopinvp3">
                        {/* <p className='wp1tbinvp3 brrightinvp3'></p> */}
                        <p className="wp1tbinvp3 fw-bold fsinvp3 px-2">TOTAL</p>
                        <p className="wp3tbinvp3"></p>
                        <p className="wp3tbinvp3"></p>
                        <p className="wp3tbinvp3 fw-bold fsinvp3">
                          {mainTotal?.totAmount?.TotalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="summaryinvp3">
                  <div className="totalinvp3">
                    <div className="d-flex justify-content-between px-2">
                      <p className="w-50 text-start fsinvp3">Discount</p>
                      <p className="w-50 text-end fsinvp3">
                        {totDiscount?.toFixed(2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-2">
                      <p className="fw-bold fsinvp3">Total Amount</p>
                      <p className="w-50 text-end fsinvp3">
                        {mainTotal?.totAmount?.TotalAmount?.toFixed(2)}
                      </p>
                    </div>
                    {taxTotal?.length > 0 &&
                      taxTotal?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-2"
                            key={i}
                          >
                            <div className="fsinvp3">
                              {e?.name} {e?.per}
                            </div>
                            <div className="fsinvp3">{e?.amount}</div>
                          </div>
                        );
                      })}

                    <div className="d-flex justify-content-between px-2">
                      <p className="fsinvp3">
                        {headerData?.AddLess > 0 ? "Add" : "Less"}
                      </p>
                      <p className="w-50 text-end fsinvp3">
                        {headerData?.AddLess}
                      </p>
                    </div>
                    <div
                      className="d-flex justify-content-between px-2 mt-1"
                      style={{ borderTop: "5px solid #e8e8e8" }}
                    >
                      <p className="fw-bold fsinvp3">Grand Total</p>
                      <p className="fw-bold w-50 text-end fsinvp3">
                        {grandTotal}
                      </p>
                    </div>
                  </div>
                  <div className="wordsinvp3 fsinvp3 px-2 fw-bold">
                    {inWords}
                  </div>
                  <div className="wordsinvp3 fsinvp3">
                    <p className="fw-bold px-2">NOTE:</p>
                    <p className="fsinvp3">{headerData?.PrintRemark}</p>
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

export default InvoicePrint3;
