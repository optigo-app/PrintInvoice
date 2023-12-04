import React, { useEffect, useState } from "react";
import "../../assets/css/prints/invoiceprint3.css";
import { apiCall, isObjectEmpty, numberToWord, NumberWithCommas } from "../../GlobalFunctions";
import { taxGenrator } from "./../../GlobalFunctions";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";

const InvoicePrint3 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [json1, setJson1] = useState();
  // eslint-disable-next-line no-unused-vars
  const [json2, setJson2] = useState();
  // eslint-disable-next-line no-unused-vars
  const [resultArray, setResultArray] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [totDiscount, setTotDiscount] = useState(0);
  const [inWords, setInWords] = useState("");
  const [mainTotal, setMainTotal] = useState({});
  const [groupedArr, setGroupedArr] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [groupedArrAmountTotal, setGroupedArrAmountTotal] = useState(0);
  const [LOM, setLOM] = useState([]);
  const [descArr, setDescArr] = useState("");
  const [taxTotal, setTaxTotal] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);

  const organizeData = (json, json1, json2) => {
    let resultArr = [];
    // eslint-disable-next-line no-unused-vars
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

      // eslint-disable-next-line array-callback-return
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

    // eslint-disable-next-line array-callback-return
    json2.map((ele) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
        if (arr?.length === 0) {
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
    // eslint-disable-next-line array-callback-return
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
    // eslint-disable-next-line no-unused-vars
    let obj3 = {
      ShapeName: "MISC",
      QualityName: "",
      Amount: totmiscAmt,
    };
    let LOM = [];
    // LOM.push(obj3, obj2, obj1);
    LOM.push(obj2, obj1);
    setLOM(LOM);
    setGroupedArrAmountTotal(groupedAmtTotal);


    // arr.sort((a, b) => {
    //   if (a.MasterManagement_DiamondStoneTypeid !== b.MasterManagement_DiamondStoneTypeid) {
    //     return b.MasterManagement_DiamondStoneTypeid - a.MasterManagement_DiamondStoneTypeid;
    //   } else {
    //     return a.QualityName.localeCompare(b.QualityName);  // If names are the same, sort by age
    //   }
    // });

    arr.sort((a, b) => {
      if (a.MasterManagement_DiamondStoneTypeid === 4 && b.MasterManagement_DiamondStoneTypeid !== 4) {
        return -1; // a comes before b if a is 'Gold' and b is not
      } else if (b.MasterManagement_DiamondStoneTypeid === 4 && a.MasterManagement_DiamondStoneTypeid !== 4) {
        return 1; // b comes before a if b is 'Gold' and a is not
      } else {
        if (a.MasterManagement_DiamondStoneTypeid === 1 && b.MasterManagement_DiamondStoneTypeid !== 1) {
          return -1;
        } else if (b.MasterManagement_DiamondStoneTypeid === 1 && a.MasterManagement_DiamondStoneTypeid !== 1) {
          return 1;
        } else {
          return a.MasterManagement_DiamondStoneTypeName.localeCompare(b.MasterManagement_DiamondStoneTypeName); // Sort by name if metalType is not 'Gold'
        }
      }
    });

    setGroupedArr(arr);

    setMainTotal(mainTotal);


    let allTax = taxGenrator(json, aa);
    setTaxTotal(allTax);

    allTax?.forEach((e) => {
      aa += +e?.amount;
    });
    let ab = (+aa?.toFixed(2));
    let words = numberToWord(ab) + " Only";
    setInWords(words);
    setGrandTotal(aa);
    setTotDiscount(totdis);



    const groupedData = arr?.reduce((result, item) => {
      let groupName;

      switch (item.MasterManagement_DiamondStoneTypeid) {
        case 1:
          groupName = "DIAMOND";
          break;
        case 2:
          groupName = "COLORSTONE";
          break;
        case 3:
          groupName = "CZ STUDDED JEWELLERY";
          break;
        case 4:
          groupName = "GOLD";
          break;
        default:
          groupName = "OTHER";
      }

      // Initialize the group if it doesn't exist
      if (!result[groupName]) {
        result[groupName] = [];
      }

      // Add the item to the corresponding group
      result[groupName].push(item);

      return result;
    }, {});

    const groupNamesArray = Object?.keys(groupedData);
    const sentence = groupNamesArray?.join(", ");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="container max_width_container px-2 print_sec_sum4">
                <Button />
              </div>
              <div className="containerinvp3 pad_60_allPrint" id="divToPrint">
                <div className="headinvp3">
                  <div className="headerinvp3">
                    <div className="head1invp3">
                      <p className="fw-bold fsinvp3 w-50">BILL NO</p>
                      <p className="fsinvp3 w-50 text-end">{headerData?.InvoiceNo}</p>
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
                    <div className="winvp3 text-end">
                      <p className=" fsinvp3 text-end">
                        <span className="fw-bold">GStTIN:</span> {headerData?.vat_cst_pan?.split("|")?.[0]}
                      </p>
                    </div>
                    {/* <p className="fsinvp3 text-end">
                    <span className="fw-bold">PAN:</span> {headerData?.vat_cst_pan?.split("|")?.[1]}
                    </p> */}
                    <div className="text-end winvp3">
                      <p className="fsinvp3">
                        <span className="fw-bold">{headerData?.Cust_CST_STATE}</span> {headerData?.Cust_CST_STATE_No}
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
                    <div className="w-100 h-100 position-relative">
                      <div className="discHeadinvp3">DESCRIPTION</div>
                      <div className="w-100 descriptioninovicePrint3 px-2">{descArr}</div>
                    </div>
                    <div className="empdivinvp3"></div>
                  </div>
                  <div className="tableinvp3">
                    <div className="theadinvp3">
                      <p
                        className="wp1invp3 fsinvp3"
                        style={{
                          justifyContent: "flex-start",
                          paddingLeft: "3px",
                        }}
                      >
                        DETAIL
                      </p>
                      <p className="wp3invp3 fsinvp3 text-end">WEIGHT</p>
                      <p className="wp3invp3 fsinvp3 text-end">RATE</p>
                      <p className="wp3invp3 fsinvp3 text-end">AMOUNT</p>
                    </div>
                    <div className="tablebodyinvp3">
                      {
                        groupedArr?.map((e, i) => {
                          return (
                            <div className={`tbodyinvp3 pb-2 ${i === 0 && `pt-2`}`} key={i}>
                              <p className="wp1tbinvp3 fsinvp3">
                                {e?.MasterManagement_DiamondStoneTypeid === 4
                                  ? e?.ShapeName + " " + e?.QualityName
                                  : e?.MasterManagement_DiamondStoneTypeName}
                              </p>
                              <p className="wp3tbinvp3 fsinvp3 text-end">
                                {e?.Wt?.toFixed(3)}
                              </p>
                              <p className="wp3tbinvp3 fsinvp3 text-end">{NumberWithCommas(e?.Rate, 2)}</p>
                              <p className="wp3tbinvp3 fsinvp3 text-end">
                                {NumberWithCommas(e?.Amount, 2)}
                              </p>
                            </div>
                          );
                        })
                      }
                      {LOM?.map((e, i) => {
                        return (
                          <div className="tbodyinvp3 pb-2" key={i}>
                            {e?.ShapeName === "MISC" && e?.Amount === 0 ? (
                              ""
                            ) : (
                              <p className="wp1tbinvp3 fsinvp3">
                                {e?.ShapeName}
                              </p>
                            )}
                            <p className="wp3tbinvp3 fsinvp3 text-end">
                              {e?.Wt?.toFixed(3)}
                            </p>
                            <p className="wp3tbinvp3 fsinvp3 text-end">{e?.Rate}</p>
                            {e?.ShapeName === "MISC" && e?.Amount === 0 ? (
                              ""
                            ) : (
                              <p className="wp3tbinvp3 fsinvp3 text-end">
                                {NumberWithCommas(e?.Amount, 2)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      <div className="tbodyinvp3 brtopinvp3">
                        <p className="wp1tbinvp3 fw-bold fsinvp3 " style={{ width: "20%" }}>TOTAL</p>
                        <p className="wp3tbinvp3 fw-bold fsinvp3 text-end" style={{ width: "20%" }}>
                          {NumberWithCommas(mainTotal?.totAmount?.TotalAmount, 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="summaryinvp3">
                  <div className="totalinvp3">
                    {totDiscount !== 0 && <div className="d-flex justify-content-between px-1">
                      <p className="w-50 text-start fsinvp3">Discount</p>
                      <p className="w-50 text-end fsinvp3">
                        {NumberWithCommas(totDiscount, 2)}
                      </p>
                    </div>}
                    <div className="d-flex justify-content-between px-1">
                      <p className="fsinvp3">Total Amount</p>
                      <p className="w-50 text-end fsinvp3">
                        {NumberWithCommas(mainTotal?.totAmount?.TotalAmount, 2)}
                      </p>
                    </div>
                    {taxTotal?.length > 0 &&
                      taxTotal?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-1"
                            key={i}
                          >
                            <div className="fsinvp3">
                              {e?.name} {e?.per}
                            </div>
                            <div className="fsinvp3">{NumberWithCommas(e?.amount, 2)}</div>
                          </div>
                        );
                      })}

                    {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between px-1">
                      <p className="fsinvp3">
                        {headerData?.AddLess > 0 ? "Add" : "Less"}
                      </p>
                      <p className="w-50 text-end fsinvp3">
                        {headerData?.AddLess}
                      </p>
                    </div>}
                    <div
                      className="d-flex justify-content-between px-1 mt-1"
                      style={{ borderTop: "2.5px solid #e8e8e8" }}
                    >
                      <p className="fw-bold fsinvp3">Grand Total</p>
                      <p className="fw-bold w-50 text-end fsinvp3">
                        {NumberWithCommas(grandTotal, 2)}
                      </p>
                    </div>
                  </div>
                  <div className="wordsinvp3 fsinvp3 px-1 fw-bold">
                    Rs. {inWords}
                  </div>
                  <div className="wordsinvp3 fsinvp3">
                    <p className="fw-bold px-2">NOTE:</p>
                    <p
                      className="fsinvp3"
                      dangerouslySetInnerHTML={{
                        __html: headerData?.PrintRemark,
                      }}
                    ></p>
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
