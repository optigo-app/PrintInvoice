/* eslint-disable no-unused-vars */
// import axios from 'axios';
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/packinglist3.css";
import Loader from "../../components/Loader";
import {
  apiCall,
  handleImageError,
  isObjectEmpty,
  NumberWithCommas,
  otherAmountDetail,
} from "../../GlobalFunctions";
import { taxGenrator } from "./../../GlobalFunctions";

const PackingList3 = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState({});
  const [imgShow, setImgShow] = useState(true);
  const [dynamicList1, setDynamicList1] = useState([]);
  const [dynamicList2, setDynamicList2] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [mainTotal, setMainTotal] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [Totals, setTotals] = useState({});
  const [lossWt, setLossWt] = useState(0);
  const [otherAmounts, setOtherAmounts] = useState([]);
  const [totalUniCostAmt, setTotalUnitCostAmt] = useState(0);
  const [totalLbhOthAmt, setTotalLbhOthAmt] = useState(0);

  const [totalgrosswt, setTotalgrosswt] = useState(0);
  const [totalnetlosswt, setTotalnetlosswt] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [taxTotal, setTaxTotal] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);

  const totalObj = {
    totdiapcs: 0,
    totdiawt: 0,
    totdiaamt: 0,
    totcspcs: 0,
    totcswt: 0,
    totcsamt: 0,
    totmiscpcs: 0,
    totmiscwt: 0,
    totmiscamt: 0,
    totmtpcs: 0,
    totmtwt: 0,
    totmtamt: 0,
    totstpcs: 0,
    totstwt: 0,
    totstamt: 0,
    totalAmt: 0,
    totmakingAmt: 0,
    totOthAmt: 0,
    totDiscount: 0,
    totfinewt: 0,
    totgrosswt: 0,
    totnetwt: 0,
    totpurnetwt:0
  };
  let diamondList = [];
  let colorStoneList = [];
  let miscList = [];
  let metalList = [];
  let findingList = [];
  let stoneMiscList = [];

  async function loadData(data) {
    try {
      let address = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
      data.BillPrint_Json[0].address = address;
      setHeaderData(data?.BillPrint_Json[0]);
      setDynamicList1(data?.BillPrint_Json1);
      setDynamicList2(data?.BillPrint_Json2);
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
  // eslint-disable-next-line array-callback-return
  dynamicList2?.length > 0 &&
    // eslint-disable-next-line array-callback-return
    dynamicList2.map((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        totalObj.totdiapcs = totalObj.totdiapcs + +e?.Pcs;
        totalObj.totdiawt = totalObj.totdiawt + +e?.Wt;
        totalObj.totdiaamt = totalObj.totdiaamt + +e?.Amount;
        diamondList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 2) {
        totalObj.totcspcs = totalObj.totcspcs + e?.Pcs;
        totalObj.totcswt = totalObj.totcswt + e?.Wt;
        totalObj.totcsamt = totalObj.totcsamt + e?.Amount;
        colorStoneList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 3) {
        if (e?.ShapeName === "Certification_IGI") return "";
        else {
          totalObj.totmiscpcs = totalObj.totmiscpcs + e?.Pcs;
          totalObj.totmiscwt = totalObj.totmiscwt + e?.Wt;
          totalObj.totmiscamt = totalObj.totmiscamt + e?.Amount;
          miscList.push(e);
        }
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        totalObj.totmtpcs = totalObj.totmtpcs + e?.Pcs;
        totalObj.totmtwt = totalObj.totmtwt + e?.Wt;
        totalObj.totmtamt = totalObj.totmtamt + e?.Amount;
        metalList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        findingList.push(e);
      }
      if (
        e?.MasterManagement_DiamondStoneTypeid === 2 ||
        e?.MasterManagement_DiamondStoneTypeid === 3
      ) {
        if (
          e?.MasterManagement_DiamondStoneTypeid === 3 &&
          e?.ShapeName === "Certification_IGI"
        )
          return "";
        else {
          totalObj.totstpcs = totalObj.totstpcs + e?.Pcs;
          totalObj.totstwt = totalObj.totstwt + e?.Wt;
          totalObj.totstamt = totalObj.totstamt + e?.Amount;
        }
      }
    });

  // eslint-disable-next-line array-callback-return
  dynamicList1?.map((e) => {
    totalObj.totalAmt = totalObj.totalAmt + e?.TotalAmount;
    totalObj.totmakingAmt = totalObj.totmakingAmt + e?.MakingAmount;
    totalObj.totDiscount = totalObj.totDiscount + e?.DiscountAmt;
    totalObj.totgrosswt = totalObj.totgrosswt + e?.grosswt;
    totalObj.totnetwt = totalObj.totnetwt + e?.NetWt;
    totalObj.totOthAmt = totalObj.totOthAmt + e?.OtherCharges;
    totalObj.totpurnetwt = totalObj.totpurnetwt + e?.PureNetWt;
  });

  // eslint-disable-next-line array-callback-return
  dynamicList2?.map((e) => {
    totalObj.totfinewt = totalObj.totfinewt + e?.FineWt;
  });

  totalObj.totDiscount = Number(totalObj.totDiscount?.toFixed(3));

  stoneMiscList = colorStoneList.concat(miscList);

  const d = dynamicList2?.reduce((grouped, e) => {
    if (e.MasterManagement_DiamondStoneTypeid === 1 && e.ShapeName === "RND") {
      const key = `${e.ShapeName} ${e.QualityName} ${e.Colorname}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(e);
    }
    return grouped;
  }, {});

  const e = dynamicList2?.reduce((grouped, e) => {
    if (e.MasterManagement_DiamondStoneTypeid === 1 && e.ShapeName !== "RND") {
      const key = `${e.ShapeName} ${e.QualityName} ${e.Colorname}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(e);
    }
    return grouped;
  }, {});

  const calculatedData = [];
  const calData = [];

  for (const key in d) {
    if (d.hasOwnProperty(key)) {
      const group = d[key];

      const totalPcs = group.reduce((sum, item) => sum + item.Pcs, 0);
      const totalWt = group.reduce((sum, item) => sum + item.Wt, 0);

      calculatedData.push({
        ShapeName: key,
        totalPcs,
        totalWt,
      });
    }
  }
  for (const key in e) {
    if (e.hasOwnProperty(key)) {
      const group = e[key];

      const totalPcs = group.reduce((sum, item) => sum + item.Pcs, 0);
      const totalWt = group.reduce((sum, item) => sum + item.Wt, 0);

      calData.push({
        ShapeName: key,
        totalPcs,
        totalWt,
      });
    }
  }
  let totalPcs1 = 0;
  let totalWt1 = 0;

  for (const obj of calData) {
    totalPcs1 += obj.totalPcs;
    totalWt1 += obj.totalWt;
  }
  let other = {
    ShapeName: "OTHER",
    totalPcs: totalPcs1,
    totalWt: totalWt1,
  };

  calculatedData.push(other);
  const handleCheckedChange = (e) => {
    let isCHecked = e.target.checked;
    isCHecked ? setImgShow(true) : setImgShow(false);
  };

  const handlePrint = (e) => {
    window.print();
  };
  const separatedOthAmt = (obj) => {
    const parsedAmounts = obj?.OtherAmtDetail?.split("#@#")?.map((item) => {
      let [name, value] = item?.split("#-#");

      return { name, value: parseFloat(value) || 0 };
    });
    setOtherAmounts(parsedAmounts);
    return parsedAmounts;
  };

  const organizeData = (arr, arr1, arr2) => {
    let totgrosswt = 0;
    let totnetlosswt = 0;
    let totallbrAmt = 0;
    let totalOtherAmt = 0;
    let total_of_labour_Other = 0;
    let lswt = 0;
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
    };
    let resultArr = [];
    let totalUnitPrice = 0;
    let totalAmt = 0;

    // eslint-disable-next-line array-callback-return
    arr1?.map((e, i) => {
      let OtherAmountDetail = otherAmountDetail(e?.OtherAmtDetail);
      let diamonds = [];
      let colorstone = [];
      let metal = [];
      let misc = [];
      let finding = [];
      let stoneNMisc = [];

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
        stone_misc: {
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
        totpurenetwt: 0
      };

      totgrosswt += e?.grosswt;

      totnetlosswt = totnetlosswt + +e?.NetWt + +e?.LossWt;

      totals.labour.labourAmount = totals.labour.labourAmount + e?.MakingAmount;
      totals.OtherCh.OtherAmount =
        totals.OtherCh.OtherAmount + e?.OtherCharges + e?.MiscAmount;
      totalAmt += e?.TotalAmount;
      totalUnitPrice += e?.UnitCost;
      totallbrAmt += e?.MakingAmount;
      totalOtherAmt += e?.OtherCharges + e?.MiscAmount;
      total_of_labour_Other += e?.MakingAmount + e?.OtherCharges;
      totals.totpurenetwt  += e?.PureNetWt;

      // eslint-disable-next-line array-callback-return
      arr2.map((ele, ind) => {
        if (e?.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamonds.push(ele);
            totals.diamonds.Wt += ele?.Wt;
            totals.diamonds.Pcs += ele?.Pcs;
            totals.diamonds.Rate += ele?.Rate;
            totals.diamonds.Amount += ele?.Amount;
            mainTotal.diamonds.Wt += ele?.Wt;
            mainTotal.diamonds.Pcs += ele?.Pcs;
            mainTotal.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstone.push(ele);
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Rate += ele?.Rate;
            totals.colorstone.Amount += ele?.Amount;
            mainTotal.colorstone.Wt += ele?.Wt;
            mainTotal.colorstone.Pcs += ele?.Pcs;
            mainTotal.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misc.push(ele);
            totals.misc.Wt += ele?.Wt;
            totals.misc.Pcs += ele?.Pcs;
            totals.misc.Rate += ele?.Rate;
            totals.misc.Amount += ele?.Amount;
            mainTotal.misc.Wt += ele?.Wt;
            mainTotal.misc.Pcs += ele?.Pcs;
            mainTotal.misc.Rate += ele?.Rate;
            mainTotal.misc.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metal.push(ele);
            totals.metal.Wt += ele?.Wt;
            totals.metal.Pcs += ele?.Pcs;
            totals.metal.Rate += ele?.Rate;
            totals.metal.Amount += ele?.Amount;
            mainTotal.metal.Wt += ele?.Wt;
            mainTotal.metal.Pcs += ele?.Pcs;
            mainTotal.metal.Rate += ele?.Rate;
            mainTotal.metal.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            finding.push(ele);
            totals.finding.Wt += ele?.Wt;
            totals.finding.Pcs += ele?.Pcs;
            totals.finding.Rate += ele?.Rate;
            totals.finding.Amount += ele?.Amount;
            mainTotal.finding.Wt += ele?.Wt;
            mainTotal.finding.Pcs += ele?.Pcs;
            mainTotal.finding.Rate += ele?.Rate;
            mainTotal.finding.Amount += ele?.Amount;
          }
          if (
            ele?.MasterManagement_DiamondStoneTypeid === 3 ||
            ele?.MasterManagement_DiamondStoneTypeid === 2
          ) {
            stoneNMisc.push(ele);

            if (ele?.ShapeName === "Certification_IGI") return "";
            else {
              totals.stone_misc.Wt += ele?.Wt;
              totals.stone_misc.Pcs += ele?.Pcs;
              totals.stone_misc.Rate += ele?.Rate;
              totals.stone_misc.Amount += ele?.Amount;
            }
          }
        }
      });

      lswt += e?.LossWt;

      setLossWt(lswt);

      setTotalUnitCostAmt(totalUnitPrice);

      let obj = { ...e };
      let separte = separatedOthAmt(obj);
      obj.OtherAmountDetail = OtherAmountDetail;
      obj.OtherAmountInfo = separte;
      obj.diamonds = diamonds;
      obj.colorstone = colorstone;
      obj.stone_misc = stoneNMisc;
      obj.metal = metal;
      obj.misc = misc;
      obj.finding = finding;
      obj.totals = totals;
      let sumoflbr = e?.MakingAmount;
      obj.LabourAmountSum = sumoflbr;

      setTotalLbhOthAmt(total_of_labour_Other);
      setTotalnetlosswt(totnetlosswt);
      setTotalgrosswt(totgrosswt);
      resultArr.push(obj);

      setTotals(totals);
    });

    totalAmt = totalAmt + arr?.AddLess;
    let allTax = taxGenrator(arr, totalAmt);

    allTax?.length > 0 &&
      // eslint-disable-next-line array-callback-return
      allTax?.map((e) => {
        totalAmt += +e?.amount;
      });

    setFinalAmount(totalAmt);
    setTaxTotal(allTax);
    setResultArray(resultArr);
    setMainTotal(mainTotal);
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="pad_60_allPrint">
                <div className="printpcl3">
                  <div className="chboxlabelpcl3">
                    <input
                      type="checkbox"
                      id="chbox"
                      checked={imgShow}
                      onChange={(e) => handleCheckedChange(e)}
                    />{" "}
                    <label htmlFor="chbox">With Image</label>
                  </div>
                  <div>
                    <button
                      className="btn_white blue"
                      onClick={(e) => handlePrint(e)}
                    >
                      Print
                    </button>
                  </div>
                </div>
                <div className="containerPCL3">
                  <div className="headlinepcl3">
                    <b style={{ fontSize: "15px" }}>
                      {headerData?.PrintHeadLabel}
                    </b>
                  </div>
                  <div className="headpcl3">
                    <div className="headpcl3Content">
                      <div className="fslhpcl3">
                        <h5>
                          <b style={{ fontSize: "13px" }}>
                            {headerData?.CompanyFullName}
                          </b>
                        </h5>
                      </div>
                      <div className="fslhpcl3">
                        {headerData?.CompanyAddress}
                      </div>
                      <div className="fslhpcl3">
                        {headerData?.CompanyAddress2}
                      </div>
                      <div className="fslhpcl3">
                        {headerData?.CompanyCity}-{headerData?.CompanyPinCode},{" "}
                        {headerData?.CompanyState}({headerData?.CompanyCountry})
                      </div>
                      <div className="fslhpcl3">
                        Tell No: {headerData?.CompanyTellNo}
                      </div>
                      <div className="fslhpcl3">
                        {headerData?.CompanyEmail} |{" "}
                        {headerData?.CompanyWebsite}
                      </div>
                      <div className="fslhpcl3">
                        {headerData?.Company_VAT_GST_No} |{" "}
                        {headerData?.Cust_CST_STATE}-{headerData?.vat_cst_pan}
                      </div>
                    </div>
                    <div className="headpcl3Img">
                      <img
                        src={headerData?.PrintLogo}
                        alt="#"
                        id="pcl3Img"
                      />
                    </div>
                  </div>
                  <div className="dynamicHeadpcl3main">
                    <div className="dynamicHeadpcl31">
                      <div className="fslhpcl3">{headerData?.lblBillTo}</div>
                      <div className="fslhpcl3">
                        <b className="pcl313">{headerData?.customerfirmname}</b>
                      </div>
                      {
                        headerData?.customerAddress2?.length > 0 ? <div className="fslhpcl3">
                        {headerData?.customerAddress2}
                      </div> : ''
                      }
                      {
                        headerData?.customerAddress1?.length > 0 ? <div className="fslhpcl3">
                        {headerData?.customerAddress1}
                      </div> : ''
                      }
                      {headerData?.customerAddress3?.length > 0 ?  <div className="fslhpcl3">
                        {headerData?.customerAddress3}
                      </div> : ''}
                      
                      {
                        (headerData?.customercity?.length > 0 || headerData?.customerpincode?.length > 0) ? <div className="fslhpcl3">
                        {headerData?.customercity}
                        {headerData?.customerpincode}
                      </div> : ''
                      }
                      {headerData?.customeremail1?.length > 0 ?  <div className="fslhpcl3">
                        {headerData?.customeremail1}
                      </div> : ''}
                      
                      {headerData?.vat_cst_pan?.length > 0 ? <div className="fslhpcl3">{headerData?.vat_cst_pan}</div> : ''} 
                      { (headerData?.Cust_CST_STATE?.length > 0 || headerData?.Cust_CST_STATE_No?.length > 0) ? <div className="fslhpcl3">
                        {headerData?.Cust_CST_STATE}-
                        {headerData?.Cust_CST_STATE_No}
                      </div> : '' } 
                    </div>
                    <div className="dynamicHeadpcl32">
                      <div className="fslhpcl3">Ship to</div>
                      {
                          headerData?.customerfirmname?.length > 0 ? <div className="fslhpcl3">
                          <b className="pcl313">{headerData?.customerfirmname}</b>
                        </div> : ''
                      }
                      <div>
                        {
                          headerData?.address?.length > 0 && 
                          headerData?.address?.map((e, i) => {
                            return(
                              <div className="fslhpcl3" key={i}>
                                <div>{e}</div>
                              </div>
                            )
                          })
                        }
                      </div>

                      
                      
                    </div>
                    <div className="dynamicHeadpcl33">
                      <div className="w-100 d-flex justify-content-between align-items-center ps-1 pe-1">
                        <div className="fw-bold">
                          BILL NO
                        </div>
                        <div className="">
                          {headerData?.InvoiceNo}
                        </div>
                      </div>
                      <div className="w-100 d-flex justify-content-between align-items-center ps-1 pe-1">
                        <div className="fw-bold">
                          DATE
                        </div>
                        <div className="billno3pdlpcl3 pcl313">
                          {headerData?.EntryDate}
                        </div>
                      </div>
                      <div className="w-100 d-flex justify-content-between align-items-center ps-1 pe-1">
                        <div className="fw-bold">
                          HSN
                        </div>
                        <div className="billno3pdlpcl3 pcl313">
                          {headerData?.HSN_No}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pcl3Table">
                    <div className="pcl3tableHead">
                      <div className="th1pcl3">
                        <b className="fsdpcl3 fsdpcl3">Sr</b>
                      </div>
                      <div className="th2pcl3">
                        <b className="fsdpcl3 fsdpcl3">Design</b>
                      </div>
                      <div className="th3pcl3">
                        <div className="th3flexpcl3">
                          <div className="th3flex1pcl3">
                            <b className="fsdpcl3 fsdpcl3">Diamond</b>
                          </div>
                          <div className="th3flex2pcl3">
                            <div className="th3Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Code</b>
                            </div>
                            <div className="th3Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Size</b>
                            </div>
                            <div className="th3Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Pcs</b>
                            </div>
                            <div className="th3Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Wt</b>
                            </div>
                            <div className="th3Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Rate</b>
                            </div>
                            <div className="th3Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Amount</b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="th4pcl3">
                        <div className="th4flexpcl3">
                          <div className="th4flex1pcl3">
                            <b className="fsdpcl3 fsdpcl3">Metal</b>
                          </div>
                          <div className="th4flex2pcl3">
                            <div className="th4Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Quality</b>
                            </div>
                            <div className="th4Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">GWt</b>
                            </div>
                            <div className="th4Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">N+L</b>
                            </div>
                            <div className="th4Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Rate</b>
                            </div>
                            <div className="th4Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Amount</b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="th5pcl3">
                        <div className="th5flexpcl3">
                          <div className="th5flex1pcl3">
                            <b className="fsdpcl3 fsdpcl3">Stone & Misc</b>
                          </div>
                          <div className="th5flex2pcl3">
                            <div className="th5Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Code</b>
                            </div>
                            <div className="th5Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Size</b>
                            </div>
                            <div className="th5Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Pcs</b>
                            </div>
                            <div className="th5Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Wt</b>
                            </div>
                            <div className="th5Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Rate</b>
                            </div>
                            <div className="th5Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Amount</b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="th6pcl3">
                        <div className="th6flexpcl3">
                          <div
                            className="th6flex1pcl3"
                            style={{ height: "25px" }}
                          >
                            <b className="fsdpcl3">Labour & Other Charges</b>
                          </div>
                          <div className="th6flex2pcl3">
                            <div className="th6Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Charges</b>
                            </div>
                            <div className="th6Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Rate</b>
                            </div>
                            <div className="th6Wpcl3">
                              <b className="headbodypcl3 fsdpcl3">Amount</b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="th7pcl3">
                        <b className="totamtpcl3 fsdpcl3">TOTAL AMOUNT</b>
                      </div>
                    </div>

                    <div>
                      {resultArray?.length > 0 &&
                        resultArray?.map((e, i) => {
                          let totmakAmt = 0;

                          totmakAmt += e?.OtherCharges + e?.MakingAmount;
                          return (
                            <div className="pcl3TableCopy no_break" key={i}>
                              <div className="tableBodypcl3">
                                <div className="thDpcl3">
                                  <b className="fsdpcl3">{e?.SrNo}</b>
                                </div>
                              </div>

                              <div className="tableBodypcl3_1">
                                <div className="th2Dpcl3">
                                  <div className="th2DJobpcl3">
                                    <div className="fsdpcl3">{e?.designno}</div>
                                    <div>
                                      <div className="fsdpcl3">
                                        {e?.SrJobno}
                                      </div>
                                      <div className="fsdpcl3">
                                        {e?.MetalColor}
                                      </div>
                                    </div>
                                  </div>
                                  {imgShow ? (
                                    <div className="imgpcl3">
                                      <img
                                      src={e?.DesignImage}
                                      onError={(e) => handleImageError(e)}
                                        id="Imgpcl3"
                                        alt="#"
                                      />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div>
                                    <div className="fsdpcl3">
                                      Certificate# :
                                    </div>
                                    <div>
                                      <b className="fsdpcl3">
                                        {e?.CertificateNo}
                                      </b>
                                    </div>
                                  </div>
                                  <div className="th2DEpcl3">
                                    <div className="fsdpcl3">HUID :</div>
                                    <div>
                                      <b className="fsdpcl3">{e?.HUID}</b>
                                    </div>
                                  </div>
                                  <div className="th2DEpcl3">
                                    <div>
                                      <b className="fsdpcl3">PO : </b>
                                    </div>
                                    <div>
                                      <b className="fsdpcl3">{e?.PO}</b>
                                    </div>
                                  </div>
                                  <div className="fsdpcl3">{e?.lineid}</div>
                                  <div className="th2DEpcl3">
                                    <div className="fsdpcl3">Tunch : </div>
                                    <div className="fsdpcl3">
                                      {" "}
                                      {e?.Tunch}
                                    </div>{" "}
                                  </div>
                                  <div className="fsdpcl3">
                                    <b className="fsdpcl3">
                                      {e?.grosswt?.toFixed(3)} gm
                                    </b>{" "}
                                    Gross
                                  </div>
                                  <div className="th2DEpcl3">
                                    <div className="fsdpcl3">Size : </div>
                                    <div className="fsdpcl3">{e?.Size}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Diamond */}
                              <div className="diamondPcl3 positionpcl3 pd5pcl3">
                                <div style={{width:"100%"}}>
                                  {
                                    //diamond

                                    e?.diamonds?.length > 0 &&
                                      e?.diamonds?.map((ele, index) => {
                                        return (
                                          <div
                                            className="diamondValuepcl3"
                                            key={index}
                                          >
                                            <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                              {ele?.ShapeName}
                                            </div>
                                            <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                              {ele?.SizeName}
                                            </div>
                                            <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                              {ele?.Pcs}
                                            </div>
                                            <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                              {ele?.Wt}
                                            </div>
                                            <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                              {NumberWithCommas(ele?.Rate, 2)}
                                            </div>
                                            <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                              <b className="fsdpcl3">
                                                {NumberWithCommas(
                                                  ele?.Amount,
                                                  2
                                                )}
                                              </b>
                                            </div>
                                          </div>
                                        );
                                        // }
                                      })
                                  }
                                </div>
                                <div
                                  className="diamondValuepcl3 positionpcl3D"
                                  style={{
                                    width: "100%",
                                    height: "21px",
                                    border: "1px solid #989898",
                                    backgroundColor: "#eeeded",
                                    borderRight: "0px",
                                    borderLeft: "0px",
                                    borderBottom: "0px",
                                  }}
                                >
                                  <div className="th3Wpcl3 brRightDpcl3"></div>
                                  <div className="th3Wpcl3 brRightDpcl3"></div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {e?.totals?.diamonds?.Pcs}
                                    </b>
                                  </div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {e?.totals?.diamonds?.Wt?.toFixed(3)}
                                    </b>
                                  </div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3"></b>
                                  </div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3 ">
                                      {NumberWithCommas(
                                        e?.totals?.diamonds?.Amount,
                                        2
                                      )}
                                    </b>
                                  </div>
                                </div>
                              </div>
                              {/* Metal */}
                              <div className="metalPcl3 positionpcl3">
                                <div className="w-100 pd5pcl3">
                                  {
                                    //metal

                                    e?.metal?.length > 0 &&
                                      e?.metal?.map((ele, index) => {
                                        return (
                                          <div
                                            className="MetalPcl3"
                                            key={index}
                                          >
                                            <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                              {ele?.ShapeName}
                                            </div>
                                            <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                              {e?.grosswt?.toFixed(3)}
                                            </div>
                                            <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                              {e?.NetWt?.toFixed(3)}
                                            </div>
                                            <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                              {NumberWithCommas(ele?.Rate, 2)}
                                            </div>
                                            <div className="th4Wpcl3 brRightDpcl3">
                                              <b style={{ fontSize: "9px" }}>
                                                {NumberWithCommas(
                                                  ele?.Amount,
                                                  2
                                                )}
                                              </b>
                                            </div>
                                          </div>
                                        );
                                        // }
                                      })
                                  }
                                  {e?.LossWt === 0 ? (
                                    ""
                                  ) : (
                                    <div className="MetalPcl3">
                                      <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                        Loss
                                      </div>
                                      <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                        {e?.LossPer?.toFixed(3)} %
                                      </div>
                                      <div className="th4Wpcl3 brRightDpcl3 fsdpcl3">
                                        {e?.LossWt?.toFixed(3)}
                                      </div>
                                      <div className="th4Wpcl3 brRightDpcl3 fsdpcl3"></div>
                                      <div className="th4Wpcl3 brRightDpcl3">
                                        <b style={{ fontSize: "10px" }}>
                                          {NumberWithCommas(e?.LossAmt, 2)}
                                        </b>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="MetalPcl3 positionpcl3D"
                                  style={{
                                    width: "100%",
                                    border: "1px solid #989898",
                                    backgroundColor: "#e8e8e8",
                                    borderBottom: "0px",
                                    borderLeft: "0px",
                                    borderRight: "0px",
                                  }}
                                >
                                  <div className="th4Wpcl3 brRightDpcl3"></div>

                                  <div className="th4Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {e?.grosswt?.toFixed(3)}
                                    </b>
                                  </div>
                                  <div className="th4Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {e?.totals?.metal?.Wt?.toFixed(3)}
                                    </b>
                                  </div>
                                  <div className="th4Wpcl3 brRightDpcl3"></div>
                                  <div className="th4Wpcl3 brRightDpcl3">
                                    <b style={{ fontSize: "9px" }}>
                                      {NumberWithCommas(
                                        e?.totals?.metal?.Amount,
                                        2
                                      )}
                                    </b>
                                  </div>
                                </div>
                              </div>
                              {/* Stone and Misc */}
                              <div className="diamondPcl3 positionpcl3">
                                <div className="w-100 pd5pcl3">
                                  {
                                    //stone&misc
                                    e?.stone_misc?.length > 0 &&
                                      e?.stone_misc?.map((ele, index) => {
                                        
                                        return (
                                          <div key={index}>
                                            {ele?.ShapeName ===
                                            "Certification_IGI" ? (
                                              ""
                                            ) : (
                                              <div
                                                className="diamondValuepcl3"
                                                key={index}
                                              >
                                                <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                                  {ele?.ShapeName}{" "}
                                                </div>
                                                <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                                  {ele?.SizeName}
                                                </div>
                                                <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                                  {ele?.Pcs}
                                                </div>
                                                <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                                  {ele?.Wt?.toFixed(3)}
                                                </div>
                                                <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                                  {NumberWithCommas(
                                                    ele?.Rate,
                                                    2
                                                  )}
                                                </div>
                                                <div className="th3Wpcl3 brRightDpcl3 fsdpcl3">
                                                  <b
                                                    style={{ fontSize: "10px" }}
                                                  >
                                                    {NumberWithCommas(
                                                      ele?.Amount,
                                                      2
                                                    )}
                                                  </b>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })
                                  }
                                </div>
                                <div
                                  className="diamondValuepcl3 positionpcl3D"
                                  style={{
                                    width: "100%",
                                    height: "21px",
                                    border: "1px solid #989898",
                                    backgroundColor: "#eeeded",
                                    borderBottom: "0px",
                                    borderRight: "0px",
                                    borderLeft: "0px",
                                  }}
                                >
                                  <div className="th3Wpcl3 brRightDpcl3"></div>
                                  <div className="th3Wpcl3 brRightDpcl3"></div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {e?.totals?.stone_misc?.Pcs}
                                    </b>
                                  </div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {e?.totals?.stone_misc?.Wt?.toFixed(3)}
                                    </b>
                                  </div>
                                  <div className="th3Wpcl3 brRightDpcl3"></div>
                                  <div className="th3Wpcl3 brRightDpcl3">
                                    <b className="fsdpcl3">
                                      {/* {e?.totals?.stone_misc?.Amount?.toFixed(
                                        2
                                      )} */}
                                      {NumberWithCommas(
                                        e?.totals?.stone_misc?.Amount,
                                        2
                                      )}
                                    </b>
                                  </div>
                                </div>
                              </div>
                              <div className=" positionpcl3" style={{width:"13%", borderRight:"1px solid #989898"}}>
                                {
                                  (e?.MakingAmount === 0 && e?.MaKingCharge_Unit === 0) ? <div className="w-100 d-flex justify-content-between align-items-center fsdpcl3">
                                  <div className="d-flex justify-content-center align-items-center fsdpcl3" style={{width:"33.33%"}}></div>
                                  <div className="d-flex justify-content-center align-items-center fsdpcl3" style={{width:"33.33%"}}></div>
                                  <div className="d-flex justify-content-center align-items-center fsdpcl3" style={{width:"33.33%"}}></div>
                              </div>  : 
                                        <div className="w-100 d-flex justify-content-between align-items-center fsdpcl3">
                                            <div className="d-flex justify-content-start align-items-center fsdpcl3" style={{width:"33.33%", paddingLeft:"2px"}}>Labour</div>
                                            <div className="d-flex justify-content-center align-items-center fsdpcl3" style={{width:"33.33%"}}>{e?.MaKingCharge_Unit}</div>
                                            <div className="d-flex justify-content-center align-items-center fsdpcl3" style={{width:"33.33%"}}>{e?.MakingAmount}</div>
                                        </div>
                                }
                                {
                                  e?.OtherAmountDetail?.map((e, i) => {
                                    return(
                                      <div className="d-flex justify-content-between align-items-center w-100" key={i} style={{paddingLeft:"2px"}}>
                                        <div className="d-flex justify-content-start align-items-center fsdpcl3 w-75" >{e?.label}</div>
                                        <div className="d-flex justify-content-start align-items-center fsdpcl3 w-25" >{e?.value}</div>
                                      </div>
                                    )
                                  })
                                }
                                {
                                  e?.totmakAmt === 0 ? '' : <div
                                  className="th6flex2pcl3 positionpcl3D"
                                  style={{
                                    backgroundColor: "#eeeded",
                                    border: "1px solid #989898",
                                    
                                    height: "21px",
                                    borderBottom: "0px",
                                    borderRight: "0px",
                                    borderLeft: "0px",
                                  }}
                                >
                                  <div className="th6Wpcl3 brRightDpcl3"></div>
                                  <div className="th6Wpcl3 brRightDpcl3"></div>
                                  <div className="th6Wpcl3 brRightDpcl3">
                                    {totmakAmt === 0 ? (
                                      <b className="fsdpcl3">0.000</b>
                                    ) : (
                                      <b className="fsdpcl3">
                                        {NumberWithCommas(totmakAmt, 2)}
                                      </b>
                                    )}
                                  </div>
                                </div>
                                }
                                
                              </div>
                              <div className="pd5pcl3" style={{width:"7%"}}>
                                <div className="totalAndDiscountpcl3" >
                                  <div className="th7pcl3ss">
                                    <b style={{ fontSize: "10px" }}>
                                      {NumberWithCommas(e?.UnitCost, 2)}
                                    </b>
                                  </div>
                                  <div
                                    className="th7pcl3Dis"
                                    style={{
                                      backgroundColor: "#eeeded",
                                      border: "1px solid #989898",
                                      width: "100%",
                                      justifyContent: "flex-end",
                                      paddingRight: "2px",
                                      height: "21px",
                                      borderBottom: "0px",
                                      borderRight: "0px",
                                      borderLeft: "0px",
                                    }}
                                  >
                                    <b className="fsdpcl3">
                                      {NumberWithCommas(e?.UnitCost, 2)}
                                    </b>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      <div className="pcl3TableCopyD no_break">
                        <div
                          className="tableBodypcl3"
                          style={{ backgroundColor: "#eeeded", width:"2%" }}
                        >
                          <div className="thDEpcl3">
                            <b></b>
                          </div>
                        </div>
                        <div style={{width:"12%"}}>
                        <div
                          className="tableBodypcl3 w-100"
                          style={{
                            backgroundColor: "#eeeded",
                            borderBottom: "0px",
                            borderRight: "0px",
                            height: "22px",
                          }}
                        >
                          <div className="th2Dpcl3 w-100" >
                            <div>
                              <b className="fsdpcl3 w-100">TOTAL</b>
                            </div>
                          </div>
                        </div>
                          </div>
                          <div style={{width:"22%"}}>
                          <div className="diamondPcl3 positionpcl3 w-100">
                          <div
                            className="diamondValuepcl3 positionpcl3D w-100"
                            style={{
                              backgroundColor: "#eeeded",
                              border: "1px solid #989898",
                              height: "21px",
                              borderBottom: "0px",
                              borderTop: "0px",
                              borderRight: "0px",
                            }}
                          >
                            <div className="th3Wpcl3 brRightDpcl3"></div>
                            <div className="th3Wpcl3 brRightDpcl3"></div>
                            <div className="th3Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">{totalObj.totdiapcs}</b>
                            </div>
                            <div className="th3Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {totalObj.totdiawt.toFixed(3)}
                              </b>
                            </div>
                            <div className="th3Wpcl3 brRightDpcl3"></div>
                            <div className="th3Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {NumberWithCommas(totalObj.totdiaamt, 2)}
                              </b>
                            </div>
                          </div>
                          </div>
                          </div>

                            <div style={{width:"22%"}}>
                          <div className="metalPcl3 positionpcl3 w-100">
                          <div
                            className="MetalPcl3 positionpcl3D w-100"
                            style={{
                              backgroundColor: "#e8e8e8",
                              height: "21px",
                              lineHeight: "10px",
                              border: "1px solid #989898",
                              borderBottom: "0px",
                              borderTop: "0px",
                              borderLeft: "0px",
                              borderRight: "0px",
                            }}
                          >
                            <div className="th4Wpcl3 brRightDpcl3"></div>
                            <div className="th4Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {totalgrosswt?.toFixed(3)}
                              </b>
                            </div>
                            <div className="th4Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {totalnetlosswt?.toFixed(3)}
                              </b>
                            </div>
                            <div className="th4Wpcl3 brRightDpcl3"></div>
                            <div className="th4Wpcl3 brRightDpcl3">
                              <b style={{ fontSize: "9px" }}>
                                {NumberWithCommas(totalObj.totmtamt, 2)}
                              </b>
                            </div>
                          </div>
                          </div>
                          </div>

                            <div style={{width:"22%"}}>
                          <div className="diamondPcl3 positionpcl3 w-100">
                          <div
                            className="diamondValuepcl3 positionpcl3D w-100"
                            style={{
                              backgroundColor: "#e8e8e8",
                            }}
                          >
                            <div className="th3Wpcl3 brRightDpcl3"></div>
                            <div className="th3Wpcl3 brRightDpcl3"></div>
                            <div className="th3Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">{totalObj.totstpcs}</b>
                            </div>
                            <div className="th3Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {totalObj.totstwt.toFixed(3)}
                              </b>
                            </div>
                            <div className="th3Wpcl3 brRightDpcl3"></div>
                            <div className="th3Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {NumberWithCommas(totalObj.totstamt, 2)}
                              </b>
                            </div>
                          </div>
                          </div>
                          </div>

                        <div style={{width:"13%"}}>
                          <div className="labourPcl3 w-100">
                          <div
                            className="th6flex2pcl3 w-100 "
                            style={{
                              backgroundColor: "#e8e8e8",
                              height: "22px",
                            }}
                          >
                            <div className="th6Wpcl3 brRightDpcl3"></div>
                            <div className="th6Wpcl3 brRightDpcl3"></div>
                            <div className="th6Wpcl3 brRightDpcl3">
                              <b className="fsdpcl3">
                                {NumberWithCommas(totalLbhOthAmt, 2)}
                              </b>
                            </div>
                          </div>
                          </div>
                        </div>

                        <div style={{width:"7%"}}>
                          <div>
                            <div
                              className="th7Dpcl3 w-100"
                              style={{
                                backgroundColor: "#e8e8e8",
                                fontSize: "12px",
                                height: "22px",
                              }}
                            >
                              <b className="fsdpcl3 w-100 d-flex justify-content-end align-items-center pe-1">
                                {NumberWithCommas(totalUniCostAmt, 2)}
                              </b>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sumarypcl3 no_break">
                      <div className="amountSummarySectionpcl3 ">
                        <div className="fapcl3">
                          <div className="d-flex justify-content-end w-50 fsdpcl3">
                            Total Discount
                          </div>
                          <div className="mrpWpcl3 fsdpcl3 w-50">
                            {NumberWithCommas(totalObj?.totDiscount, 2)}
                          </div>{" "}
                        </div>
                        <div className="fapcl3">
                          <div className="d-flex justify-content-end w-50 fsdpcl3">
                            Total Amount
                          </div>
                          <div className="mrpWpcl3 fsdpcl3 w-50">
                            {NumberWithCommas(
                              +totalUniCostAmt?.toFixed(2) -
                                totalObj?.totDiscount?.toFixed(2)
                            )}
                          </div>{" "}
                        </div>
                        {taxTotal?.length > 0 &&
                          taxTotal?.map((e, i) => {
                            return (
                              <div
                                className="d-flex justify-content-between w-100 fsdpcl3"
                                key={i}
                              >
                                <div className="w-50 d-flex justify-content-end fsdpcl3">
                                  {e?.name} {e?.per}
                                </div>
                                <div className="w-50 d-flex justify-content-end fsdpcl3">
                                  {NumberWithCommas(e?.amount, 2)}
                                </div>
                              </div>
                            );
                          })}
                        <div className="fapcl3">
                          <div className="d-flex justify-content-end w-50 fsdpcl3">
                            Less{" "}
                          </div>
                          <div className="mrpWpcl3 fsdpcl3">
                            {headerData?.AddLess?.toFixed(2)}
                          </div>{" "}
                        </div>
                        <div className="fapcl3">
                          <div className="d-flex justify-content-end w-50">
                            <b className="fsdpcl3">Final Amount</b>
                          </div>
                          <div className="mrpWpcl3">
                            <b className="fsdpcl3 w-100">
                              {NumberWithCommas(finalAmount, 2)}
                            
                            </b>{" "}
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                    <div
                      className="footerTotalpcl3 no_break"
                      style={{ width: "100%" }}
                    >
                      <div className="footerSummarypcl3" style={{width:"30%"}}>
                        <div className="sumpcl3">SUMMARY</div>
                        <div className="flexSumpcl3">
                          <div className="amountSummarySectionpcl3SUM">
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D textrightpcl3 w-50">
                                <b className="fsdpcl3">GOLD IN 24KT</b>
                              </div>
                              <div className="mrpWpcl3D textrightpcl3 fsdpcl3 justify-content-end pe-1 w-50">
                                { totalObj.totpurnetwt?.toFixed(2)} gm
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">GROSS WT</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totgrosswt?.toFixed(3)} gm
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">NET WT</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalnetlosswt?.toFixed(3)} gm
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">LOSS WT</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {lossWt?.toFixed(3)} gm
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">DIAMOND WT</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totdiapcs}/
                                {totalObj.totdiawt.toFixed(3)} cts
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">STONE WT</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totcspcs}/
                                {totalObj.totcswt.toFixed(3)} cts
                              </div>
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">MISC WT</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totmiscpcs}/
                                {totalObj.totmiscwt.toFixed(3)} gm
                              </div>{" "}
                            </div>
                            <div
                              className="diaDetailpcl3"
                              style={{ width: "", height: "18pt" }}
                            ></div>
                          </div>
                          <div className="amountSummarySectionpcl3SUM" style={{borderLeft:"0px"}}>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">GOLD</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {NumberWithCommas(totalObj.totmtamt, 2)}
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">DIAMOND</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totdiaamt?.toFixed(3)}
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">CST</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totcsamt?.toFixed(3)}
                              </div>
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">MISC</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {totalObj.totmiscamt?.toFixed(3)}
                              </div>
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">MAKING</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {NumberWithCommas(totalObj.totmakingAmt, 2)}
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">OTHER</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {NumberWithCommas(totalObj.totOthAmt, 2)}
                              </div>{" "}
                            </div>
                            <div className="fapcl3D">
                              <div className="mrpWpcl3D w-50">
                                <b className="fsdpcl3">LESS</b>
                              </div>
                              <div className="mrpWpcl3D fsdpcl3 justify-content-end pe-1 w-50">
                                {headerData?.AddLess}{" "}
                              </div>{" "}
                            </div>
                            <div className="fapcl3 w-100">
                              <div
                                className="mrpWpcl3 diaDetailpcl3 justify-content-start ps-1 w-50"
                              >
                                <b className="fsdpcl3">TOTAL</b>
                              </div>
                              <div className="mrpWpcl3 diaDetailpcl3 justify-content-end pe-1 w-50">
                                <b className="fsdpcl3">
                                  {NumberWithCommas(finalAmount, 2)}
                                </b>{" "}
                              </div>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{width:"15%"}}>
                        <div className="diaDetailpcl3 brbpcl3all">DIAMOND DETAILS</div>
                        <div className="amountSummarySectionpcl3DIAM">
                          {calculatedData?.length > 0 &&
                            calculatedData?.map((e, i) => {
                              return (
                                <div className="fapcl3DE" key={i}>
                                  <div className="mrpWpcl3D w-50">
                                    <b className="fsdpcl3">{e?.ShapeName}</b>
                                  </div>
                                  <div className="mrpWpcl3D fsdpcl3 w-50">
                                    {e?.totalPcs}/
                                    {e?.totalWt?.toFixed(3)} cts
                                  </div>{" "}
                                </div>
                              );
                            })}
                          <div
                            className="diaDetailpcl3"
                            style={{ height: "18pt" }}
                          ></div>
                        </div>
                      </div>
                      <div style={{width:"15%"}}>
                        <div className="diaDetailpcl3 brbpcl3all">OTHER DETAILS</div>
                        <div className="amountSummarySectionpcl3DIAM">
                          <div className="fapcl3D">
                            <div
                              className="mrpWpcl3D"
                              style={{ width: "50%" }}
                            >
                              <b className="fsdpcl3">RATE IN 24KT</b>
                            </div>
                            <div className="mrpWpcl3D fsdpcl3 d-flex justify-content-end pe-1 align-items-center" style={{width:"50%"}}>
                              {NumberWithCommas(headerData?.MetalRate24K, 2)}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                      <div style={{width:"15%"}}>
                        <div className="diaDetailpcl3 brbpcl3all">REMARK</div>
                        <div className="amountSummarySectionpcl3DIAM">
                          <div className="fapcl3D" style={{ width: "168px" }}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: headerData?.Remark,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="createdPcl3">
                        <i className="createpcl3">Created By</i>
                      </div>
                      <div className="createdPcl3">
                        <i className="createpcl3">Checked By</i>
                      </div>
                    </div>
                    <div></div>
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

export default PackingList3;
