import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import { apiCall, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import "../../assets/css/prints/jewelleryinvoice2.css";
import { formatAmount } from "./../../GlobalFunctions";
import { ToWords } from "to-words";
const JewelleryInvoice2 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [metWise, setMetWise] = useState([]);
  const [totobj, setTotObj] = useState();
  const [totalCtw, setTotalCtw] = useState(0);
  const [totalGm, setTotalgm] =   useState(0);
  const toWords = new ToWords();
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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

  const loadData = (data) => {
    const copydata = cloneDeep(data);
    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );
    // console.log(datas);

    let metwise = [];

    let finalArr = [];
    datas?.resultArray?.forEach((e, i) => {
      let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      let obj = cloneDeep(e);
      if (findGold !== undefined) {
        obj.metalRate = findGold?.Rate;
        obj.metalAmount = findGold?.Amount;
        obj.metalWeight = findGold?.Wt;
        obj.metalPcs = findGold?.Pcs;
      } else {
        obj.metalRate = 0;
        obj.metalAmount = 0;
        obj.metalWeight = 0;
        obj.metalPcs = 0;
      }
      finalArr.push(obj);
    });
    
    datas.resultArray = finalArr;

    // datas?.resultArray?.forEach((e) => {
    //   let findIndex_ = metwise?.findIndex((a) => a?.MetalPurity === e?.MetalPurity)
    //   let obj = cloneDeep(e);
    //   if(findIndex_ === -1){
    //     obj.OtherCharges_d = 0;
    //     obj.UnitCost_d = 0;
    //     obj.TotalDiaSetcost_d = 0;
    //     obj.TotalDiamondHandling_d = 0;
    //     obj.TotalAmount_d = 0;
    //     obj.MiscAmount_d = 0;
    //     obj.MakingAmount_d = 0;
    //     obj.MetalAmount_d = 0;
    //     obj.grosswt_d = 0;
    //     obj.NetWt_d = 0;
    //     obj.LossWt_d = 0;
    //     obj.total_MakingAmount_Setting_Amount_d = 0;
    //     metwise.push(e);
    //   }else{
    //     metwise[findIndex_].OtherCharges_d += e?.OtherCharges;
    //     metwise[findIndex_].UnitCost_d += e?.UnitCost;
    //     metwise[findIndex_].TotalDiaSetcost_d += e?.TotalDiaSetcost;
    //     metwise[findIndex_].TotalDiamondHandling_d += e?.TotalDiamondHandling;
    //     metwise[findIndex_].TotalDiamondHandling_d += e?.TotalDiamondHandling;
    //     metwise[findIndex_].TotalAmount_d = e?.TotalAmount;
    //     metwise[findIndex_].MiscAmount_d = e?.MiscAmount;
    //     metwise[findIndex_].MakingAmount_d = e?.MakingAmount;
    //     metwise[findIndex_].MetalAmount_d = e?.MetalAmount;
    //     metwise[findIndex_].grosswt_d = e?.grosswt;
    //     metwise[findIndex_].NetWt_d = e?.NetWt;
    //     metwise[findIndex_].LossWt_d = e?.LossWt;
    //     metwise[findIndex_].total_MakingAmount_Setting_Amount_d = e?.total_MakingAmount_Setting_Amount;
    //     metwise[findIndex_].diamond_colorstone_misc = ([...e?.diamond_colorstone_misc]?.flat());
    //   }
    // })
    datas?.resultArray?.forEach((e) => {
      e.misc = [];
      let findRecord = metwise?.findIndex(
        (a) => a?.MetalTypePurity === e?.MetalTypePurity 
        // && a?.metalRate === e?.metalRate
      );
      if (findRecord === -1) {
        let obj = { ...e };
        obj.OtherCharges_d = e?.OtherCharges;
        obj.UnitCost_d = e?.UnitCost;
        obj.TotalDiaSetcost_d = e?.TotalDiaSetcost;
        obj.TotalDiamondHandling_d = e?.TotalDiamondHandling;
        obj.TotalAmount_d = e?.TotalAmount;
        obj.MiscAmount_d = e?.MiscAmount;
        obj.MakingAmount_d = e?.MakingAmount;
        obj.MetalAmount_d = e?.MetalAmount;
        obj.grosswt_d = e?.grosswt;
        obj.NetWt_d = e?.NetWt;
        obj.LossWt_d = e?.LossWt;
        obj.total_MakingAmount_Setting_Amount_d = e?.total_MakingAmount_Setting_Amount;
        obj.totals.metal._Wt = e?.totals?.metal?.Wt;
        obj.totals.metal._IsPrimaryMetal = e?.totals?.metal?.IsPrimaryMetal;
        obj.totals.metal._WithOutPrimaryMetal = e?.totals?.metal?.WithOutPrimaryMetal;
        obj.totals.finding._Wt = e?.totals?.finding?.Wt;
        obj.totals.finding._Pcs = e?.totals?.finding?.Pcs;
        obj.totals.finding._Rate = e?.totals?.finding?.Rate;
        obj.totals.finding._Amount = e?.totals?.finding?.Amount;
        metwise.push(obj);
      } else {
        metwise[findRecord].OtherCharges_d += e?.OtherCharges;
        metwise[findRecord].OtherCharges += e?.OtherCharges;
        metwise[findRecord].UnitCost_d += e?.UnitCost;
        metwise[findRecord].UnitCost += e?.UnitCost;
        metwise[findRecord].TotalDiaSetcost_d += e?.TotalDiaSetcost;
        metwise[findRecord].TotalDiaSetcost += e?.TotalDiaSetcost;
        metwise[findRecord].TotalDiamondHandling_d += e?.TotalDiamondHandling;
        metwise[findRecord].TotalDiamondHandling += e?.TotalDiamondHandling;
        metwise[findRecord].TotalAmount_d += e?.TotalAmount;
        metwise[findRecord].TotalAmount += e?.TotalAmount;
        metwise[findRecord].MiscAmount_d += e?.MiscAmount;
        // metwise[findRecord].MiscAmount += e?.MiscAmount;
        metwise[findRecord].MakingAmount_d += e?.MakingAmount;
        metwise[findRecord].MakingAmount += e?.MakingAmount;
        metwise[findRecord].MetalAmount_d += e?.MetalAmount;
        metwise[findRecord].MetalAmount += e?.MetalAmount;
        metwise[findRecord].grosswt_d += e?.grosswt;
        // metwise[findRecord].grosswt += e?.grosswt;
        metwise[findRecord].NetWt_d += e?.NetWt;
        // metwise[findRecord].NetWt += e?.NetWt;
        metwise[findRecord].LossWt_d += e?.LossWt;
        metwise[findRecord].totals.metal._Wt += e?.totals?.metal?.Wt;
        metwise[findRecord].totals.metal._IsPrimaryMetal += e?.totals?.metal?.IsPrimaryMetal;
        metwise[findRecord].totals.metal._WithOutPrimaryMetal += e?.totals?.metal?.WithOutPrimaryMetal;
        // metwise[findRecord].LossWt += e?.LossWt;
        // metwise[findRecord].total_MakingAmount_Setting_Amount += e?.total_MakingAmount_Setting_Amount;
        metwise[findRecord].total_MakingAmount_Setting_Amount_d += e?.total_MakingAmount_Setting_Amount;
        // metwise[findRecord].diamond_colorstone_misc = [...metwise[findRecord].diamond_colorstone_misc, ...e?.diamond_colorstone_misc].flat()
        metwise[findRecord].diamonds = [...metwise[findRecord].diamonds, ...e?.diamonds].flat()
        metwise[findRecord].colorstone = [...metwise[findRecord].colorstone, ...e?.colorstone].flat()
        metwise[findRecord].metal = [...metwise[findRecord].metal, ...e?.metal].flat()
        // metwise[findRecord].misc = [...metwise[findRecord].misc, ...e?.misc].flat()
        metwise[findRecord].misc = [...metwise[findRecord].misc, ...e?.misc].flat()
        metwise[findRecord].israteonpcsMISC0 = [...metwise[findRecord].israteonpcsMISC0, ...e?.israteonpcsMISC0];
        metwise[findRecord].israteonpcsMISC1 = [...metwise[findRecord].israteonpcsMISC1, ...e?.israteonpcsMISC1];
        metwise[findRecord].finding = [...metwise[findRecord].finding, ...e?.finding].flat()
        metwise[findRecord].totals.finding._Wt += e?.totals?.finding?.Wt;
        metwise[findRecord].totals.finding._Pcs += e?.totals?.finding?.Pcs;
        metwise[findRecord].totals.finding._Rate = e?.totals?.finding?.Rate;
        metwise[findRecord].totals.finding._Amount += e?.totals?.finding?.Amount;
      }
    });
    
    metwise?.forEach((e) => {
      // console.log(e);
        let metwise2 = [];

        // e?.diamond_colorstone_misc?.forEach((a) => {
        //   // console.log(a);
        //   let find_Record = metwise2?.findIndex((el) => el?.MasterManagement_DiamondStoneTypeid === 1 && el?.QualityName === a?.QualityName);
        //   if(find_Record === -1){
        //     let obj = {...a};
        //     obj.a_wt = a?.Wt;
        //     obj.a_pcs = a?.Pcs;
        //     obj.a_rate = a?.Rate;
        //     obj.a_amount = a?.Amount;
        //     metwise2.push(obj);
        //   }else{
        //       metwise2[find_Record].a_wt += a?.Wt;
        //       metwise2[find_Record].a_pcs += a?.Pcs;
        //       // metwise2[find_Record].a_rate += a?.Rate;
        //       metwise2[find_Record].a_amount += a?.Amount;
        //   }
        // })
        // e.diamond_colorstone_misc = metwise2;
        let diaq = [];
        e?.diamonds?.forEach((a) => {
            let findDiarc = diaq?.findIndex((el) => el?.QualityName === a?.QualityName);
            if(findDiarc === -1){
              let obj = {...a};
              obj._wt = a?.Wt;
              obj._pcs = a?.Pcs;
              obj._rate = a?.Rate;
              obj._amount = a?.Amount;
              diaq.push(obj);
            }else{
              diaq[findDiarc]._wt += a?.Wt;
              diaq[findDiarc]._pcs += a?.Pcs;
              diaq[findDiarc]._rate += a?.Rate;
              diaq[findDiarc]._amount += a?.Amount;
            }
        })
        e.diamonds = diaq;
        let clrq1 = [];
        let clrq2 = [];
        let csobj1 = {
          Wt : 0,
          Pcs: 0,
          Rate : 0,
          Amount : 0,
          rate:0,
          isRateOnPcs:1
        }
        let csobj2 = {
          Wt : 0,
          Pcs: 0,
          Rate : 0,
          Amount : 0,
          rate:0,
          isRateOnPcs:0
        }
       
        e?.colorstone?.forEach((a) => {
          if(a?.isRateOnPcs === 1){
              clrq1.push(a);
          }else{
              clrq2.push(a);
          }
          // let findDiarc = clrq?.findIndex((el) => el?.QualityName === a?.QualityName);
            // if(findDiarc === -1){
            //   let obj = {...a};
            //   obj._wt = a?.Wt;
            //   obj._pcs = a?.Pcs;
            //   obj._rate = a?.Rate;
            //   obj._amount = a?.Amount;
            //   clrq.push(obj);
            // }else{
            //   clrq[findDiarc]._wt += a?.Wt;
            //   clrq[findDiarc]._pcs += a?.Pcs;
            //   clrq[findDiarc]._rate += a?.Rate;
            //   clrq[findDiarc]._amount += a?.Amount;
            // }
        })
        clrq1?.forEach((e) => {
          csobj1.Wt += e?.Wt;
          csobj1.Pcs += e?.Pcs;
          csobj1.Rate = e?.Rate;
          csobj1.Amount += e?.Amount;
        })
        clrq1 = [];
        if(csobj1?.Wt === 0 && csobj1?.Pcs === 0 && csobj1?.Rate === 0 && csobj1?.Amount === 0){
          return
        }else{
          clrq1.push(csobj1);
        }
        clrq2?.forEach((e) => {
          csobj2.Wt += e?.Wt;
          csobj2.Pcs += e?.Pcs;
          csobj2.Rate = e?.Rate;
          csobj2.Amount += e?.Amount;
        })
        clrq2 = [];
        if(csobj2?.Wt === 0 && csobj2?.Pcs === 0 && csobj2?.Rate === 0 && csobj2?.Amount === 0){
          return
        }else{
          clrq2.push(csobj2);
        }
        e.colorstone = [...clrq1, ...clrq2];
        
        // let m1 = [];
        // let m2 = [];

        // e?.misc?.forEach((a) => {
        //   console.log(a);
        //     if(a?.isRateOnPcs === 1) {
        //       m1.push(a)
        //     }else{
        //       m2.push(a);
        //     }
        // })

        // let mobj1 = {
        //   Wt:0,
        //   Rate:0,
        //   Pcs: 0,
        //   Amount : 0,
        //   ServWt:0
        // }
        // let mobj2 = {
        //   Wt:0,
        //   Rate:0,
        //   Pcs: 0,
        //   Amount : 0,
        //   ServWt:0
        // }
        // m1?.forEach((e) => {
        //   if(e?.IsHSCOE === 0){
        //     mobj1.Wt += e?.Wt;
        //   }else{
        //     mobj1.ServWt += e?.ServWt;
        //     mobj1.Wt += e?.ServWt;
        //   }
        //   mobj1.Rate = e?.Rate;
        //   mobj1.Pcs += e?.Pcs;
        //   mobj1.Amount += e?.Amount;
        // })
        // m2?.forEach((e) => {
        //   if(e?.IsHSCOE === 0){
        //     mobj2.Wt += e?.Wt;
        //   }else{
        //     mobj2.ServWt += e?.ServWt;
        //     mobj2.Wt += e?.ServWt;
        //   }
        //   mobj2.Rate = e?.Rate;
        //   mobj2.Pcs += e?.Pcs;
        //   mobj2.Amount += e?.Amount;
        // })

        // m1 = [];
        // m2 = [];

        // if(mobj1?.Wt === 0 && mobj1?.ServWt === 0 && mobj1?.Pcs === 0 && mobj1?.Rate === 0 && mobj1?.Amount === 0){
        //   // return
        // }else{
        //   m1.push(mobj1);
        // }
        // if(mobj2?.Wt === 0 && mobj2?.ServWt === 0 && mobj2?.Pcs === 0 && mobj2?.Rate === 0 && mobj2?.Amount === 0){
        //   // return
        // }else{
        //   m2.push(mobj2);
        // }
        
        // e.misc = [...m1, ...m2];
        // console.log(mobj1, mobj2);

        
      })
      
    metwise?.forEach((el) => {
      let arr = [];
      let sarr = [];
      let obj1 = {
        Wt:0,
        Pcs:0,
        Rate:0,
        Amount:0,
        ServWt:0,
        isRateOnPcs:0,
        // rate:0
      }
      let obj2 = {
        Wt:0,
        Pcs:0,
        Rate:0,
        Amount:0,
        ServWt:0,
        isRateOnPcs:1,
        // rate:0
      }
      el?.israteonpcsMISC0?.forEach((a) => {
        obj1.Amount += a?.Amount;
        obj1.Pcs += a?.Pcs;
        obj1.Rate = a?.Rate;
        obj1.Wt += a?.Wt;
        obj1.ServWt += a?.ServWt;
        // obj1.rate += a?.Rate;
      })
      el?.israteonpcsMISC1?.forEach((a) => {
        obj2.Amount += a?.Amount;
        obj2.Pcs += a?.Pcs;
        obj2.Rate = a?.Rate;
        obj2.Wt += a?.Wt;
        obj2.ServWt += a?.ServWt;
        // obj2.rate += a?.Rate;
      })
      if(obj1?.Wt === 0 && obj1?.ServWt && obj1?.Pcs === 0 && obj1?.Rate === 0 && obj1?.Amount === 0){
          return 
      }else{
        arr.push(obj1);
      }
      if(obj2?.Wt === 0 && obj2?.ServWt && obj2?.Pcs === 0 && obj2?.Rate === 0 && obj2?.Amount === 0){
          return 
      }else{
        sarr.push(obj2);
      }
      el.israteonpcsMISC0 = arr;
      el.israteonpcsMISC1 = sarr;
    })


      // metwise?.sort((a, b) => {
      //   const qualityA = parseInt(a?.MetalPurity);
      //   const qualityB = parseInt(b?.MetalPurity);
      //   return qualityA - qualityB;
      // });
    //   console.log(metwise);
      let tot_obj = {
        pcs:0,
        wt:0,
        rate:0,
        amount:0
      }
      // metwise?.forEach((e) => {
      //   e?.diamond_colorstone_misc?.forEach((el) => {
      //     tot_obj.pcs += el?.a_pcs;
      //     tot_obj.wt += el?.a_wt;
      //     tot_obj.rate += el?.a_rate;
      //     tot_obj.amount += el?.a_amount;
      //   })
      // })
      // datas?.resultArray?.forEach((e) => {
      //   datas?.json2?.forEach((el) => {
      //     if(el?.MasterManagement_DiamondStoneTypeid === 3 && e?.SrJobno === el?.StockBarcode){
      //       e?.misc?.push(el);
      //     }
      //   })
      // })
      // metwise?.forEach((el) => {
        
      //   el?.israteonpcsMISC0?.forEach((a) => {
      //     let b = Object.values(a)
      //     let c = b.every((e) => e === 0);
      //     console.log(c);

      //     if(c){
      //       delete a;
      //     }

      //   })
      // })
      metwise?.forEach((el) => {
        el?.israteonpcsMISC0?.forEach((a, index) => { // Add index parameter for splice
            let b = Object.values(a)
            let c = b.every((e) => e === 0);
    
            if (c) {
                // Delete the element from the array if all values are 0
                el?.israteonpcsMISC0.splice(index, 1); // Remove the element at the current index
            }
        })
        el?.israteonpcsMISC1?.forEach((a, index) => { // Add index parameter for splice
            let b = Object.values(a)
            let c = b.every((e) => e === 0);
    
            if (c) {
                // Delete the element from the array if all values are 0
                el?.israteonpcsMISC1.splice(index, 1); // Remove the element at the current index
            }
        })
    })


    let ctw = 0;
    let gmm = 0;

    metwise?.forEach((e) => {
      e?.diamonds?.forEach((el) => {
        ctw += el?.Wt;
      })
      e?.colorstone?.forEach((el) => {
        ctw += el?.Wt;
      })
      // gmm += e?.totals?.misc?.Wt;
      // // e?.misc?.forEach((el) => {
      // //   gmm += el?.Wt;
      // // })
      // e?.misc?.forEach((el) => {
      //   gmm +=  el?.ServWt;
      // })
      // e?.metal?.forEach((el) => {
      //   gmm += el?.Wt;
      // })
      // gmm += e?.totals?.finding?._Wt;
      // e?.finding?.forEach((el) => {
      //   gmm += el?.Wt;
      // })
    })


      setTotalCtw(ctw);
      setTotalgm(gmm);
      setTotObj(tot_obj);
      setMetWise(metwise);
      setResult(datas);
      console.log(metwise);

  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="container_ji2">
              <div className="endc_ji2 d_none_ji2"><button
                    className="btn_white blue m-0 "
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button></div>
              <div>
                <div className="headlabel_ji2"> {result?.header?.PrintHeadLabel} </div>
                <div className="fs_ji2 lh_ji2 pb-2"> <div className="fw-bold fs_2_ji2"> {result?.header?.CompanyFullName} </div>
                  <div>{result?.header?.CompanyAddress}</div>
                   <div>{result?.header?.CompanyAddress2}</div>
                  <div>
                    {result?.header?.CompanyCity}- {result?.header?.CompanyPinCode},{" "} {result?.header?.CompanyState}( {result?.header?.CompanyCountry})
                  </div>
                  <div>
                    T {result?.header?.CompanyTellNo} | TOLL FREE{" "} {result?.header?.CompanyTollFreeNo}
                  </div>
                  <div>
                    {result?.header?.CompanyEmail} |{" "} {result?.header?.CompanyWebsite}
                  </div>
                  <div>
                    {result?.header?.Company_VAT_GST_No} |{" "} {result?.header?.Company_CST_STATE}- {result?.header?.Company_CST_STATE_No} |{" "} PAN - {" "} {result?.header?.Com_pannumber} </div>
                  <div>CIN - {result?.header?.CINNO}</div>
                </div>
              </div>
              <div className="d-flex border fs_ji2 lh_ji2">
                <div className="w33_ji2 border-end p-1 fs_ji2 lh_ji2">
                  <div>{result?.header?.lblBillTo}</div>
                  <div className="fw-bold">{result?.header?.customerfirmname}</div>
                  <div>{result?.header?.customerAddress1}</div>
                  <div>{result?.header?.customerAddress2}</div>
                  <div>
                    {result?.header?.customercity} {result?.header?.customerpincode}
                  </div>
                  <div>{result?.header?.customeremail1}</div>
                  <div>{result?.header?.Cust_CST_STATE_No_}</div>
                  <div>
                    GSTIN - {result?.header?.CustGstNo} | PAN -{" "} {result?.header?.CustPanno}
                  </div>
                  <div>
                    <b>Place Of Supply :</b> {result?.header?.customerstate}
                  </div>
                </div>
                <div className="w33_ji2 border-end p-1 fs_ji2 lh_ji2">
                  <div>Ship To,</div>
                  <div className="fw-bold"> {result?.header?.customerfirmname} </div> <div>{result?.header?.CustName}</div> 
                  <div> {result?.header?.customercity},{" "} {result?.header?.customerstate} </div>
                  <div> {result?.header?.customercountry} {result?.header?.customerpincode} </div>
                  <div>{result?.header?.customermobileno}</div>
                </div>
                <div className="w33_ji2 p-1 fs_ji2 lh_ji2">
                  <div className="d-flex">
                    <div className="w-25 fw-bold">VOUCHER</div> <div className="w-50">{result?.header?.InvoiceNo}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-25 fw-bold">DATE</div> <div className="w-50">{result?.header?.EntryDate}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-25 fw-bold"> {result?.header?.HSN_No_Label} </div> <div className="w-50">{result?.header?.HSN_No}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-25 fw-bold"> DUE DATE </div> <div className="w-50">{result?.header?.DueDate}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-25 fw-bold"> DUE DAYS </div> <div className="w-50">{result?.header?.DueDays}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex fw-bold border mt-2 fs_ji2 lh_ji2 h30_ji2">
                  <div className="col1_ji2 border-end center_ji2">SR#</div>
                  <div className="col2_ji2 border-end center_ji2">
                    Description
                  </div>
                  <div className="col3_ji2 border-end center_ji2">Material</div>
                  <div className="col4_ji2 border-end center_ji2">Pcs</div>
                  <div className="col5_ji2 border-end center_ji2">Wt.</div>
                  <div className="col6_ji2 border-end center_ji2">Rate</div>
                  <div className="col7_ji2 border-end center_ji2">Amount</div>
                  <div className="col8_ji2 border-end center_ji2">
                    Labour Amt
                  </div>
                  <div className="col9_ji2 border-end center_ji2">
                    Other charges
                  </div>
                  <div className="col10_ji2 center_ji2">Total Amount</div>
                </div>
                <div>
                  {metWise?.map((e, i) => {
                    return (
                      <div className="d-flex border border-top-0 fs_ji2 lh_ji2" key={i}>
                        <div className="col1_ji2 border-end center_ji2 d-flex justify-content-center align-items-start pt-2">
                          {i + 1}
                        </div>
                        <div className="col2_ji2 border-end pad_start_ji2"> {" "} New Jewellery <br /> <b>{e?.grosswt_d?.toFixed(3)}</b> gm Gross </div>
                        <div className="col3_ji2 border-end " style={{ width: "42%" }} >
                          <div className="d-flex border-bottom">
                            <div className="border-end pad_start_ji2" style={{ width: "26%" }} > {e?.MetalTypePurity} </div>
                            <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} ></div>
                            <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {(e?.totals?.metal?._IsPrimaryMetal)?.toFixed(3)} </div>
                            <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > { formatAmount( (e?.MetalAmount)/(e?.totals?.metal?._IsPrimaryMetal)) } </div>
                            <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {formatAmount(e?.MetalAmount)} </div>
                          </div>
                          {/* {e?.metal?.map((el, ind) => {
                            return (
                              <div className="d-flex border-bottom fs_ji2 lh_ji2" key={ind}>
                                <div className="border-end pad_start_ji2" style={{ width: "26%" }} > {el?.MasterManagement_DiamondStoneTypeName} <span>{ el?.MasterManagement_DiamondStoneTypeid === 4 ? el?.QualityName : ''}</span> </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > {el?.a_pcs} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {el?.a_wt?.toFixed(3)} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > {formatAmount(el?.a_rate)} </div>
                                <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {formatAmount(el?.a_amount)} </div>
                              </div>
                            );
                          })} */}
                          {e?.diamonds?.map((el, ind) => {
                            return (
                              <div className="d-flex border-bottom fs_ji2 lh_ji2" key={ind}>
                                <div className="border-end pad_start_ji2" style={{ width: "26%" }} > {el?.MasterManagement_DiamondStoneTypeName} <span>{ el?.MasterManagement_DiamondStoneTypeid === 1 ? el?.QualityName : ''}</span> </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > {el?._pcs} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {el?._wt?.toFixed(3)} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > {formatAmount((el?._amount/el?._wt))} </div>
                                <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {formatAmount(el?._amount)} </div>
                              </div>
                            );
                          })}
                          {e?.colorstone?.map((el, ind) => {
                            return (
                              <div className="d-flex border-bottom fs_ji2 lh_ji2" key={ind}>
                                {/* <div className="border-end pad_start_ji2" style={{ width: "26%" }} > {el?.MasterManagement_DiamondStoneTypeName} <span></span> </div> */}
                                <div className="border-end pad_start_ji2" style={{ width: "26%" }} > COLORSTONE <span></span> </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > {el?.Pcs} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {el?.Wt?.toFixed(3)} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > {formatAmount((el?.Amount / (el?.isRateOnPcs === 1 ? (el?.Pcs === 0 ? 1 : el?.Pcs) : (el?.Wt === 0 ? 1 : el?.Wt))))} </div>
                                <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {formatAmount(el?.Amount)} </div>
                              </div>
                            );
                          })}

                          
                           {e?.israteonpcsMISC0?.map((el, ind) => {
                            
                            return (
                              <div className="d-flex border-bottom fs_ji2 lh_ji2" key={ind}>
                                <div className="border-end pad_start_ji2" style={{ width: "26%" }} >  <span>MISC {el?.IsHSCOE}</span> </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > {el?.Pcs} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {(el?.Wt + el?.ServWt)?.toFixed(3)} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > {formatAmount(el?.Rate)} </div>
                                <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {formatAmount(el?.Amount)} </div>
                              </div>
                            );
                          })}
                          {e?.israteonpcsMISC1?.map((el, ind) => {
                            return (
                              <div className="d-flex border-bottom fs_ji2 lh_ji2" key={ind}>
                                <div className="border-end pad_start_ji2" style={{ width: "26%" }} >  <span>MISC {el?.IsHSCOE}</span> </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > {el?.Pcs} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {(el?.Wt + el?.ServWt)?.toFixed(3)} </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > {formatAmount((el?.Amount / el?.Pcs))} </div>
                                <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {formatAmount(el?.Amount)} </div>
                              </div>
                            );
                          })}
                              <div className="d-flex border-bottom fs_ji2 lh_ji2">
                                <div className="border-end pad_start_ji2" style={{ width: "26%" }} >  </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {e?.totals?.metal?._WithOutPrimaryMetal === 0 ? '' : e?.totals?.metal?._WithOutPrimaryMetal}  </div>
                                <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} >  </div>
                                <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} >   </div>
                            </div>
                            {
                              e?.totals?.finding?._Wt === 0 &&
                              e?.totals?.finding?._Pcs === 0 &&
                              e?.totals?.finding?._Rate === 0 &&
                              e?.totals?.finding?._Amount === 0 ? '' : <div className="d-flex border-bottom fs_ji2 lh_ji2">
                              <div className="border-end pad_start_ji2" style={{ width: "26%" }} > </div>
                              <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "14.4%" }} > {e?.totals?.finding?._Pcs === 0 ? '' : e?.totals?.finding?._Pcs} </div>
                              <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "16.6%" }} > {e?.totals?.finding?._Wt === 0 ? '' : e?.totals?.finding?._Wt} </div>
                              <div className="border-end pad_end_ji2 endc_ji2" style={{ width: "17%" }} > {e?.totals?.finding?._Rate === 0 ? '' : e?.totals?.finding?._Rate} </div>
                              <div className="pad_end_ji2 endc_ji2" style={{ width: "26%" }} > {e?.totals?.finding?._Amount === 0 ? '' : e?.totals?.finding?._Amount} </div>
                          </div>

                            }
                        
                        </div>
                        <div className="col8_ji2 border-end pad_end_ji2 endc_ji2">
                          {formatAmount(e?.TotalDiaSetcost + e?.MakingAmount)}
                        </div>
                        <div className="col9_ji2 border-end pad_end_ji2 endc_ji2">
                          {formatAmount( e?.TotalDiamondHandling + e?.OtherCharges )}
                        </div>
                        <div className="col10_ji2 pad_end_ji2 endc_ji2">
                          {formatAmount(e?.TotalAmount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex fw-bold border border-top-0 fs_ji2 lh_ji2 h40_ji2">
                  <div className="col1_ji2 border-end"></div>
                  <div className="col2_ji2 border-end d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center w-100 px-2"><div>TOTAL</div><div>{result?.mainTotal?.grosswt?.toFixed(3)} gm Gross</div></div>
                  </div>
                  <div className="col3_ji2 border-end"></div>
                  <div className="col4_ji2 border-end endc_ji2 pad_end_ji2">
                    {/* {result?.mainTotal?.diamond_colorstone_misc?.Pcs} */}
                    {/* {totobj?.pcs} */}
                    {result?.mainTotal?.metal?.Pcs + result?.mainTotal?.diamonds?.Pcs + result?.mainTotal?.colorstone?.Pcs + result?.mainTotal?.misc?.Pcs  }
                  </div>
                  <div className="col5_ji2 border-end center_ji2">
                    {console.log(result)}
                     {(result?.mainTotal?.diamonds?.Wt + result?.mainTotal?.colorstone?.Wt)} ctw <br />
                     {((result?.mainTotal?.misc?.Wt + result?.mainTotal?.misc?.allservwt + result?.mainTotal?.metal?.Wt + result?.mainTotal?.finding?.Wt)?.toFixed(3))} gm
                     {/* {(totalCtw)} ctw <br /> {((totalGm))} gm */}
                    {/* {result?.mainTotal?.diamond_colorstone_misc?.Wt?.toFixed(3)} Ctw <br /> 43.476 gm */}
                    {/* {totobj?.wt?.toFixed(3)} Ctw <br /> 43.476 gm */}
                  </div>
                  <div className="col6_ji2 border-end"></div>
                  <div className="col7_ji2 border-end endc_ji2 pad_end_ji2">
                    {formatAmount((result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.colorstone?.Amount + result?.mainTotal?.misc?.Amount + result?.mainTotal?.MetalAmount))}
                  </div>
                  <div className="col8_ji2 border-end endc_ji2 pad_end_ji2">
                    {/* {formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)} */}
                    {formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.total_TotalCsSetcost + result?.mainTotal?.total_TotalDiaSetcost))}
                  </div>
                  <div className="col9_ji2 border-end endc_ji2 pad_end_ji2">
                    { formatAmount((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling)) }
                  </div>
                  <div className="col10_ji2 endc_ji2 pad_end_ji2">
                    {formatAmount(result?.mainTotal?.total_unitcost)}
                  </div>
                </div>
              </div>
              <div className="d-flex border border-top-0">
                <div className="border-end p-1 d-flex flex-column justify-content-end fs_ji2 lh_ji2 " style={{width:'70%'}}>
                   In Words Indian Rupees <br />
                  <b>{toWords?.convert(+((result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess)?.toFixed(2)))} Only /-</b>
                </div>
                <div  style={{width:'30%'}}>
                   {result?.mainTotal?.total_discount_amount > 0 ?<div className="fs_ji2 lh_ji2 d-flex"><div className="w-50 border-end endc_ji2 pe-2">Discount</div><div className="w-50 endc_ji2 pad_end_ji2">{formatAmount(result?.mainTotal?.total_discount_amount)}</div></div> : '' } 
                  <div className="d-flex fw-bold fs_ji2 lh_ji2"><div className="w-50 border-end pe-2 endc_ji2">Amount</div><div className="w-50 endc_ji2 pad_end_ji2">{formatAmount(result?.mainTotal?.total_amount)}</div></div>
                  {
                    result?.allTaxes?.map((e, i) => {
                      return(
                        <div className="d-flex fs_ji2 lh_ji2" key={i}>
                          <div className="w-50 border-end endc_ji2 pe-2">{e?.name} @ {e?.per}</div>
                          <div className="w-50 endc_ji2 pad_end_ji2">{formatAmount(e?.amount)}</div>
                        </div>
                      )
                    })
                  }
                  {/* {console.log(result)} */}
                  <div className="d-flex fs_ji2 lh_ji2"><div className="w-50 border-end endc_ji2 pe-2">{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div><div className="w-50 endc_ji2 pad_end_ji2">{result?.header?.AddLess}</div></div>
                  {/* <div className="d-flex fs_ji2 lh_ji2 border-top fw-bold"><div className="w-50 border-end p-1 endc_ji2 pad_end_ji2">Grand Total</div><div className="w-50 p-1 endc_ji2 pad_end_ji2">{formatAmount(result?.finalAmount)}</div></div> */}
                  <div className="d-flex fs_ji2 lh_ji2 border-top fw-bold"><div className="w-50 border-end p-1 endc_ji2 pad_end_ji2">Grand Total</div><div className="w-50 p-1 endc_ji2 pad_end_ji2">{formatAmount((result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess))}</div></div>
                </div>
              </div>
               <div className="fw-bold p-1 fs_ji2 lh_ji2 border border-top-0"><div className="fw-bold">Declaration :</div><div className="fs_jivp2_dec" dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div></div>
               <div className="fs_ji2 lh_ji2 p-1 border border-top-0"><b>REMARKS : &nbsp;&nbsp;</b>{result?.header?.PrintRemark}</div>
               <div className='d-flex border border-top-0 fs_ji2 lh_ji2'>
                <div className='w33_ji2 border-end p-1'>
                  <div className='fw-bold'>Bank Detail</div>
                  <div>Bank Name: {result?.header?.bankname}</div>
                  <div>Branch: {result?.header?.bankaddress}</div>
                  <div>Account Name: {result?.header?.accountname}</div>
                  <div>Account No. : {result?.header?.accountnumber}</div>
                  <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
                  {/* <div>Enquiry No. (E & OE)</div> */}
                </div>
                <div className='w33_ji2 d-flex flex-column justify-content-between border-end p-1 '>
                  <div>Signature</div>
                  <div className='fw-bold'>{result?.header?.customerfirmname}</div>
                </div>
                <div className='w33_ji2 d-flex flex-column justify-content-between p-1'>
                  <div>Signature</div>
                  <div className='fw-bold'>{result?.header?.CompanyFullName}</div>
                </div>
              </div>
            </div>
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

export default JewelleryInvoice2;
;