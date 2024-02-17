import React, { useEffect, useState } from "react";
import "../../assets/css/prints/packinglist.css";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import {
  apiCall,
  formatAmount,
  handleImageError,
  isObjectEmpty,
  NumberWithCommas,
  taxGenrator,
} from "../../GlobalFunctions";
import { setFinalArr } from "../../GlobalFunctions/setFinalArr";
import { OrganizeDataPrint } from './../../GlobalFunctions/OrganizeDataPrint';

const PackingList = ({ urls, token, invoiceNo, printName, evn }) => {
  const [headerData, setHeaderData] = useState({});
  const [dynamicList1, setDynamicList1] = useState([]);
  const [dynamicList2, setDynamicList2] = useState([]);
  const [mainTotal, setMainTotal] = useState({});
  const [result, setResult] = useState(null);
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

  // const organizeData = (arr, arr1, arr2) => {
  //   let totgrosswt = 0;
  //   let totnetlosswt = 0;
  //   let totallbrAmt = 0;
  //   let totalOtherAmt = 0;

  //   let mainTotal = {
  //     diamonds: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     colorstone: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     metal: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     misc: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     finding: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     totalnetwt: {
  //       netwt: 0,
  //     },
  //     totalgrosswt: {
  //       grosswt: 0,
  //     },
  //   };
  //   let resultArr = [];
  //   let totalAmt = 0;
  //   let metalRateGold = [];
  //   // eslint-disable-next-line array-callback-return
  //   arr1?.map((e, i) => {
  //     let objects = {
  //       netWt: e?.NetWt,
  //       amount: 0,
  //       rate: 0,
  //       groupjob: e?.GroupJob,
  //     };
  //     // eslint-disable-next-line no-unused-vars
  //     let objectsCS = {
  //       netWt: e?.NetWt,
  //       amount: 0,
  //       rate: 0,
  //       groupjob: e?.GroupJob,
  //       typeid:e?.MasterManagement_DiamondStoneTypeid,
  //     };
  //     let metalGold24KRate = 0;
  //     let diamonds = [];
  //     let colorstone = [];
  //     let metal = [];
  //     let misc = [];
  //     let finding = [];
  //     let totals = {
  //       diamonds: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },

  //       colorstone: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },

  //       metal: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },

  //       misc: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },

  //       finding: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },

  //       labour: {
  //         labourAmount: 0,
  //       },

  //       OtherCh: {
  //         OtherAmount: 0,
  //       },
  //     };

  //     totgrosswt += e?.grosswt;

  //     totnetlosswt = totnetlosswt + +e?.NetWt + +e?.LossWt;
  //     totals.labour.labourAmount = totals?.labour?.labourAmount + e?.MakingAmount;
  //     totals.OtherCh.OtherAmount =
  //       totals?.OtherCh?.OtherAmount + e?.OtherCharges + e?.MiscAmount;
  //     totallbrAmt += e?.MakingAmount;
  //     totalOtherAmt += e?.OtherCharges + e?.MiscAmount;

  //     totalAmt = totalAmt + e?.TotalAmount;

  //     // eslint-disable-next-line array-callback-return
  //     arr2?.map((ele, ind) => {
  //       if (e.SrJobno === ele?.StockBarcode) {
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
  //           diamonds.push(ele);
  //           totals.diamonds.Wt += ele?.Wt;
  //           totals.diamonds.Pcs += ele?.Pcs;
  //           totals.diamonds.Rate += ele?.Rate;
  //           totals.diamonds.Amount += ele?.Amount;
  //           mainTotal.diamonds.Wt += ele?.Wt;
  //           mainTotal.diamonds.Pcs += ele?.Pcs;
  //           mainTotal.diamonds.Rate += ele?.Rate;
  //           mainTotal.diamonds.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
  //           colorstone.push(ele);
  //           totals.colorstone.Wt += ele?.Wt;
  //           totals.colorstone.Pcs += ele?.Pcs;
  //           totals.colorstone.Rate += ele?.Rate;
  //           totals.colorstone.Amount += ele?.Amount;
  //           mainTotal.colorstone.Wt += ele?.Wt;
  //           mainTotal.colorstone.Pcs += ele?.Pcs;
  //           mainTotal.colorstone.Rate += ele?.Rate;
  //           mainTotal.colorstone.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
  //           misc.push(ele);
  //           totals.misc.Wt += ele?.Wt;
  //           totals.misc.Pcs += ele?.Pcs;
  //           totals.misc.Rate += ele?.Rate;
  //           totals.misc.Amount += ele?.Amount;
  //           mainTotal.misc.Wt += ele?.Wt;
  //           mainTotal.misc.Pcs += ele?.Pcs;
  //           mainTotal.misc.Rate += ele?.Rate;
  //           mainTotal.misc.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
  //           objects.rate += ele?.Rate;
  //           objects.amount += ele?.Amount;
  //           metalGold24KRate += ele?.Rate;
  //           metal.push(ele);
  //           totals.metal.Wt += ele?.Wt;
  //           totals.metal.Pcs += ele?.Pcs;
  //           totals.metal.Rate += ele?.Rate;
  //           totals.metal.Amount += ele?.Amount;
  //           mainTotal.metal.Wt += ele?.Wt;
  //           mainTotal.metal.Pcs += ele?.Pcs;
  //           mainTotal.metal.Rate += ele?.Rate;
  //           mainTotal.metal.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
  //           finding.push(ele);
  //           totals.finding.Wt += ele?.Wt;
  //           totals.finding.Pcs += ele?.Pcs;
  //           totals.finding.Rate += ele?.Rate;
  //           totals.finding.Amount += ele?.Amount;
  //           mainTotal.finding.Wt += ele?.Wt;
  //           mainTotal.finding.Pcs += ele?.Pcs;
  //           mainTotal.finding.Rate += ele?.Rate;
  //           mainTotal.finding.Amount += ele?.Amount;
  //         }
  //       }
  //     });
  //     let obj = { ...e };
  //     obj.metalGold24KRate = metalGold24KRate;
  //     obj.diamonds = diamonds;
  //     obj.colorstone = colorstone;
  //     obj.metal = metal;
  //     obj.misc = misc;
  //     obj.finding = finding;
  //     obj.totals = totals;
  //     let sumoflbr = e?.MakingAmount;
  //     obj.LabourAmountSum = sumoflbr;
  //     let sumofOth = e?.OtherCharges + e?.MiscAmount;
  //     obj.OtherChargeAmountSum = sumofOth;
  //     resultArr.push(obj);
  //     if (e?.groupjob !== "") {
  //       let findRecord = metalRateGold?.findIndex(
  //         (elem) => elem?.groupjob === objects?.groupjob
  //       );
  //       if (findRecord === -1) {
  //         metalRateGold?.push(objects);
  //       } else {
  //         metalRateGold[findRecord].netWt = objects?.netWt;
  //         metalRateGold[findRecord].amount = objects?.amount;
  //         metalRateGold[findRecord].rate = objects?.rate;
  //       }
  //     }
  //   });

    

    




  //   // eslint-disable-next-line no-unused-vars
  //   let aaaa =  setFinalArr(resultArr, arr,arr1,arr2);




  //   let semiFInalArr = [];
 
  //   // resultArr?.forEach((e, i) => {
  //   //   if(e?.GroupJob === ''){
  //   //     semiFInalArr.push(e)
  //   //   }else{
  //   //     let obj = {...e};
  //   //     let findRecord = semiFInalArr?.findIndex((ele) => obj?.GroupJob === ele?.GroupJob) 
  //   //     if(findRecord === -1){
  //   //     // console.log("mle 6", obj);
          
  //   //       semiFInalArr?.push(obj)
  //   //     }
  //   //     else{
  //   //       //jema record mle emna mate
          
  //   //       if(semiFInalArr[findRecord]?.GroupJob !== semiFInalArr[findRecord]?.SrJobno){
  //   //         semiFInalArr[findRecord].GroupJob = obj?.SrJobno;
  //   //         semiFInalArr[findRecord].DesignImage = obj?.DesignImage;
  //   //         semiFInalArr[findRecord].HUID =  obj?.HUID;
  //   //         semiFInalArr[findRecord].designno =  obj?.designno;
  //   //         semiFInalArr[findRecord].CertificateNo = obj?.CertificateNo;
  //   //         semiFInalArr[findRecord].JewelCodePrefix =  obj?.JewelCodePrefix;
  //   //       }
  //   //       let diamondsD = [obj?.diamonds, semiFInalArr[findRecord]?.diamonds]?.flat();
  //   //       // console.log(diamondsD);
  //   //       let blankArrDiaD = [];
  //   //       diamondsD?.forEach((elem, i) => {
  //   //         let findIndexofDiamond = blankArrDiaD?.findIndex(el => el?.ShapeName === elem?.ShapeName &&
  //   //           el?.QualityName === elem?.QualityName &&el?.Colorname === elem?.Colorname &&el?.Rate === elem?.Rate);

  //   //           if(findIndexofDiamond === -1){
  //   //             blankArrDiaD?.push(elem);
  //   //           }else{
  //   //             blankArrDiaD[findIndexofDiamond].Wt += elem?.Wt
  //   //             blankArrDiaD[findIndexofDiamond].Pcs += elem?.Pcs
  //   //             blankArrDiaD[findIndexofDiamond].Amount += elem?.Amount
  //   //           }
  //   //       });
  //   //       let colorstonesD = [obj?.colorstone, semiFInalArr[findRecord]?.colorstone]?.flat();
          
  //   //       let blankArrCS = [];
  //   //       colorstonesD?.forEach((elem, i) => {
  //   //         let findIndexofColorStone = blankArrCS?.findIndex(el => el.ShapeName === elem?.ShapeName && el?.QualityName === elem?.QualityName && el?.Colorname === elem?.Colorname &&
  //   //            el?.Rate === elem?.Rate);
  //   //           if(findIndexofColorStone === -1){
  //   //             blankArrCS?.push(elem);
  //   //           }else{
  //   //             blankArrCS[findIndexofColorStone].Wt += elem?.Wt;
  //   //             blankArrCS[findIndexofColorStone].Pcs += elem?.Pcs;
  //   //             blankArrCS[findIndexofColorStone].Amount += elem?.Amount;
  //   //           }
  //   //       })
  //   //      obj.diamonds = blankArrDiaD;
  //   //      obj.colorstone = blankArrCS;
  //   //     }
  //   //   }
  //   // })



 
 
 
 
 
 
 
 
 
 
  //   let finalArr = [];
  //   // eslint-disable-next-line array-callback-return
  //   // semiFInalArr.map((e, i) => {
  //   //   let obj = {...e};
  //   //   if(e?.GroupJob === ""){
  //   //     obj.goldPrice = obj?.metalGold24KRate;
  //   //   }else{
  //   //     let findRecord = metalRateGold?.findIndex(elem=> elem?.groupjob === e?.GroupJob);
  //   //     if(findRecord === -1){
  //   //       obj.goldPrice = obj?.metalGold24KRate;
  //   //     }else{
  //   //       obj.goldPrice = metalRateGold[findRecord]?.amount / (arr?.CurrencyExchRate * metalRateGold[findRecord]?.netWt);
  //   //     }
  //   //   };
  //   //   finalArr.push(obj);
  //   // })

  //   let allTax = taxGenrator(arr, totalAmt);

  //   allTax?.forEach((e) => {
  //     totalAmt += +e?.amount;
  //   });
  //   totalAmt += arr?.AddLess;

  //   setGrandTot(totalAmt);
  //   setTaxTotal(allTax);

  //   setAesultArray(semiFInalArr);
  //   setMainTotal(mainTotal);
  //   setTotalgrosswt(totgrosswt);
  //   setTotalnetlosswt(totnetlosswt);
  //   setTotalLabourAmount(totallbrAmt);
  //   setTotalOtherAmount(totalOtherAmt);
  // };

  

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

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      console.log(datas);
      setResult(datas);
      setLoader(false);
  }

  // dynamicList2?.length > 0 &&
  //   // eslint-disable-next-line array-callback-return
  //   dynamicList2?.map((e, i) => {
  //     if (e?.MasterManagement_DiamondStoneTypeid === 1) {
  //       totalObj.totdiapcs = totalObj?.totdiapcs + +e?.Pcs;
  //       totalObj.totdiawt = totalObj?.totdiawt + +e?.Wt;
  //       totalObj.totdiaamt = totalObj?.totdiaamt + +e?.Amount;
  //       diamondList.push(e);
  //     }
  //     if (e?.MasterManagement_DiamondStoneTypeid === 2) {
  //       totalObj.totcspcs = totalObj?.totcspcs + e?.Pcs;
  //       totalObj.totcswt = totalObj?.totcswt + e?.Wt;
  //       totalObj.totcsamt = totalObj?.totcsamt + e?.Amount;
  //       colorStoneList.push(e);
  //     }
  //     if (e?.MasterManagement_DiamondStoneTypeid === 3) {
  //       totalObj.totmiscpcs = totalObj?.totmiscpcs + e?.Pcs;
  //       totalObj.totmiscwt = totalObj?.totmiscwt + e?.Wt;
  //       totalObj.totmiscamt = totalObj?.totmiscamt + e?.Amount;
  //       miscList.push(e);
  //     }
  //     if (e?.MasterManagement_DiamondStoneTypeid === 4) {
  //       totalObj.totmtpcs = totalObj?.totmtpcs + e?.Pcs;
  //       totalObj.totmtwt = totalObj?.totmtwt + e?.Wt;
  //       totalObj.totmtamt = totalObj?.totmtamt + e?.Amount;
  //       metalList.push(e);
  //     }
  //     if (e?.MasterManagement_DiamondStoneTypeid === 5) {
  //       findingList?.push(e);
  //     }
  //     if (
  //       e?.MasterManagement_DiamondStoneTypeid === 2 ||
  //       e?.MasterManagement_DiamondStoneTypeid === 3
  //     ) {
  //       totalObj.totstpcs = totalObj?.totstpcs + e?.Pcs;
  //       totalObj.totstwt = totalObj?.totstwt + e?.Wt;
  //       totalObj.totstamt = totalObj?.totstamt + e?.Amount;
  //     }
  //   });

  // // eslint-disable-next-line array-callback-return
  // dynamicList1?.map((e) => {
  //   totalObj.totlbramt = totalObj?.totlbramt + e?.MaKingCharge_Unit;
  //   totalObj.totalAmt = totalObj?.totalAmt + e?.TotalAmount;
  //   totalObj.totmakingAmt = totalObj?.totmakingAmt + e?.MakingAmount;
  //   totalObj.totDiscount = totalObj?.totDiscount + e?.DiscountAmt;
  //   totalObj.totgrosswt = totalObj?.totgrosswt + e?.grosswt;
  //   totalObj.totnetwt = totalObj?.totnetwt + e?.NetWt;
  //   totalObj.totOthAmt = totalObj?.totOthAmt + e?.OtherCharges + e?.MiscAmount;
  // });

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
                      src={result?.header?.PrintLogo}
                      alt="orail"
                      id="orailpcl"
                    />
                  </div>
                  <div className="addresspcl fspcl">
                    {result?.header?.CompanyAddress?.split(',')[0]} {result?.header?.CompanyAddress2?.split(',')[0]}{" "}
                    {result?.header?.CompanyCity} - {result?.header?.CompanyPinCode}
                  </div>
                  <div className="pclheaderplist">
                    {result?.header?.PrintHeadLabel}
                  </div>
                  <div className="d-flex fw-bold justify-content-center align-items-center">
                    (
                    <b
                      className="d-flex fspcl"
                      dangerouslySetInnerHTML={{
                        __html: result?.header?.PrintRemark?.replace(
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
                    <b className="partypcl fspcl">Party:</b>
                    <div className="contentpclparty fspcl">
                      {result?.header?.customerfirmname}
                    </div>
                  </div>
                  <div className="w-25">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-end align-items-center fspcl w-50">Invoice No: </div>
                      <b className="d-flex justify-content-end align-items-center fspcl w-50">{result?.header?.InvoiceNo}</b>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="d-flex justify-content-end align-items-center fspcl w-50">Date: </div>
                      <b className="d-flex justify-content-end align-items-center fspcl w-50">{result?.header?.EntryDate}</b>
                    </div>
                  </div>
                </div>
                <div className="pcltable">
                  <div className="pcltablecontent">
                    <div className="pcltablehead border-start border-end border-bottom border-black ">
                      <div className="srnopclthead centerpcl fwboldpcl srfslhpcl fspcl" style={{wordBreak:'break-word'}}>
                        Sr No
                      </div>
                      <div className="jewpclthead fwboldpcl fspcl fspcl">
                        Jewelcode
                      </div>
                      <div className="diamheadpcl">
                        <div className="diamhpclcol1 fwboldpcl fspcl">Diamond</div>
                        <div className="diamhpclcol">
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Shape
                          </div>
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Size
                          </div>
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Wt
                          </div>
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Rate
                          </div>
                          <div
                            className="dcolsthpcl centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </div>
                        </div>
                      </div>
                      <div className="diamheadpcl">
                        <div className="diamhpclcol1 fwboldpcl fspcl">Metal</div>
                        <div className="diamhpclcol">
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            KT
                          </div>
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Gr Wt
                          </div>
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            N + L
                          </div>
                          <div className="dcolsthpcl centerpcl fwboldpcl fspcl">
                            Rate
                          </div>
                          <div
                            className="dcolsthpcl centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </div>
                        </div>
                      </div>
                      <div className="shptheadpcl">
                        <div className="shpcolpcl1 fwboldpcl fspcl">Stone</div>
                        <div className="shpcolpclcol">
                          <div className="shpthcolspcl centerpcl fwboldpcl fspcl">
                            Shape
                          </div>
                          <div className="shpthcolspcl centerpcl fwboldpcl fspcl">
                            Wt
                          </div>
                          <div className="shpthcolspcl centerpcl fwboldpcl fspcl">
                            Rate
                          </div>
                          <div
                            className="shpthcolspcl centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </div>
                        </div>
                      </div>
                      <div className="lotheadpcl">
                        <div className="lbhthpcl fwboldpcl fspcl">Labour</div>
                        <div className="lbhthpclcol">
                          <div className="lopclcol centerpcl fwboldpcl fspcl">
                            Rate
                          </div>
                          <div
                            className="lopclcol centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </div>
                        </div>
                      </div>
                      <div className="lotheadpcl">
                        <div className="lbhthpcl fwboldpcl fspcl">Other</div>
                        <div className="lbhthpclcol">
                          <div className="lopclcol centerpcl fwboldpcl fspcl">
                            Code
                          </div>
                          <div
                            className="lopclcol centerpcl fwboldpcl fspcl"
                            style={{ borderRight: "0px" }}
                          >
                            Amount
                          </div>
                        </div>
                      </div>
                      <div className="pricetheadpcl fwboldpcl fspcl">Price</div>
                    </div>
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <div
                          className="tablebodypcl border-start border-end border-bottom border-black"
                          key={i}
                        >
                          <div className="tbodyrowpcl">
                            <div className="pcltbr1c1 fspcl">{e?.SrNo}</div>
                            <div className="pcltbr1c2 fspcl">
                              <div className="fspcl w-100 ps-1">{e?.JewelCodePrefix+(e?.SrJobno?.split("/")[1])}</div>
                              <div className="designimgpcl fspcl">
                                <img
                                  src={e?.DesignImage}
                                  alt="packinglist"
                                  id="designimgpclid"
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                              {/* <div className="fspcl">{e?.CertificateNo}</div> */}
                              { e?.HUID === '' ? '' : <div className="fspcl">HUID - {e?.HUID}</div> } 
                            </div>
                            {/* diamond */}
                            <div className="pcltbr1c3 fspcl">
                              <div className="dcolsthpcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <div className="leftpcl fspcl" key={i}>
                                        {ele?.ShapeName}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <div className="leftpcl fspcl" key={i}>
                                        {ele?.SizeName}
                                      </div>
                                    );
                                    // }
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {ele?.Wt?.toFixed(3)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {formatAmount(ele?.Rate)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div
                                className="dcolsthpcl fspcl pt-1"
                                style={{ borderRight: "0px" }}
                              >
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.diamonds?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl " key={i}>
                                        {formatAmount(ele?.Amount)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            </div>
                            {/* metal */}
                            <div className="pcltbr1c3 fspcl ">
                              <div className="dcolsthpcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.metal?.map((ele, i) => {
                                    return (
                                      <div className="leftpcl fspcl" key={i}>
                                        {ele?.ShapeName +
                                          " " +
                                          ele?.QualityName}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div className="dcolsthpcl rightpcl fspcl pt-1">
                                {e?.grosswt?.toFixed(3)}
                              </div>
                              <div className="dcolsthpcl rightpcl fspcl pt-1">{(+e?.NetWt?.toFixed(3) + +e?.LossWt?.toFixed(3))?.toFixed(3)}</div>
                              <div className="dcolsthpcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.metal?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {formatAmount(ele?.Rate)}
                                        {/* {NumberWithCommas(e?.goldPrice, 2)} */}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div
                                className="dcolsthpcl fspcl pt-1"
                                style={{ borderRight: "0px" }}
                              >
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.metal?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {formatAmount(ele?.Amount)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            </div>
                            {/* colorstone */}
                            <div className="pcltbr1c5 fspcl">
                              <div className="shpthcolspcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <div className="leftpcl fspcl" key={i}>
                                        {ele?.ShapeName}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div className="shpthcolspcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {ele?.Wt?.toFixed(3)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div className="shpthcolspcl fspcl pt-1">
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {/* {ele?.Rate?.toFixed(2)} */}
                                        {formatAmount(ele?.Rate)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                              <div
                                className="shpthcolspcl fspcl pt-1"
                                style={{ borderRight: "0px" }}
                              >
                                {
                                  // eslint-disable-next-line array-callback-return
                                  e?.colorstone?.map((ele, i) => {
                                    return (
                                      <div className="rightpcl fspcl" key={i}>
                                        {formatAmount(ele?.Amount)}
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            </div>
                            {/* labour */}
                            <div className="pcltbr1c6 fspcl ">
                              <div className="lopclcol rightpcl fspcl pt-1">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div>
                              <div
                                className="lopclcol rightpcl fspcl pt-1"
                                style={{ borderRight: "0px" }}
                              >
                                {formatAmount(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost)}
                              </div>
                            </div>
                            {/* othercharge */}
                            <div className="pcltbr1c6 fspcl">
                              
                              <div className="lopclcol fspcl pt-1">
                                  {
                                    e?.misc?.map((e, i) => {
                                      return(
                                        <div>{(e?.ShapeName?.includes('Certification') || e?.ShapeName === 'Hallmark' || e?.ShapeName === 'Stamping' ) ? e?.ShapeName : ''}</div>
                                      )
                                    })
                                  }
                              </div>
                              <div
                                className="lopclcol fspcl pt-1"
                                style={{ borderRight: "0px" }}
                              >
                                <div className="rightpcl fspcl">
                                  {/* {formatAmount(e?.OtherCharges)} */}
                                  {formatAmount(e?.MiscAmount)}
                                </div>
                                <div className="rightpcl fspcl d-flex flex-column justify-content-end align-items-end w-100">
                                  {/* {formatAmount(e?.MiscAmount)} */}
                                  {
                                    e?.misc?.map((e, i) => {
                                      return(
                                        <div key={i}>{(e?.ShapeName?.includes('Certification') || e?.ShapeName === 'Hallmark' || e?.ShapeName === 'Stamping' ) ? e?.Rate : ''}</div>
                                      )
                                    })
                                  }
                                </div>
                              </div>
                            </div>
                            {/* price */}
                            <div
                              className="pcltbr1c7 rightpcl fwboldpcl fspcl pt-1"
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
                              <div className="dcolsthpcl"></div>
                              <div className="dcolsthpcl"></div>
                              <div
                                className="dcolsthpcl  fwboldpcl fspcl d-flex justify-content-end align-items-center"
                              >
                                {e?.totals?.diamonds?.Wt?.toFixed(3)}
                              </div>
                              <div className="dcolsthpcl"></div>
                              <div
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "0px",
                                }}
                              >
                                {formatAmount(e?.totals?.diamonds?.Amount)}
                              </div>
                            </div>
                            <div className="diapcltotrowtb">
                              <div className="dcolsthpcl"></div>
                              <div
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                
                              >
                                {e?.grosswt?.toFixed(3)}
                              </div>
                              <div
                                className="dcolsthpcl rightpcl fwboldpcl fspcld-flex justify-content-end align-items-center"
                                
                              >
                                {(
                                  +e?.NetWt?.toFixed(3) + +e?.LossWt?.toFixed(3)
                                )?.toFixed(3)}
                              </div>
                              <div className="dcolsthpcl"></div>
                              <div
                                className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "0px",
                                }}
                              >
                                {formatAmount(e?.totals?.metal?.Amount)}
                              </div>
                            </div>
                            <div className="stnpcltotrowtb">
                              <div className="shpthcolspcl"></div>
                              <div
                                className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{ paddingRight: "0px" }}
                              >
                                {e?.totals?.colorstone?.Wt?.toFixed(3)}
                              </div>
                              <div className="shpthcolspcl"></div>
                              <div
                                className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "0px",
                                }}
                              >
                                {formatAmount(e?.totals?.colorstone?.Amount,2)}
                              </div>
                            </div>
                            <div className="lopcltotrowtb">
                              <div className="lopclcol"></div>

                              <div
                                className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "0px",
                                }}
                              > {formatAmount(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost)}
                              </div>
                            </div>
                            <div className="lopcltotrowtb">
                              <div className="lopclcol"></div>
                              <div
                                className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                                style={{
                                  borderRight: "0px",
                                  paddingRight: "0px",
                                }}
                              >
                                {formatAmount((e?.OtherCharges +e?.totals?.otherChargesMiscHallStamp))}
                              </div>
                            </div>
                            <div
                              className="prpcltotrowtb rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                              style={{
                                borderRight: "0px",
                                paddingRight: "0px",
                              }}
                            >
                              {formatAmount(e?.UnitCost)}
                            </div>
                          </div>
                           {
                            e?.DiscountAmt === 0 ? '' : <div
                            className="tbodyrowpcltot fspcl"
                            style={{
                              borderTop: "1px solid #989898",
                              // borderBottom: "1px solid #989898",
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
                              <div className="discpclcs fwboldpcl fspcl">
                                Discount {e?.Discount}% @Total Amount
                              </div>
                              <div
                                className="disvalpclcs  fwboldpcl fspcl d-flex justify-content-end"
                                style={{ borderRight: "0px" }}
                              >
                                {formatAmount(e?.DiscountAmt)}
                              </div>
                            </div>

                            <div
                              className="prpcltotrowtb rightpcl fwboldpcl fspcl"
                              style={{ borderRight: "0px" }}
                            >
                              {formatAmount(e?.TotalAmount)}
                            </div>
                          </div> 
                           } 
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="tbodyrowpcltot border-start border-end border-black"
                    style={{ borderBottom: "1px solid black", height: "15px" }}
                  >
                    <div className="srpcltotrowtb"></div>
                    <div className="jwlpcltotrowtb fspcl">
                      <b className="fspcl">TOTAL</b>
                    </div>
                    <div className="diapcltotrowtb">
                      <div className="dcolsthpcl"></div>
                      <div className="dcolsthpcl"></div>
                      <div
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "0px" }}
                      >
                        {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      <div className="dcolsthpcl"></div>
                      <div
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "0px" }}
                      >
                        {formatAmount(result?.mainTotal?.diamonds?.Amount)}
                      </div>
                    </div>
                    <div className="diapcltotrowtb">
                      <div className="dcolsthpcl"></div>
                      <div
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "0px" }}
                      >
                        {result?.mainTotal?.grosswt?.toFixed(3)}
                      </div>
                      <div
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "0px" }}
                      >
                        {result?.mainTotal?.netwtWithLossWt?.toFixed(3)}
                      </div>
                      <div className="dcolsthpcl"></div>
                      <div
                        className="dcolsthpcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "0px" }}
                      >
                        {formatAmount(result?.mainTotal.metal?.Amount)}
                      </div>
                    </div>
                    <div className="stnpcltotrowtb">
                      <div className="shpthcolspcl"></div>
                      <div
                        className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ paddingRight: "0px" }}
                      >
                        {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                      </div>
                      <div className="shpthcolspcl"></div>
                      <div
                        className="shpthcolspcl rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "0px" }}
                      >
                        {formatAmount(result?.mainTotal.colorstone?.Amount)}
                      </div>
                    </div>
                    <div className="lopcltotrowtb">
                      <div className="lopclcol"></div>
                      <div
                        className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "0px" }}
                      >
                        {formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}
                      </div>
                    </div>
                    <div className="lopcltotrowtb">
                      <div className="lopclcol"></div>
                      <div
                        className="lopclcol rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                        style={{ borderRight: "0px", paddingRight: "0px" }}
                      >
                        {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                      </div>
                    </div>
                    <div
                      className="prpcltotrowtb rightpcl fwboldpcl fspcl d-flex justify-content-end align-items-center"
                      style={{ borderRight: "0px", paddingRight: "0px" }}
                    >
                      {formatAmount(result?.mainTotal?.total_amount)}
                    </div>
                  </div>
                  <div className="tablebodypcl  border-start border-end border-bottom border-black">
                    <div className="totdispcl">
                      <div className="summaryalignpcl fspcl">Total Discount</div>
                      <div className="fspcl w-50 d-flex justify-content-end align-items-center">
                        {formatAmount(result?.mainTotal?.total_discount_amount)}
                      </div>
                    </div>
                    {result?.allTaxes?.length > 0 &&
                      result?.allTaxes?.map((e, i) => {
                        return (
                          <div className="d-flex totdispcl fspcl" key={i}>
                            <div className="d-flex justify-content-end w-50">
                              {e?.name} {e?.per}
                            </div>

                            <div className="d-flex justify-content-end w-50">
                              {formatAmount(e?.amount)}
                            </div>
                          </div>
                        );
                      })}

                    <div className="totdispcl">
                      <div className="summaryalignpcl fspcl w-50 d-flex justify-content-end align-items-center">
                        {headerData?.AddLess?.toFixed(2) > 0 ? "ADD" : "Less"}
                      </div>
                      <div className="fspcl">{result?.header?.AddLess?.toFixed(2)}</div>
                    </div>
                    <div className="totdispcl">
                      <div className="summaryalignpcl fspcl">Grand Total</div>
                      <div className="fspcl w-50 d-flex justify-content-end align-items-center">
                        {formatAmount(result?.finalAmount)}
                      </div>
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
