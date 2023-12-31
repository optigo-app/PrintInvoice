import React, { useEffect, useState } from "react";
import "../../assets/css/prints/packinglist.css";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import {
  apiCall,
  isObjectEmpty,
  NumberWithCommas,
  taxGenrator,
} from "../../GlobalFunctions";
import { setFinalArr } from "../../GlobalFunctions/setFinalArr";

const PackingList = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState({});
  const [dynamicList1, setDynamicList1] = useState([]);
  const [dynamicList2, setDynamicList2] = useState([]);
  const [mainTotal, setMainTotal] = useState({});
  const [resultArray, setAesultArray] = useState([]);
  const [totalgrosswt, setTotalgrosswt] = useState(0);
  const [totalnetlosswt, setTotalnetlosswt] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalLabourAmount, setTotalLabourAmount] = useState(0);
  const [totalOtherAmount, setTotalOtherAmount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [responsejson, setResponsejson] = useState("");
  const [taxtotal, setTaxTotal] = useState([]);
  const [grandtot, setGrandTot] = useState([]);
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
    totlbramt: 0,
  };
  let diamondList = [];
  let colorStoneList = [];
  let miscList = [];
  let metalList = [];
  let findingList = [];
  // eslint-disable-next-line no-unused-vars
  let stoneMiscList = [];

  const organizeData = (arr, arr1, arr2) => {
    let totgrosswt = 0;
    let totnetlosswt = 0;
    let totallbrAmt = 0;
    let totalOtherAmt = 0;

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
    let totalAmt = 0;
    let metalRateGold = [];
    // eslint-disable-next-line array-callback-return
    arr1?.map((e, i) => {
      let objects = {
        netWt: e?.NetWt,
        amount: 0,
        rate: 0,
        groupjob: e?.GroupJob,
      };
      // eslint-disable-next-line no-unused-vars
      let objectsCS = {
        netWt: e?.NetWt,
        amount: 0,
        rate: 0,
        groupjob: e?.GroupJob,
        typeid:e?.MasterManagement_DiamondStoneTypeid,
      };
      let metalGold24KRate = 0;
      let diamonds = [];
      let colorstone = [];
      let metal = [];
      let misc = [];
      let finding = [];
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

      totgrosswt += e?.grosswt;

      totnetlosswt = totnetlosswt + +e?.NetWt + +e?.LossWt;
      totals.labour.labourAmount = totals?.labour?.labourAmount + e?.MakingAmount;
      totals.OtherCh.OtherAmount =
        totals?.OtherCh?.OtherAmount + e?.OtherCharges + e?.MiscAmount;
      totallbrAmt += e?.MakingAmount;
      totalOtherAmt += e?.OtherCharges + e?.MiscAmount;

      totalAmt = totalAmt + e?.TotalAmount;

      // eslint-disable-next-line array-callback-return
      arr2?.map((ele, ind) => {
        if (e.SrJobno === ele?.StockBarcode) {
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
            objects.rate += ele?.Rate;
            objects.amount += ele?.Amount;
            metalGold24KRate += ele?.Rate;
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
        }
      });
      let obj = { ...e };
      obj.metalGold24KRate = metalGold24KRate;
      obj.diamonds = diamonds;
      obj.colorstone = colorstone;
      obj.metal = metal;
      obj.misc = misc;
      obj.finding = finding;
      obj.totals = totals;
      let sumoflbr = e?.MakingAmount;
      obj.LabourAmountSum = sumoflbr;
      let sumofOth = e?.OtherCharges + e?.MiscAmount;
      obj.OtherChargeAmountSum = sumofOth;
      resultArr.push(obj);
      if (e?.groupjob !== "") {
        let findRecord = metalRateGold?.findIndex(
          (elem) => elem?.groupjob === objects?.groupjob
        );
        if (findRecord === -1) {
          metalRateGold?.push(objects);
        } else {
          metalRateGold[findRecord].netWt = objects?.netWt;
          metalRateGold[findRecord].amount = objects?.amount;
          metalRateGold[findRecord].rate = objects?.rate;
        }
      }
    });

    

    




    // eslint-disable-next-line no-unused-vars
    let aaaa =  setFinalArr(resultArr, arr,arr1,arr2);




    let semiFInalArr = [];
 
    resultArr?.forEach((e, i) => {
      if(e?.GroupJob === ''){
        semiFInalArr.push(e)
      }else{
        let obj = {...e};
        let findRecord = semiFInalArr?.findIndex((ele) => obj?.GroupJob === ele?.GroupJob) 
        if(findRecord === -1){
        // console.log("mle 6", obj);
          
          semiFInalArr?.push(obj)
        }
        else{
          //jema record mle emna mate
          
          if(semiFInalArr[findRecord]?.GroupJob !== semiFInalArr[findRecord]?.SrJobno){
            semiFInalArr[findRecord].GroupJob = obj?.SrJobno;
            semiFInalArr[findRecord].DesignImage = obj?.DesignImage;
            semiFInalArr[findRecord].HUID =  obj?.HUID;
            semiFInalArr[findRecord].designno =  obj?.designno;
            semiFInalArr[findRecord].CertificateNo = obj?.CertificateNo;
            semiFInalArr[findRecord].JewelCodePrefix =  obj?.JewelCodePrefix;
          }
          let diamondsD = [obj?.diamonds, semiFInalArr[findRecord]?.diamonds]?.flat();
          // console.log(diamondsD);
          let blankArrDiaD = [];
          diamondsD?.forEach((elem, i) => {
            let findIndexofDiamond = blankArrDiaD?.findIndex(el => el?.ShapeName === elem?.ShapeName &&
              el?.QualityName === elem?.QualityName &&el?.Colorname === elem?.Colorname &&el?.Rate === elem?.Rate);

              if(findIndexofDiamond === -1){
                blankArrDiaD?.push(elem);
              }else{
                blankArrDiaD[findIndexofDiamond].Wt += elem?.Wt
                blankArrDiaD[findIndexofDiamond].Pcs += elem?.Pcs
                blankArrDiaD[findIndexofDiamond].Amount += elem?.Amount
              }
          });
          let colorstonesD = [obj?.colorstone, semiFInalArr[findRecord]?.colorstone]?.flat();
          
          let blankArrCS = [];
          colorstonesD?.forEach((elem, i) => {
            let findIndexofColorStone = blankArrCS?.findIndex(el => el.ShapeName === elem?.ShapeName && el?.QualityName === elem?.QualityName && el?.Colorname === elem?.Colorname &&
               el?.Rate === elem?.Rate);
              if(findIndexofColorStone === -1){
                blankArrCS?.push(elem);
              }else{
                blankArrCS[findIndexofColorStone].Wt += elem?.Wt;
                blankArrCS[findIndexofColorStone].Pcs += elem?.Pcs;
                blankArrCS[findIndexofColorStone].Amount += elem?.Amount;
              }
          })
         obj.diamonds = blankArrDiaD;
         obj.colorstone = blankArrCS;
        }
      }
    })



 
 
 
 
 
 
 
 
 
 
    let finalArr = [];
    // eslint-disable-next-line array-callback-return
    semiFInalArr.map((e, i) => {
      let obj = {...e};
      if(e?.GroupJob === ""){
        obj.goldPrice = obj?.metalGold24KRate;
      }else{
        let findRecord = metalRateGold?.findIndex(elem=> elem?.groupjob === e?.GroupJob);
        if(findRecord === -1){
          obj.goldPrice = obj?.metalGold24KRate;
        }else{
          obj.goldPrice = metalRateGold[findRecord]?.amount / (arr?.CurrencyExchRate * metalRateGold[findRecord]?.netWt);
        }
      };
      finalArr.push(obj);
    })

    let allTax = taxGenrator(arr, totalAmt);

    allTax?.forEach((e) => {
      totalAmt += +e?.amount;
    });
    totalAmt += arr?.AddLess;

    setGrandTot(totalAmt);
    setTaxTotal(allTax);

    setAesultArray(semiFInalArr);
    setMainTotal(mainTotal);
    setTotalgrosswt(totgrosswt);
    setTotalnetlosswt(totnetlosswt);
    setTotalLabourAmount(totallbrAmt);
    setTotalOtherAmount(totalOtherAmt);
  };

  async function loadData(data) {
    try {
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
            setResponsejson(data?.Data);
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

  dynamicList2?.length > 0 &&
    // eslint-disable-next-line array-callback-return
    dynamicList2?.map((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        totalObj.totdiapcs = totalObj?.totdiapcs + +e?.Pcs;
        totalObj.totdiawt = totalObj?.totdiawt + +e?.Wt;
        totalObj.totdiaamt = totalObj?.totdiaamt + +e?.Amount;
        diamondList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 2) {
        totalObj.totcspcs = totalObj?.totcspcs + e?.Pcs;
        totalObj.totcswt = totalObj?.totcswt + e?.Wt;
        totalObj.totcsamt = totalObj?.totcsamt + e?.Amount;
        colorStoneList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 3) {
        totalObj.totmiscpcs = totalObj?.totmiscpcs + e?.Pcs;
        totalObj.totmiscwt = totalObj?.totmiscwt + e?.Wt;
        totalObj.totmiscamt = totalObj?.totmiscamt + e?.Amount;
        miscList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 4) {
        totalObj.totmtpcs = totalObj?.totmtpcs + e?.Pcs;
        totalObj.totmtwt = totalObj?.totmtwt + e?.Wt;
        totalObj.totmtamt = totalObj?.totmtamt + e?.Amount;
        metalList.push(e);
      }
      if (e?.MasterManagement_DiamondStoneTypeid === 5) {
        findingList?.push(e);
      }
      if (
        e?.MasterManagement_DiamondStoneTypeid === 2 ||
        e?.MasterManagement_DiamondStoneTypeid === 3
      ) {
        totalObj.totstpcs = totalObj?.totstpcs + e?.Pcs;
        totalObj.totstwt = totalObj?.totstwt + e?.Wt;
        totalObj.totstamt = totalObj?.totstamt + e?.Amount;
      }
    });

  // eslint-disable-next-line array-callback-return
  dynamicList1?.map((e) => {
    totalObj.totlbramt = totalObj?.totlbramt + e?.MaKingCharge_Unit;
    totalObj.totalAmt = totalObj?.totalAmt + e?.TotalAmount;
    totalObj.totmakingAmt = totalObj?.totmakingAmt + e?.MakingAmount;
    totalObj.totDiscount = totalObj?.totDiscount + e?.DiscountAmt;
    totalObj.totgrosswt = totalObj?.totgrosswt + e?.grosswt;
    totalObj.totnetwt = totalObj?.totnetwt + e?.NetWt;
    totalObj.totOthAmt = totalObj?.totOthAmt + e?.OtherCharges + e?.MiscAmount;
  });

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
              <div className="pclprint pad_60_allPrint">
                <div className="pclheader">
                  <div className="orailpcl">
                    <img
                      src={headerData?.PrintLogo}
                      alt="orail"
                      id="orailpcl"
                    />
                  </div>
                  <div className="addresspcl fspcl">
                    {headerData?.CompanyAddress} {headerData?.CompanyAddress2}{" "}
                    {headerData?.CompanyCity} - {headerData?.CompanyPinCode}
                  </div>
                  <div className="pclheaderplist">
                    {headerData?.PrintHeadLabel}
                  </div>
                  <div className="d-flex fw-bold justify-content-center align-items-center">
                    (
                    <b
                      className="d-flex"
                      style={{ fontSize: "12px" }}
                      dangerouslySetInnerHTML={{
                        __html: headerData?.PrintRemark?.replace(
                          /<br\s*\/?>/gi,
                          " "
                        ),
                      }}
                    ></b>
                    )
                  </div>
                </div>
                <div className="pclsubheader">
                  <div className="partynamepcl">
                    <b className="partypcl">Party:</b>
                    <div className="contentpclparty">
                      {headerData?.customerfirmname}
                    </div>
                  </div>
                  <div className="w-25">
                    <div className="invnopcl">
                      <div className="invnolabelpcl">Invoice No: </div>
                      <b className="pclinvno">{headerData?.InvoiceNo}</b>
                    </div>
                    <div className="invnopcl">
                      <div className="invnolabelpcl">Date: </div>
                      <b className="pclinvno">{headerData?.EntryDate}</b>
                    </div>
                  </div>
                </div>
                <div className="pcltable">
                  <div className="pcltablecontent">
                    <div className="pcltablehead border-start border-end border-bottom border-black mb-1">
                      <div className="srnopclthead centerpcl fwboldpcl srfslhpcl">
                        Sr No
                      </div>
                      <div className="jewpclthead fwboldpcl fspcl">
                        Jewelcode
                      </div>
                      <div className="diamheadpcl">
                        <p className="diamhpclcol1 fwboldpcl fspcl">Diamond</p>
                        <div className="diamhpclcol">
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Shape
                          </p>
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Size
                          </p>
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Wt
                          </p>
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Rate
                          </p>
                          <p
                            className="dcolsthpcl centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </p>
                        </div>
                      </div>
                      <div className="diamheadpcl">
                        <p className="diamhpclcol1 fwboldpcl fspcl">Metal</p>
                        <div className="diamhpclcol">
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            KT
                          </p>
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Gr Wt
                          </p>
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            N + L
                          </p>
                          <p className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Rate
                          </p>
                          <p
                            className="dcolsthpcl centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </p>
                        </div>
                      </div>
                      <div className="shptheadpcl">
                        <p className="shpcolpcl1 fwboldpcl fspcl">Stone</p>
                        <div className="shpcolpclcol">
                          <p className="shpthcolspcl centerpcl fwboldpcl fspcl">
                            Shape
                          </p>
                          <p className="shpthcolspcl centerpcl fwboldpcl fspcl">
                            Wt
                          </p>
                          <p className="shpthcolspcl centerpcl fwboldpcl fspcl">
                            Rate
                          </p>
                          <p
                            className="shpthcolspcl centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </p>
                        </div>
                      </div>
                      <div className="lotheadpcl">
                        <p className="lbhthpcl fwboldpcl fspcl">Labour</p>
                        <div className="lbhthpclcol">
                          <p className="lopclcol centerpcl fwboldpcl fspcl">
                            Rate
                          </p>
                          <p
                            className="lopclcol centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </p>
                        </div>
                      </div>
                      <div className="lotheadpcl">
                        <p className="lbhthpcl fwboldpcl fspcl">Other</p>
                        <div className="lbhthpclcol">
                          <p className="lopclcol centerpcl fwboldpcl fspcl">
                            Code
                          </p>
                          <p
                            className="lopclcol centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </p>
                        </div>
                      </div>
                      <div className="pricetheadpcl fwboldpcl fspcl">Price</div>
                    </div>
                    {resultArray?.map((e, i) => {
                      return (
                        <div
                          className="tablebodypcl border-start border-end border-bottom border-black"
                          key={i}
                        >
                          <div className="tbodyrowpcl">
                            <div className="pcltbr1c1 fspcl">{e?.SrNo}</div>
                            <div className="pcltbr1c2 fspcl">
                              <div className="fspcl">{e?.SrJobno}</div>
                              <div className="designimgpcl fspcl">
                                <img
                                  src={e?.DesignImage}
                                  alt="packinglist"
                                  id="designimgpclid"
                                />
                              </div>
                              <div className="fspcl">{e?.CertificateNo}</div>
                              <div className="fspcl">{e?.HUID}</div>
                            </div>
                            {/* diamond */}
                            <div className="pcltbr1c3 fspcl">
                              <div className="dcolsthpcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <p className="leftpcl fspcl" key={i}>
                                        {ele?.ShapeName}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <p className="leftpcl fspcl" key={i}>
                                        {ele?.SizeName}
                                      </p>
                                    );
                                    // }
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {ele?.Wt?.toFixed(3)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {NumberWithCommas(ele?.Rate, 2)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div
                                className="dcolsthpcl fspcl"
                                style={{ borderRight: "0px" }}
                              >
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl " key={i}>
                                        {NumberWithCommas(ele?.Amount, 2)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                            </div>
                            {/* metal */}
                            <div className="pcltbr1c3 fspcl">
                              <div className="dcolsthpcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.metal?.map((ele, i) => {
                                    return (
                                      <p className="leftpcl fspcl" key={i}>
                                        {ele?.ShapeName +
                                          " " +
                                          ele?.QualityName}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl rightpcl fspcl">
                                {e?.grosswt?.toFixed(3)}
                              </div>
                              <div className="dcolsthpcl rightpcl fspcl">
                                {(
                                  +e?.NetWt?.toFixed(3) + +e?.LossWt?.toFixed(3)
                                )?.toFixed(3)}
                              </div>
                              <div className="dcolsthpcl fspcl">
                                {" "}
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.metal?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {/* {NumberWithCommas(ele?.Rate, 2)} */}
                                        {NumberWithCommas(e?.goldPrice, 2)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div
                                className="dcolsthpcl fspcl"
                                style={{ borderRight: "0px" }}
                              >
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.metal?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {NumberWithCommas(ele?.Amount, 2)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                            </div>
                            {/* colorstone */}
                            <div className="pcltbr1c5 fspcl">
                              <div className="shpthcolspcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <p className="leftpcl fspcl" key={i}>
                                        {ele?.ShapeName}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div className="shpthcolspcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {ele?.Wt?.toFixed(3)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div className="shpthcolspcl fspcl">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {/* {ele?.Rate?.toFixed(2)} */}
                                        {NumberWithCommas(ele?.Rate, 2)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                              <div
                                className="shpthcolspcl fspcl"
                                style={{ borderRight: "0px" }}
                              >
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <p className="rightpcl fspcl" key={i}>
                                        {NumberWithCommas(ele?.Amount, 2)}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                            </div>
                            {/* labour */}
                            <div className="pcltbr1c6 fspcl">
                              <div className="lopclcol rightpcl fspcl">
                                {NumberWithCommas(e?.MaKingCharge_Unit, 2)}
                              </div>
                              <div
                                className="lopclcol rightpcl fspcl"
                                style={{ borderRight: "0px" }}
                              >
                                {NumberWithCommas(e?.MakingAmount, 2)}
                              </div>
                            </div>
                            {/* othercharge */}
                            <div className="pcltbr1c6 fspcl">
                              <div className="lopclcol fspcl"></div>
                              <div
                                className="lopclcol fspcl"
                                style={{ borderRight: "0px" }}
                              >
                                <p className="rightpcl fspcl">
                                  {NumberWithCommas(e?.OtherCharges, 2)}
                                </p>
                                <p className="rightpcl fspcl">
                                  {NumberWithCommas(e?.MiscAmount, 2)}
                                </p>
                              </div>
                            </div>
                            {/* price */}
                            <div
                              className="pcltbr1c7 rightpcl fwboldpcl fspcl"
                              style={{ borderRight: "0px" }}
                            >
                              {NumberWithCommas(e?.UnitCost, 2)}
                            </div>
                          </div>
                          <div
                            className="tbodyrowpcltot fspcl"
                            style={{ borderTop: "1px solid #989898" }}
                          >
                            <div
                              className="srpcltotrowtb fspcl"
                              style={{
                                backgroundColor: "white",
                                height: "14px",
                              }}
                            ></div>
                            <div
                              className="jwlpcltotrowtb fspcl"
                              style={{
                                backgroundColor: "white",
                                height: "14px",
                              }}
                            ></div>
                            <div className="diapcltotrowtb fspcl">
                              <p className="dcolsthpcl"></p>
                              <p className="dcolsthpcl"></p>
                              <p
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{ paddingRight: "2px" }}
                              >
                                {e?.totals?.diamonds?.Wt?.toFixed(3)}
                              </p>
                              <p className="dcolsthpcl"></p>
                              <p
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "2px",
                                }}
                              >
                                {NumberWithCommas(
                                  e?.totals?.diamonds?.Amount,
                                  2
                                )}
                              </p>
                            </div>
                            <div className="diapcltotrowtb">
                              <p className="dcolsthpcl"></p>
                              <p
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{ paddingRight: "2px" }}
                              >
                                {e?.grosswt?.toFixed(3)}
                              </p>
                              <p
                                className="dcolsthpcl rightpcl fwboldpcl fspcld-flex justify-content-end align-items-center"
                                style={{ paddingRight: "2px" }}
                              >
                                {(
                                  +e?.NetWt?.toFixed(3) + +e?.LossWt?.toFixed(3)
                                )?.toFixed(3)}
                              </p>
                              <p className="dcolsthpcl"></p>
                              <p
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "2px",
                                }}
                              >
                                {NumberWithCommas(e?.totals?.metal?.Amount, 2)}
                              </p>
                            </div>
                            <div className="stnpcltotrowtb">
                              <p className="shpthcolspcl"></p>
                              <p
                                className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{ paddingRight: "2px" }}
                              >
                                {e?.totals?.colorstone?.Wt?.toFixed(3)}
                              </p>
                              <p className="shpthcolspcl"></p>
                              <p
                                className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "2px",
                                }}
                              >
                                {NumberWithCommas(
                                  e?.totals?.colorstone?.Amount,
                                  2
                                )}
                              </p>
                            </div>
                            <div className="lopcltotrowtb">
                              <p className="lopclcol"></p>

                              <p
                                className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "2px",
                                }}
                              >
                                {NumberWithCommas(e?.LabourAmountSum, 2)}
                              </p>
                            </div>
                            <div className="lopcltotrowtb">
                              <p className="lopclcol"></p>
                              <p
                                className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "2px",
                                }}
                              >
                                {NumberWithCommas(e?.OtherChargeAmountSum, 2)}
                              </p>
                            </div>
                            <div
                              className="prpcltotrowtb rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                              style={{
                                borderRight: "0px",
                                paddingRight: "2px",
                              }}
                            >
                              {NumberWithCommas(e?.UnitCost, 2)}
                            </div>
                          </div>
                          <div
                            className="tbodyrowpcltot fspcl"
                            style={{
                              borderTop: "1px solid #989898",
                              borderBottom: "1px solid #989898",
                            }}
                          >
                            <div
                              className="srpcltotrowtb fspcl"
                              style={{
                                backgroundColor: "white",
                                height: "13px",
                              }}
                            ></div>
                            <div
                              className="jwlpcltotrowtb fspcl"
                              style={{
                                backgroundColor: "white",
                                height: "13px",
                              }}
                            ></div>
                            <div className="diapcltotrowtb fspcl"></div>
                            <div className="diapcltotrowtb"></div>
                            <div className="stnpcltotrowtb"></div>
                            <div
                              className="lopcltotrowtb dispcltotrowtb"
                              style={{ width: "20%" }}
                            >
                              <p className="discpclcs fwboldpcl fspcl">
                                Discount {e?.Discount}% @Total Amount
                              </p>
                              <p
                                className="disvalpclcs rightpcl fwboldpcl fspcl"
                                style={{ borderRight: "0px" }}
                              >
                                {NumberWithCommas(e?.DiscountAmt, 2)}
                              </p>
                            </div>

                            <div
                              className="prpcltotrowtb rightpcl fwboldpcl fspcl"
                              style={{ borderRight: "0px" }}
                            >
                              {NumberWithCommas(e?.TotalAmount, 2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="tbodyrowpcltot border-start border-end border-black"
                    style={{ borderBottom: "1px solid black", height: "16px" }}
                  >
                    <div className="srpcltotrowtb"></div>
                    <div className="jwlpcltotrowtb fspcl">
                      <b className="fspcl">TOTAL</b>
                    </div>
                    <div className="diapcltotrowtb">
                      <p className="dcolsthpcl"></p>
                      <p className="dcolsthpcl"></p>
                      <p
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "2px" }}
                      >
                        {mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </p>
                      <p className="dcolsthpcl"></p>
                      <p
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "2px" }}
                      >
                        {NumberWithCommas(mainTotal?.diamonds?.Amount, 2)}
                      </p>
                    </div>
                    <div className="diapcltotrowtb">
                      <p className="dcolsthpcl"></p>
                      <p
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "2px" }}
                      >
                        {totalgrosswt?.toFixed(3)}
                      </p>
                      <div
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "2px" }}
                      >
                        {totalnetlosswt?.toFixed(3)}
                      </div>
                      <p className="dcolsthpcl"></p>
                      <p
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "2px" }}
                      >
                        {NumberWithCommas(mainTotal.metal?.Amount, 2)}
                      </p>
                    </div>
                    <div className="stnpcltotrowtb">
                      <p className="shpthcolspcl"></p>
                      <p
                        className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "2px" }}
                      >
                        {mainTotal?.colorstone?.Wt?.toFixed(3)}
                      </p>
                      <p className="shpthcolspcl"></p>
                      <p
                        className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "2px" }}
                      >
                        {NumberWithCommas(mainTotal.colorstone?.Amount, 2)}
                      </p>
                    </div>
                    <div className="lopcltotrowtb">
                      <p className="lopclcol"></p>
                      <p
                        className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "2px" }}
                      >
                        {NumberWithCommas(totalObj?.totmakingAmt, 2)}
                      </p>
                    </div>
                    <div className="lopcltotrowtb">
                      <p className="lopclcol"></p>
                      <p
                        className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "2px" }}
                      >
                        {NumberWithCommas(totalOtherAmount, 2)}
                      </p>
                    </div>
                    <div
                      className="prpcltotrowtb rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                      style={{ borderRight: "0px", paddingRight: "2px" }}
                    >
                      {NumberWithCommas(totalObj?.totalAmt, 2)}
                    </div>
                  </div>
                  <div className="tablebodypcl  border-start border-end border-bottom border-black">
                    <div className="totdispcl">
                      <p className="summaryalignpcl fspcl">Total Discount</p>
                      <p className="fspcl w-50 d-flex justify-content-end align-items-center">
                        {NumberWithCommas(totalObj?.totDiscount, 2)}
                      </p>
                    </div>
                    {taxtotal?.length > 0 &&
                      taxtotal?.map((e, i) => {
                        return (
                          <div className="d-flex totdispcl fspcl" key={i}>
                            <div className="d-flex justify-content-end w-50">
                              {e?.name} {e?.per}
                            </div>

                            <div className="d-flex justify-content-end w-50">
                              {NumberWithCommas(e?.amount, 2)}
                            </div>
                          </div>
                        );
                      })}

                    <div className="totdispcl">
                      <p className="summaryalignpcl fspcl w-50 d-flex justify-content-end align-items-center">
                        {headerData?.AddLess?.toFixed(2) > 0 ? "ADD" : "Less"}
                      </p>
                      <p className="fspcl">{headerData?.AddLess?.toFixed(2)}</p>
                    </div>
                    <div className="totdispcl">
                      <p className="summaryalignpcl fspcl">Grand Total</p>
                      <p className="fspcl w-50 d-flex justify-content-end align-items-center">
                        {NumberWithCommas(grandtot, 2)}
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

export default PackingList;
