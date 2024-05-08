import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import "../../assets/css/prints/packinglist7.css";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";

const PackingList7 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [diamondWise, setDiamondWise] = useState([]);
  const [imgFlag, setImgFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);


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
        console.log(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadData(data) {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
      console.log(datas);
      //grouping of jobs and isGroupJob is 1
   
      let finalArr = [];

      datas?.resultArray?.forEach((a) => {
        if(a?.GroupJob === ''){
          finalArr.push(a);
      }else{
        let b = cloneDeep(a);
        let find_record = finalArr.findIndex((el) => el?.GroupJob === b?.GroupJob);
        if(find_record === -1){
          finalArr.push(b);
        }else{
          if(finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno){
              finalArr[find_record].designno = b?.designno;
              finalArr[find_record].HUID = b?.HUID; 
          }
          finalArr[find_record].grosswt += b?.grosswt;
          finalArr[find_record].NetWt += b?.NetWt;
          finalArr[find_record].LossWt += b?.LossWt;
          finalArr[find_record].TotalAmount += b?.TotalAmount;
          finalArr[find_record].DiscountAmt += b?.DiscountAmt;
          finalArr[find_record].UnitCost += b?.UnitCost;
          finalArr[find_record].MakingAmount += b?.MakingAmount;
          finalArr[find_record].OtherCharges += b?.OtherCharges;
          finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
          finalArr[find_record].Quantity += b?.Quantity;
          finalArr[find_record].Wastage += b?.Wastage;
          finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
          finalArr[find_record].diamonds = [...finalArr[find_record]?.diamonds, ...b?.diamonds]?.flat();
          // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
          finalArr[find_record].colorstone = [...finalArr[find_record]?.colorstone, ...b?.colorstone]?.flat();
          // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
          finalArr[find_record].metal = [...finalArr[find_record]?.metal, ...b?.metal]?.flat();
          finalArr[find_record].misc = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount += b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs += b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount += b?.totals?.colorstone?.Amount;
          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.allservwt += b?.totals?.misc?.allservwt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.metal.IsPrimaryMetal_Amount += b?.totals?.metal?.IsPrimaryMetal_Amount;
          finalArr[find_record].totals.misc.withouthscode1_2_pcs += b?.totals?.misc?.withouthscode1_2_pcs;
          finalArr[find_record].totals.misc.withouthscode1_2_wt += b?.totals?.misc?.withouthscode1_2_wt;
          finalArr[find_record].totals.misc.onlyHSCODE3_amt += b?.totals?.misc?.onlyHSCODE3_amt;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Wt += b?.totals?.misc?.onlyIsHSCODE0_Wt;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Pcs += b?.totals?.misc?.onlyIsHSCODE0_Pcs;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Amount += b?.totals?.misc?.onlyIsHSCODE0_Amount;
          // finalArr[find_record].misc_d = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
        }
      }
      })
  
      datas.resultArray = finalArr;

      //after groupjob
      datas?.resultArray?.forEach((e) => {

        //diamond
        let dia2 = [];

        e?.diamonds?.forEach((el) => {
          let findrec = dia2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname)
          if(findrec === -1){
            dia2.push(el);
          }else{
              dia2[findrec].Wt += el?.Wt;
              dia2[findrec].Pcs += el?.Pcs;
              dia2[findrec].Amount += el?.Amount;
              dia2[findrec].Rate += el?.Rate;
              if(dia2[findrec]?.SizeName !== el?.SizeName){
                dia2[findrec].SizeName = 'Mix'
              }
          }

        })
        e.diamonds = dia2

        //colorstone
        let clr_rop0 = []; //wt
        let clr_rop1 = []; //pcs

        e?.colorstone?.forEach((el) => {
          if(el?.isRateOnPcs === 0){
            clr_rop0?.push(el)
          }else{
            clr_rop1?.push(el)
          }
        })
        let clr2 = [];
        let clr2_2 = [];
        let clr_all = [];

        clr_rop0?.forEach((el) => {
          let findrec = clr2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname)
          if(findrec === -1){
            clr2.push(el);
          }else{
              clr2[findrec].Wt += el?.Wt;
              clr2[findrec].Pcs += el?.Pcs;
              clr2[findrec].Amount += el?.Amount;
              clr2[findrec].Rate += el?.Rate;
              if(clr2[findrec]?.SizeName !== el?.SizeName){
                clr2[findrec].SizeName = 'Mix'
              }
          }

        });
        
        clr_rop0 = clr2;

        // clr_all.push(clr_rop0)

        clr_rop1?.forEach((el) => {
          let findrec = clr2_2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname)
          if(findrec === -1){
            clr2_2.push(el);
          }else{
              clr2_2[findrec].Wt += el?.Wt;
              clr2_2[findrec].Pcs += el?.Pcs;
              clr2_2[findrec].Amount += el?.Amount;
              clr2_2[findrec].Rate += el?.Rate;
              if(clr2_2[findrec]?.SizeName !== el?.SizeName){
                clr2_2[findrec].SizeName = 'Mix'
              }
          }

        });

        clr_rop1 = clr2_2;
        
        clr_all.push(clr_rop0)
        clr_all.push(clr_rop1)
        

        e.colorstone = [...clr_all]?.flat();

        //misc
        let misc0 = [];
        e?.misc?.forEach((el) => {
          if(el?.IsHSCOE === 0){
            misc0?.push(el);
          }
        })

        e.misc = misc0;

        let met2 = [];
        // console.log(e?.metal);
        e?.metal?.forEach((a) => {
          if(e?.GroupJob !== ''){
            let obj = {...a};
            obj.GroupJob = e?.GroupJob;
            met2?.push(obj);
          }
        })
        
        let met3 = [];
        met2?.forEach((a) => {
          let findrec = met3?.findIndex((el) => (el?.StockBarcode === el?.GroupJob))
          if(findrec === -1){
            met3?.push(a);
          }else{
            met3[findrec].Wt += a?.Wt;
          }
        })
        if(e?.GroupJob === ''){
          return 
        }else{
          e.metal = met3;
        }
        
      })

    let diaObj = {
      ShapeName: "OTHERS",
      wtWt: 0,
      wtWts: 0,
      pcPcs: 0,
      pcPcss: 0,
      rRate: 0,
      rRates: 0,
      amtAmount: 0,
      amtAmounts: 0,
    };

    let diaonlyrndarr1 = [];
    let diaonlyrndarr2 = [];
    let diaonlyrndarr3 = [];
    let diaonlyrndarr4 = [];
    let diarndotherarr5 = [];
    let diaonlyrndarr6 = [];
    datas?.json2?.forEach((e) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        if (e.ShapeName?.toLowerCase() === "rnd") {
          diaonlyrndarr1.push(e);
        } else {
          diaonlyrndarr2.push(e);
        }
      }
    });

    diaonlyrndarr1?.forEach((e) => {
      let findRecord = diaonlyrndarr3.findIndex(
        (a) =>
          e?.StockBarcode === a?.StockBarcode &&
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );

      if (findRecord === -1) {
        let obj = { ...e };
        obj.wtWt = e?.Wt;
        obj.pcPcs = e?.Pcs;
        obj.rRate = e?.Rate;
        obj.amtAmount = e?.Amount;
        diaonlyrndarr3.push(obj);
      } else {
        diaonlyrndarr3[findRecord].wtWt += e?.Wt;
        diaonlyrndarr3[findRecord].pcPcs += e?.Pcs;
        diaonlyrndarr3[findRecord].rRate += e?.Rate;
        diaonlyrndarr3[findRecord].amtAmount += e?.Amount;
      }
    });

    diaonlyrndarr2?.forEach((e) => {
      let findRecord = diaonlyrndarr4.findIndex(
        (a) =>
          e?.StockBarcode === a?.StockBarcode &&
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );

      if (findRecord === -1) {
        let obj = { ...e };
        obj.wtWt = e?.Wt;
        obj.wtWts = e?.Wt;
        obj.pcPcs = e?.Pcs;
        obj.pcPcss = e?.Pcs;
        obj.rRate = e?.Rate;
        obj.rRates = e?.Rate;
        obj.amtAmount = e?.Amount;
        obj.amtAmounts = e?.Amount;
        diaonlyrndarr4.push(obj);
      } else {
        diaonlyrndarr4[findRecord].wtWt += e?.Wt;
        diaonlyrndarr4[findRecord].wtWts += e?.Wt;
        diaonlyrndarr4[findRecord].pcPcs += e?.Pcs;
        diaonlyrndarr4[findRecord].pcPcss += e?.Pcs;
        diaonlyrndarr4[findRecord].rRate += e?.Rate;
        diaonlyrndarr4[findRecord].rRates += e?.Rate;
        diaonlyrndarr4[findRecord].amtAmount += e?.Amount;
        diaonlyrndarr4[findRecord].amtAmounts += e?.Amount;
      }
    });

    diaonlyrndarr4?.forEach((e) => {
      diaObj.wtWt += e?.wtWt;
      diaObj.wtWts += e?.wtWts;
      diaObj.pcPcs += e?.pcPcs;
      diaObj.pcPcss += e?.pcPcss;
      diaObj.rRate += e?.rRate;
      diaObj.rRates += e?.rRates;
      diaObj.amtAmount += e?.amtAmount;
      diaObj.amtAmounts += e?.amtAmounts;
    });
    
    diaonlyrndarr3?.forEach((e) => {
      let find_record = diaonlyrndarr6?.findIndex(
        (a) =>
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );
      if (find_record === -1) {
        let obj = { ...e };
        obj.wtWts = e?.wtWt;
        obj.pcPcss = e?.pcPcs;
        obj.rRates = e?.rRate;
        obj.amtAmounts = e?.amtAmount;
        diaonlyrndarr6.push(obj);
      }else{
        diaonlyrndarr6[find_record].wtWts += e?.wtWt;
        diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
        diaonlyrndarr6[find_record].rRates += e?.rRate;
        diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
      }
    });

    diarndotherarr5 = [...diaonlyrndarr6, diaObj];
    setDiamondWise(diarndotherarr5);
    setResult(datas);
  }

  const handleCheckbox = () => {
    if (imgFlag) {
      setImgFlag(false);
    } else {
      setImgFlag(true);
    }
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerdp10_pcl7 pab60_dp10_pcl7">
                <div className="d-flex justify-content-end align-items-center hidebtndp10_pcl7 mb-4">
                  <input type="checkbox" id="imghideshow" className="mx-1" checked={imgFlag} onChange={handleCheckbox} />
                  <label htmlFor="imghideshow" className="me-3 user-select-none">
                    With Image
                  </label>
                  <button className="btn_white blue mb-0 hidedp10_pcl7 m-0 p-2" onClick={(e) => handlePrint(e)} >
                    Print
                  </button>
                  
                </div>
                {/* header */}
                <div>
                  <div className="pheaddp10_pcl7">
                    {result?.header?.PrintHeadLabel}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="p-1 fsgdp10_pcl7_2">
                      <div className="fw-bold fs-6 py-2">
                        {result?.header?.CompanyFullName}
                      </div>
                      <div>{result?.header?.CompanyAddress}</div>
                      <div>{result?.header?.CompanyAddress2}</div>
                      <div>{result?.header?.CompanyCity}</div>
                      <div>
                        {result?.header?.CompanyCity}-
                        {result?.header?.CompanyPinCode},{" "}
                        {result?.header?.CompanyState}(
                        {result?.header?.CompanyCountry})
                      </div>
                      <div>T {result?.header?.CompanyTellNo}</div>
                      <div>
                        {result?.header?.CompanyEmail} |{" "}
                        {result?.header?.CompanyWebsite}
                      </div>
                      <div>
                        {result?.header?.Company_VAT_GST_No} |{" "}
                        {result?.header?.Company_CST_STATE}-
                        {result?.header?.Company_CST_STATE_No} | PAN-
                        {result?.header?.Pannumber}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end pe-2 pt-2">
                    {isImageWorking && (result?.header?.PrintLogo !== "" && 
                      <img src={result?.header?.PrintLogo} alt="" className='w-100 h-auto ms-auto d-block object-fit-contain' onError={handleImageErrors} height={120} width={150} style={{maxWidth: "116px"}} />)}
                      {/* <img
                        src={result?.header?.PrintLogo}
                        alt="#companylogo"
                        className="imgHWdp10"
                      /> */}
                    </div>
                  </div>
                </div>
                {/* subheader */}
                <div className="subheaderdp10_pcl7">
                  <div className="subdiv1dp10_pcl7 border-end fsgdp10_pcl7_2 border-start ">
                    <div className="px-1">{result?.header?.lblBillTo}</div>
                    <div className="px-1 fw-bold fsgdp10_pcl7_3">
                      {result?.header?.customerfirmname}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress2}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress1}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress3}
                    </div>
                    <div className="px-1">
                      {result?.header?.customercity1}-{result?.header?.PinCode}
                    </div>
                    <div className="px-1">{result?.header?.customeremail1}</div>
                    <div className="px-1">{result?.header?.vat_cst_pan}</div>
                    <div className="px-1">
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subdiv2dp10_pcl7 border-end fsgdp10_pcl7_2">
                    <div className="px-1">Ship To,</div>
                    <div className="px-1 fsgdp10_pcl7_3 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    {result?.header?.address?.map((e, i) => {
                      return (
                        <div className="px-1" key={i}>
                          {e}
                        </div>
                      );
                    })}
                  </div>
                  <div className="subdiv3dp10_pcl7 fsgdp10_pcl7_2 border-end">
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">BILL NO</div>
                      <div className="w-25">{result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">DATE</div>
                      <div className="w-25">{result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">
                        {result?.header?.HSN_No_Label}
                      </div>
                      <div className="w-25">{result?.header?.HSN_No}</div>
                    </div>
                    {/* <div className="d-flex justify-content-end mt-5 px-2 fw-bold">
                      Gold Rate {result?.header?.MetalRate24K?.toFixed(2)} Per
                      Gram
                    </div> */}
                  </div>
                </div>
                {/* table */}

                <div className="tabledp10_pcl7">
                  {/* tablehead */}
                  <div className="theaddp10_pcl7 fw-bold fsg2dp10_pcl7" style={{backgroundColor:'#F5F5F5'}}>
                    <div className="col1dp10_pcl7 centerdp10_pcl7 ">Sr</div>
                    <div className="col2dp10_pcl7 centerdp10_pcl7  fw-bold">Design</div>
                    <div className="col3dp10_pcl7">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">
                        Diamond
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10_pcl7 w-100">
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7">
                          Code
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7">
                          Size
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7" style={{ width: "14.66%" }} >
                          Pcs
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7">
                          Wt
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7">
                          Rate
                        </div>
                        <div className="centerdp10_pcl7 h-100 theadsubcol1_dp10_pcl7" style={{ width: "18.66%" }} >
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col4dp10_pcl7">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">Metal</div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10_pcl7 w-100">
                        <div className="theadsubcol2_dp10_pcl7 bright_dp10_pcl7 h-100 centerdp10_pcl7" style={{width:'21%'}}>
                          Quality
                        </div>
                        <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 bright_dp10_pcl7 h-100">
                          Gross Wt
                        </div> 
                        <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 bright_dp10_pcl7 h-100">
                          {/* N+L */}
                          Net Wt
                        </div>
                        <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 bright_dp10_pcl7 h-100" style={{width:'18%'}}>
                          Rate
                        </div>
                        <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 h-100" style={{width:'21%'}}>
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col3dp10_pcl7">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">Stone & Misc</div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10_pcl7 w-100">
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7" style={{width:'21.66%'}}>
                          Code
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7 ">
                          Size
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7" style={{width:'11.66%'}}>
                          Pcs
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7">
                          Wt
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7">
                          Rate
                        </div>
                        <div className="centerdp10_pcl7 h-100 theadsubcol1_dp10_pcl7">
                          Amount
                        </div>
                      </div>
                    </div>
                    {/* <div className="col6dp10_pcl7">
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Other
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Charges
                      </div>
                    </div> */}
                    <div className="col7dp10_pcl7 border-end-0">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">
                        Labour
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50   w-100">
                        {/* <div className="w-50 h-100 centerdp10_pcl7 bright_dp10_pcl7">
                          Rate
                        </div> */}
                        <div className="w-100 h-100 centerdp10_pcl7 border-end-0">Amount</div>
                      </div>
                    </div>
                    <div className="col8dp10_pcl7 border-start border-black">
                      <div className="d-flex justify-content-center align-items-center h-50 border-top w-100">
                        Total
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Amount
                      </div>
                    </div>
                  </div>
                  {/* table body */}
                  <div className="tbodydp10_pcl7 fsgdp10_pcl7 ">
                    {result?.resultArray?.map((e, i) => {
                      return (<>
                        <div className="tbrowdp10_pcl7 h-100 " key={i}>
                          <div className="tbcol1dp10_pcl7 center_sdp10_pcl7 ">
                            {/* {e?.SrNo} */}
                            {i + 1}
                          </div>
                          <div className="tbcol2dp10_pcl7 d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between px-1 flex-wrap">
                              <div className="fsgdp10_pcl7">{e?.designno}</div>
                              <div className="fsgdp10_pcl7">{e?.SrJobno}</div>
                            </div>
                     
                            {imgFlag ? (
                              <div className="w-100 d-flex justify-content-center align-items-start fsgdp10_pcl7" style={{ minHeight: "80px" }} >
                                <img src={e?.DesignImage} onError={(e) => handleImageError(e)} alt="design" className="imgdp10_pcl7" />
                              </div>
                            ) : (
                              ""
                            )}

                            { e?.CertificateNo !== '' && <div className="centerdp10_pcl7 fsgdp10_pcl7 text-break ps-1">
                              Certificate#: <span className="fw-bold">{e?.CertificateNo}</span>
                            </div>}
                            {e?.HUID !== "" ? ( <div className="centerdp10_pcl7 fsgdp10_pcl7 text-break ps-1"> HUID - <span className="fw-bold">{e?.HUID}</span> </div> ) : ( "" )}
                            { e?.PO === '' ? '' : <div className="centerdp10_pcl7 fw-bold fsgdp10 text-break ps-1">
                              PO: {e?.PO}
                            </div>}
                            { e?.lineid === '' ? '' : <div className="centerdp10_pcl7 fsgdp10 text-break ps-1">
                                 L- {e?.lineid}
                            </div>}
                            {/* <div className="centerdp10_pcl7 fsgdp10_pcl7">
                              Tunch : &nbsp;
                              <b className="fsgdp10_pcl7">{e?.Tunch?.toFixed(3)}</b>
                            </div>
                            <div className="centerdp10_pcl7">
                              <b className="fsgdp10_pcl7">
                                {e?.grosswt?.toFixed(3)} gm
                              </b>
                              &nbsp; Gross
                            </div> */}
                            <div className="centerdp10_pcl7">
                              {e?.Size === "" ? "" : `Size : ${e?.Size}`}
                            </div>
                          </div>
                          <div className="tbcol3dp10_pcl7 ">
                            {e?.diamonds?.map((el, idia) => {
                              return (
                                <div className="d-flex" key={idia}>
                                  <div className="theadsubcol1_dp10_pcl7" style={{wordBreak:'break-word',paddingLeft:'2px'}}>
                                    {el?.ShapeName} {el?.QualityName}&nbsp;
                                    {el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 text-center" style={{lineHeight:'8px !important'}}>
                                    {el?.SizeName}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7" style={{ width: "8.66%" }} >
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7" style={{width:'19.66%'}}>
                                    {/* {formatAmount(el?.Rate)} */}
                                    {formatAmount(((el?.Amount / result?.header?.CurrencyExchRate) / (el?.Wt)))}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 fw-bold end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "21.66%" }} >
                                    {formatAmount((el?.Amount / result?.header?.CurrencyExchRate))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="tbcol4dp10_pcl7">
                            {e?.metal?.map((el, imet) => {
                              return (
                                <div className="d-flex w-100" key={imet}>
                                   <div className="theadsubcol2_dp10_pcl7 d-flex justify-content-start border-end h-100 ps-1 border-end-0 text-break" style={{ width: "21%", wordBreak:'break-word' }} >
                                    {el?.ShapeName} {el?.QualityName} {el?.Colorname}
                                  </div>
                                 <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                    {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                                    {e?.grosswt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                    {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                                    {/* { el?.IsPrimaryMetal === 1 ? ((el?.Wt - (e?.LossWt + e?.totals?.finding?.Wt))?.toFixed(3)) : (el?.Wt?.toFixed(3))} */}
                                    { el?.IsPrimaryMetal === 1 ? ((el?.Wt - e?.LossWt)?.toFixed(3)) : (el?.Wt?.toFixed(3))}
                                  </div>
                                  <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7" style={{width:'18%'}}>
                                    {el?.Rate?.toFixed(2)}
                                  </div>
                                  <div className={`theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 pr_dp10_pcl7 ${el?.IsPrimaryMetal === 1 ? 'fw-bold' : 'fw-bold' }`} style={{width:'21%'}}>
                                    {/* {formatAmount(((el?.Amount) / result?.header?.CurrencyExchRate))} */}
                                    {/* { formatAmount((el?.IsPrimaryMetal === 1 ? (((el?.Wt - (e?.LossWt + e?.totals?.finding?.Wt)) * el?.Rate)) : (el?.Amount))) } */}
                                    { formatAmount((el?.IsPrimaryMetal === 1 ? (((el?.Wt - e?.LossWt) * el?.Rate)) : (el?.Amount))) }
                                  </div>
                                </div>
                              );
                            })}
                             {
                              e?.LossWt === 0 ? '' : 
                              <div className="d-flex w-100" >
                              <div className="theadsubcol2_dp10_pcl7 d-flex justify-content-start border-end h-100 ps-1 border-end-0 text-break" style={{ width: "21%", wordBreak:'break-word' }} >
                                Loss Wt
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                {e?.LossPer?.toFixed(3)} %
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                {e?.LossWt?.toFixed(3)}
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7" style={{width:'18%'}}>
                              {formatAmount(((e?.LossAmt / result?.header?.CurrencyExchRate) / (e?.LossWt === 0 ? 1 : e?.LossWt)))}
                              </div>
                              <div className={`theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 pr_dp10_pcl7 `} style={{width:'21%'}}>
                                {formatAmount((e?.LossAmt / result?.header?.CurrencyExchRate))}
                              </div>
                            </div>
                             }
                             {/* {
                              e?.totals?.finding?.Wt === 0 ? '' : 
                              <div className="d-flex w-100" >
                              <div className="theadsubcol2_dp10_pcl7 d-flex justify-content-start border-end h-100 ps-1 border-end-0 text-break" style={{ width: "21%", wordBreak:'break-word' }} >
                                FINDING ACESSORIES
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                {e?.totals?.finding?.Wt?.toFixed(3)}
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7" style={{width:'18%'}}>
                              { formatAmount(e?.metal_rate) }
                              </div>
                              <div className={`theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 pr_dp10_pcl7 `} style={{width:'21%'}}>
                                {formatAmount(((e?.totals?.finding?.Wt * e?.metal_rate) / result?.header?.CurrencyExchRate))}
                              </div>
                            </div>
                             } */}
                            <div className="p-2 px-1">
                              {e?.JobRemark !== "" ? (
                                <>
                                  <b className="fsgdp10_pcl7">Remark : </b>{" "}
                                  {e?.JobRemark}
                                </>
                              ) : (
                                ""
                              )}{" "}
                            </div>
                          </div>
                          <div className="tbcol3dp10_pcl7">
                            {e?.colorstone?.map((el, ics) => {
                              return (
                                <div className="d-flex" key={ics}>
                                  <div className="theadsubcol1_dp10_pcl7" style={{wordBreak:'break-word', paddingLeft:'2px', width:'21.66%'}}>
                                    {el?.ShapeName + " " + el?.QualityName + " " + el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 text-center">
                                    {el?.SizeName}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7" style={{width:'11.66%'}}>
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                    {/* {el?.Rate?.toFixed(2)} */}
                                    { formatAmount(
                                      (
                                        (el?.Amount / result?.header?.CurrencyExchRate) / (
                                          (el?.isRateOnPcs === 0 ? (el?.Wt === 0 ? 1 : el?.Wt) : (el?.Pcs === 0 ? 1 : el?.Pcs))
                                          )
                                      )
                                      ) 
                                    }
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 fw-bold pr_dp10_pcl7">
                                    {formatAmount((el?.Amount/ result?.header?.CurrencyExchRate))}
                                  </div>
                                </div>
                              );
                            })}
                            {e?.misc?.map((el, ics) => {
                              return (
                                <div className="d-flex" key={ics}>
                                  <div className="theadsubcol1_dp10_pcl7" style={{wordBreak:'break-word', paddingLeft:'2px', width:'21.66%'}}>
                                    M: { el?.ShapeName + " " + el?.QualityName }
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 text-center">
                                    {el?.SizeName}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7" style={{width:'11.66%'}}>
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                    {/* {el?.Rate?.toFixed(2)} */}
                                    { formatAmount(
                                      (
                                        (el?.Amount / result?.header?.CurrencyExchRate) / (
                                          (el?.isRateOnPcs === 0 ? (el?.Wt === 0 ? 1 : el?.Wt) : (el?.Pcs === 0 ? 1 : el?.Pcs))
                                          )
                                      )
                                      ) 
                                    }
                                  </div>
                                  <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 fw-bold pr_dp10_pcl7">
                                    {formatAmount((el?.Amount / result?.header?.CurrencyExchRate))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* <div className="tbcol6dp10_pcl7 end_dp10_pcl7 p-1 pr_dp10_pcl7">
                            {formatAmount(
                              e?.OtherCharges +
                                e?.MiscAmount +
                                e?.TotalDiamondHandling
                            )}
                          </div> */}
                          <div className="tbcol7dp10_pcl7 border-end-0">
                            <div className="d-flex">
                              {/* <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div> */}
                              <div className="w-100 end_dp10_pcl7  pr_dp10_pcl7">
                                {formatAmount( ((e?.MakingAmount + e?.totals?.finding?.SettingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost) / result?.header?.CurrencyExchRate) )}
                              </div>
                            </div>
                          </div>
                          <div className="tbcol8dp10_pcl7 end_dp10_pcl7 fw-bold p-1 pad_top_dp10_pcl7 pr_dp10_pcl7 border-start border-black">
                            {/* {formatAmount((e?.TotalAmount + e?.DiscountAmt))} */}
                            {formatAmount((e?.UnitCost /result?.header?.CurrencyExchRate ))}
                          </div>
                        </div>
                        <div className="d-flex grandtotaldp10_pcl7 brb_dp10_pcl7  tbrowdp10_pcl7 border-top-0 bb_dp10_pcl7"  >
                          <div className="col1dp10_pcl7 "></div>
                          <div className="col2dp10_pcl7 border-end-0 "></div>
                    {/* <div className="centerdp10_pcl7 " style={{ width: "12.1%", borderTop:'1px solid white' }} >  </div> */}
                    <div className="col3dp10_pcl7 d-flex align-items-center bl_dp10_pcl7 bt_dp10_pcl7" style={{ backgroundColor: "#F5F5F5" }}>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7 centerdp10_pcl7">
                        {/* {result?.mainTotal?.diamonds?.Pcs} */}
                        {e?.totals?.diamonds?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7 ">
                        {/* {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} */}
                        {e?.totals?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10_pcl7"></div> */}
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "33.332%" }} >
                        {/* {formatAmount(result?.mainTotal?.diamonds?.Amount)} */}
                        {formatAmount((e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate))}
                      </div>
                    </div>
                    <div className="col4dp10_pcl7 d-flex align-items-center bt_dp10_pcl7" style={{ backgroundColor: "#F5F5F5" }}>
                      {/* <div className="theadsubcol2_dp10_pcl7"  ></div> */}
                      <div className="theadsubcol2_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "42%" }}>
                        {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                        {/* {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} */}
                        {e?.grosswt?.toFixed(3)}
                      </div>
                      <div className="theadsubcol2_dp10_pcl7 pr_dp10_pcl7 end_dp10_pcl7">
                        {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                        {/* {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} */}
                        {  ((e?.totals?.metal?.IsPrimaryMetal + e?.LossWt)?.toFixed(3))}
                      </div>
                      {/* <div className="theadsubcol2_dp10"></div> */}
                      <div className="theadsubcol2_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "43%" }} >
                        {/* {formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)} */}
                        {formatAmount((e?.totals?.metal?.IsPrimaryMetal_Amount / result?.header?.CurrencyExchRate))}
                      </div>
                    </div>
                    <div className="col3dp10_pcl7 d-flex align-items-center bt_dp10_pcl7" style={{ backgroundColor: "#F5F5F5" }}>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                        {/* {result?.mainTotal?.colorstone?.Pcs} */}
                        {e?.totals?.colorstone?.Pcs + e?.totals?.misc?.onlyIsHSCODE0_Pcs}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                        {/* {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} */}
                        {(e?.totals?.colorstone?.Wt + e?.totals?.misc?.onlyIsHSCODE0_Wt)?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10_pcl7"></div> */}
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "33.32%" }} >
                        {/* {formatAmount(result?.mainTotal?.colorstone?.Amount)} */}
                        {formatAmount(((e?.totals?.colorstone?.Amount + e?.totals?.misc?.onlyIsHSCODE0_Amount) / result?.header?.CurrencyExchRate))}
                      </div>
                    </div>
                    {/* <div className="col6dp10_pcl7 end_dp10_pcl7  d-flex align-items-center brR_dp10_pcl7 pr_dp10_pcl7" style={{width:'5%', paddingRight:'1px'}}>
                      {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                    </div> */}
                    <div className="col7dp10_pcl7 end_dp10_pcl7  d-flex align-items-center  pr_dp10_pcl7 border-end-0 bt_dp10_pcl7" style={{ backgroundColor: "#F5F5F5" }}>
                      {/* {formatAmount( result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost )} */}
                      { formatAmount(((e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost) / result?.header?.CurrencyExchRate)) }
                    </div>
                    <div className="col8dp10_pcl7 end_dp10_pcl7  d-flex align-items-center pr_dp10_pcl7 border-start bt_dp10_pcl7 bl_dp10_pcl7_2 " style={{ backgroundColor: "#F5F5F5" }}>
                      {/* {formatAmount(result?.finalAmount)} */}
                      {formatAmount((e?.UnitCost / result?.header?.CurrencyExchRate))}
                    </div>
                  </div>
                        </>
                      );
                    })}
                    
                  </div>
                  {/* main total */}
                  <div className="d-flex grandtotaldp10_pcl7 brb_dp10_pcl7 brbb_dp10_pcl7 tbrowdp10_pcl7 border-top border-black mt-2 fsgdp10_pcl7" style={{ backgroundColor: "#F5F5F5" }} >
                    <div className="centerdp10_pcl7 brR_dp10_pcl7" style={{ width: "12.5%" }} > Total </div>
                    <div className="col3dp10_pcl7 d-flex align-items-center brR_dp10_pcl7">
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7 center_dp10_pcl7 ps-3" style={{width:'14.66%'}}>
                        {result?.mainTotal?.diamonds?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7 " style={{width:'18.66%'}}>
                        {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"  >
                        {formatAmount(result?.mainTotal?.diamonds?.Amount)}
                      </div>
                    </div>
                    <div className="col4dp10_pcl7 d-flex align-items-center brR_dp10_pcl7">
                      <div className="theadsubcol2_dp10_pcl7"></div>
                      <div className="theadsubcol2_dp10_pcl7 end_dp10_pcl7">{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                      <div className="theadsubcol2_dp10_pcl7 pr_dp10_pcl7 end_dp10_pcl7">
                        {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                        {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol2_dp10"></div> */}
                      <div className="theadsubcol2_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "45%" }} >
                        {formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)}
                      </div>
                    </div>
                    <div className="col3dp10_pcl7 d-flex align-items-center brR_dp10_pcl7">
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                        {result?.mainTotal?.colorstone?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                        {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10_pcl7"></div> */}
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "33.32%" }} >
                        {formatAmount(result?.mainTotal?.colorstone?.Amount)}
                      </div>
                    </div>
                    {/* <div className="col6dp10_pcl7 end_dp10_pcl7  d-flex align-items-center brR_dp10_pcl7 pr_dp10_pcl7" style={{width:'5%', paddingRight:'1px'}}>
                      {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                    </div> */}
                    <div className="col7dp10_pcl7 end_dp10_pcl7  d-flex align-items-center  pr_dp10_pcl7  border-end-0">
                      {formatAmount( result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost )}
                    </div>
                    <div className="col8dp10_pcl7 end_dp10_pcl7  d-flex align-items-center pr_dp10_pcl7 border-start border-black">
                      {formatAmount(result?.finalAmount)}
                    </div>
                  </div>
                  {/* final total */}
                  <div className="d-flex justify-content-end align-items-center brb_dp10_pcl7 tbrowdp10_pcl7 pt-1 border-bottom border-black">
                    <div style={{ width: "13%" }}>
                      {/* <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10_pcl7">Net Amount</div>
                        <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                          {(
                            +result?.mainTotal?.total_amount?.toFixed(2) +
                            +result?.mainTotal?.total_discount_amount?.toFixed(
                              2
                            )
                          )?.toFixed(2)}
                        </div>
                      </div> */}
                   { result?.mainTotal?.total_discount_amount !== 0 &&   <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10_pcl7">Total Discount</div>
                        <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                          {formatAmount((result?.mainTotal?.total_discount_amount / result?.header?.CurrencyExchRate))}
                        </div>
                      </div>}
                      <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10_pcl7">Total Amount</div>
                        <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                          {formatAmount(((result?.mainTotal?.total_amount) / result?.header?.CurrencyExchRate))}
                        </div>
                      </div>
                      <div>
                        {result?.allTaxes?.map((e, i) => {
                          return (
                            <div className="d-flex justify-content-between" key={i} >
                              <div className="w-50 end_dp10_pcl7"> {e?.name} {e?.per} </div>
                              <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7"> {formatAmount(e?.amountInNumber)} </div>
                            </div>
                          );
                        })}
                        <div className="d-flex justify-content-between">
                          <div className="w-50 end_dp10_pcl7">
                            {result?.header?.AddLess > 0 ? "Add" : "Less"}
                          </div>
                          <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                            {formatAmount(((result?.header?.AddLess / result?.header?.CurrencyExchRate)))}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <div className="w-50 end_dp10_pcl7">{result?.header?.ModeOfDel}</div>
                        <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                          {formatAmount((result?.header?.FreightCharges / result?.header?.CurrencyExchRate))}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between fw-bold">
                        <div className="w-50 end_dp10_pcl7">Final Amount</div>
                        <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                          {formatAmount(
                            (
                              (
                                (result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate) 
                                + (result?.allTaxesTotal )
                                + ( result?.header?.FreightCharges / result?.header?.CurrencyExchRate)
                                + (result?.header?.AddLess / result?.header?.CurrencyExchRate)
                              )
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              
                  
                  </div>
                  {/* summary */}
                  <div className="d-flex justify-content-between mt-1 summarydp10_pcl7">
                    <div className="d-flex flex-column sumdp10_pcl7">
                      <div className="fw-bold bg_dp10_pcl7 w-100 centerdp10_pcl7  ball_dp10_pcl7">
                        SUMMARY
                      </div>
                      <div className="d-flex w-100 fsgdp10_pcl7">
                        <div className="w-50 bright_dp10_pcl7  bl_dp10_pcl7">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD IN 24KT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                              {result?.mainTotal?.total_purenetwt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GROSS WT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                              {result?.mainTotal?.grosswt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">NET WT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                            {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">LOSS WT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                            {result?.mainTotal?.lossWt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND WT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                              {result?.mainTotal?.diamonds?.Pcs} /{" "}
                              {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">STONE WT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                              {result?.mainTotal?.colorstone?.Pcs} /{" "}
                              {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}{" "}
                              cts
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MISC WT</div>
                            <div className="w-50 end_dp10_pcl7 pe-1">
                              {result?.mainTotal?.misc?.onlyIsHSCODE0_Pcs} /{" "}
                              {result?.mainTotal?.misc?.Wt?.toFixed(3)}{" "} gm
                            </div>
                          </div>
                        </div>
                        <div className="w-50 bright_dp10_pcl7 ">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD</div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount((result?.mainTotal?.metal?.IsPrimaryMetal_Amount / result?.header?.CurrencyExchRate))}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND</div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount(
                                (result?.mainTotal?.diamonds?.Amount / result?.header?.CurrencyExchRate)
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">CST</div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount(
                                result?.mainTotal?.colorstone?.Amount / result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MISC</div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount(
                                result?.mainTotal?.misc?.Amount / result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MAKING </div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount(
                                 ((result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost) / result?.header?.CurrencyExchRate )
                              )}
                            </div>
                          </div>
                          {/* <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">OTHER </div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                            </div>
                          </div> */}
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">
                              {result?.header?.AddLess > 0 ? "ADD" : "LESS"}
                            </div>
                            <div className="w-50 end_dp10_pcl7">
                              {formatAmount(((result?.header?.AddLess / result?.header?.CurrencyExchRate)))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg_dp10_pcl7 h_bd10_pcl7 ball_dp10_pcl7 d-flex fsgdp10_pcl7 ">
                        <div className="w-50 h-100"></div>
                        <div className="w-50 h-100 d-flex align-items-center bl_dp10_pcl7">
                          <div className="fw-bold w-50 px-1">TOTAL</div>
                          <div className="w-50 end_dp10_pcl7 px-1">
                          {formatAmount(
                            (
                              (
                                (result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate) 
                                + (result?.allTaxesTotal )
                                + ( result?.header?.FreightCharges / result?.header?.CurrencyExchRate)
                                + (result?.header?.AddLess / result?.header?.CurrencyExchRate)
                              )
                            )
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dia_sum_dp10_pcl7 d-flex flex-column  fsgdp10_pcl7">
                      <div className="h_bd10_pcl7 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                        Diamond Detail
                      </div>
                      {diamondWise?.map((e, i) => {
                        return (
                          <div className="d-flex justify-content-between px-1 ball_dp10_pcl7 border-top-0 border-bottom-0 fsgdp10_pcl7" key={i} >
                            <div className="fw-bold w-50">
                              {e?.ShapeName} {e?.QualityName} {e?.Colorname}
                            </div>
                            <div className="w-50 end_dp10_pcl7">
                              {e?.pcPcss} / {e?.wtWt?.toFixed(3)} cts
                            </div>
                          </div>
                        );
                      })}
                      <div className="d-flex justify-content-between px-1 bg_dp10_pcl7 h_bd10_pcl7  ball_dp10_pcl7">
                        <div className="fw-bold w-50 h14_dp10_pcl7" ></div>
                        <div className="w-50"></div>
                      </div>
                    </div>
                    <div className="oth_sum_dp10_pcl7 fsgdp10_pcl7">
                      <div className="h_bd10 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                        OTHER DETAILS
                      </div>
                      <div className="d-flex flex-column justify-content-between w-100 px-1 ball_dp10_pcl7 border-top-0 p-1">
                        <div className="d-flex">
                          <div className="w-50 fw-bold start_dp10_pcl7 fsgdp10_pcl7">
                            RATE IN 24KT
                          </div>
                          <div className="w-50 end_dp10_pcl7 fsgdp10_pcl7">
                            {result?.header?.MetalRate24K?.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          {result?.header?.BrokerageDetails?.map((e, i) => {
                            return (
                              <div className="d-flex fsgdp10_pcl7" key={i}>
                                <div className="w-50 fw-bold start_dp10_pcl7">
                                  {e?.label}
                                </div>
                                <div className="w-50 end_dp10_pcl7">{e?.value}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                     {
                      result?.header?.PrintRemark === '' ? <div style={{width:'15%'}}></div> : <div className="remark_sum_dp10_pcl7 fsgdp10_pcl7">
                      <div className="h_bd10 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                        Remark
                      </div>
                       <div className="ball_dp10_pcl7 border-top-0 p-1">
                        {result?.header?.PrintRemark}
                      </div>
                    </div>
                     } 
                    <div className="check_dp10_pcl7 ball_dp10_pcl7 d-flex justify-content-center align-items-end pb-1 fsgdp10_pcl7">
                      <i>Created By</i>
                    </div>
                    <div className="check_dp10_pcl7 ball_dp10_pcl7 d-flex justify-content-center align-items-end pb-1 fsgdp10_pcl7">
                      <i>Checked By</i>
                    </div>
                  </div>
                  <div style={{color:'gray'}} className="pt-3" >**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
                
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

export default PackingList7;
