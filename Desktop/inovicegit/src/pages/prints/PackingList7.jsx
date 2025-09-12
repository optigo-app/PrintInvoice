import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  NumberWithCommas,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import "../../assets/css/prints/packinglist7.css";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";

const PackingList7 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [diamondWise, setDiamondWise] = useState([]);
  const [imgFlag, setImgFlag] = useState(true);
  const [imgFlag2, setImgFlag2] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const evname = atob(evn);
  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
  const [diamondDetails, setDiamondDetails] = useState([]);

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

    let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);

    setMetShpWise(met_shp_arr);
    let tot_met = 0;
    let tot_met_wt = 0;
    met_shp_arr?.forEach((e, i) => {
      tot_met += e?.Amount;
      tot_met_wt += e?.metalfinewt;
    });
    setNotGoldMetalTotal(tot_met);
    setNotGoldMetalWtTotal(tot_met_wt);

    //grouping of jobs and isGroupJob is 1

    let finalArr = [];
    datas?.resultArray?.forEach((a) => {
      if (a?.GroupJob === "") {
        finalArr.push(a);
      } else {
        let b = cloneDeep(a);
        let find_record = finalArr.findIndex(
          (el) => el?.GroupJob === b?.GroupJob
        );
        if (find_record === -1) {
          finalArr.push(b);
        } else {
          if (
            finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno
          ) {
            finalArr[find_record].designno = b?.designno;
            finalArr[find_record].HUID = b?.HUID;
          }

          if (!finalArr[find_record].DesignImage && b?.DesignImage) {
            finalArr[find_record].DesignImage = b?.DesignImage;
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
          finalArr[find_record].totals.metal.IsPrimaryMetal +=
            b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
          finalArr[find_record].diamonds = [
            ...finalArr[find_record]?.diamonds,
            ...b?.diamonds,
          ]?.flat();
          // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
          finalArr[find_record].colorstone = [
            ...finalArr[find_record]?.colorstone,
            ...b?.colorstone,
          ]?.flat();
          // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
          finalArr[find_record].metal = [
            ...finalArr[find_record]?.metal,
            ...b?.metal,
          ]?.flat();
          finalArr[find_record].misc = [
            ...finalArr[find_record]?.misc,
            ...b?.misc,
          ]?.flat();
          finalArr[find_record].finding = [
            ...finalArr[find_record]?.finding,
            ...b?.finding,
          ]?.flat();

          finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
          finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
          finalArr[find_record].totals.finding.Amount +=
            b?.totals?.finding?.Amount;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount +=
            b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.colorstone.Wt +=
            b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs +=
            b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount +=
            b?.totals?.colorstone?.Amount;

          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.allservwt +=
            b?.totals?.misc?.allservwt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;

          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.IsPrimaryMetal +=
            b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.metal.IsPrimaryMetal_Amount +=
            b?.totals?.metal?.IsPrimaryMetal_Amount;

          finalArr[find_record].totals.misc.withouthscode1_2_pcs +=
            b?.totals?.misc?.withouthscode1_2_pcs;
          finalArr[find_record].totals.misc.withouthscode1_2_wt +=
            b?.totals?.misc?.withouthscode1_2_wt;
          finalArr[find_record].totals.misc.onlyHSCODE3_amt +=
            b?.totals?.misc?.onlyHSCODE3_amt;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Wt +=
            b?.totals?.misc?.onlyIsHSCODE0_Wt;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Pcs +=
            b?.totals?.misc?.onlyIsHSCODE0_Pcs;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Amount +=
            b?.totals?.misc?.onlyIsHSCODE0_Amount;
        }
      }
    });

    console.log("finalArrfinalArrfinalArr", finalArr);

    datas.resultArray = finalArr;

    //after groupjob
    datas?.resultArray?.forEach((e) => {
      let dia2 = [];
      e?.diamonds?.forEach((el) => {
        // let findrec = dia2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.GroupName === el?.GroupName)
        let findrec = dia2?.findIndex(
          (a) =>
            a?.ShapeName === el?.ShapeName &&
            a?.QualityName === el?.QualityName &&
            a?.Colorname === el?.Colorname &&
            a?.SizeName === el?.SizeName &&
            a?.Rate === el?.Rate
        );
        let ell = cloneDeep(el);
        if (findrec === -1) {
          dia2.push(ell);
        } else {
          dia2[findrec].Wt += ell?.Wt;
          dia2[findrec].Pcs += ell?.Pcs;
          dia2[findrec].Amount += ell?.Amount;
          dia2[findrec].Rate += ell?.Rate;
          // if(dia2[findrec]?.SizeName !== ell?.SizeName){
          //   // dia2[findrec].SizeName = 'Mix'
          //   dia2[findrec].SizeName = ell?.GroupName;
          // }
        }
      });
      e.diamonds = dia2;

      //diamond
      let clr2 = [];

      e?.colorstone?.forEach((el) => {
        // let findrec = dia2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.GroupName === el?.GroupName)
        let findrec = clr2?.findIndex(
          (a) =>
            a?.ShapeName === el?.ShapeName &&
            a?.QualityName === el?.QualityName &&
            a?.Colorname === el?.Colorname &&
            a?.SizeName === el?.SizeName &&
            a?.Rate === el?.Rate &&
            a?.isRateOnPcs === el?.isRateOnPcs
        );
        let ell = cloneDeep(el);
        if (findrec === -1) {
          clr2.push(ell);
        } else {
          clr2[findrec].Wt += ell?.Wt;
          clr2[findrec].Pcs += ell?.Pcs;
          clr2[findrec].Amount += ell?.Amount;
          clr2[findrec].Rate += ell?.Rate;
          // if(dia2[findrec]?.SizeName !== ell?.SizeName){
          //   // dia2[findrec].SizeName = 'Mix'
          //   dia2[findrec].SizeName = ell?.GroupName;
          // }
        }
      });
      e.colorstone = clr2;

      //colorstone
      // let clr_rop0 = []; //wt
      // let clr_rop1 = []; //pcs

      // e?.colorstone?.forEach((el) => {
      //   if(el?.isRateOnPcs === 0){
      //     clr_rop0?.push(el)
      //   }else{
      //     clr_rop1?.push(el)
      //   }
      // })
      // let clr2 = [];
      // let clr2_2 = [];
      // let clr_all = [];

      // clr_rop0?.forEach((el) => {
      //   let findrec = clr2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname)
      //   if(findrec === -1){
      //     clr2.push(el);
      //   }else{
      //       clr2[findrec].Wt += el?.Wt;
      //       clr2[findrec].Pcs += el?.Pcs;
      //       clr2[findrec].Amount += el?.Amount;
      //       clr2[findrec].Rate += el?.Rate;
      //       if(clr2[findrec]?.SizeName !== el?.SizeName){
      //         clr2[findrec].SizeName = 'Mix'
      //       }
      //   }

      // });

      // clr_rop0 = clr2;

      // // clr_all.push(clr_rop0)

      // clr_rop1?.forEach((el) => {
      //   let findrec = clr2_2?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname)
      //   if(findrec === -1){
      //     clr2_2.push(el);
      //   }else{
      //       clr2_2[findrec].Wt += el?.Wt;
      //       clr2_2[findrec].Pcs += el?.Pcs;
      //       clr2_2[findrec].Amount += el?.Amount;
      //       clr2_2[findrec].Rate += el?.Rate;
      //       if(clr2_2[findrec]?.SizeName !== el?.SizeName){
      //         clr2_2[findrec].SizeName = 'Mix'
      //       }
      //   }

      // });

      // clr_rop1 = clr2_2;

      // clr_all.push(clr_rop0)
      // clr_all.push(clr_rop1)

      // e.colorstone = [...clr_all]?.flat();

      //misc
      let misc0 = [];
      e?.misc?.forEach((el) => {
        if (el?.IsHSCOE === 0) {
          misc0?.push(el);
        }
      });

      e.misc = misc0;

      let met2 = [];
      e?.metal?.forEach((a) => {
        if (e?.GroupJob !== "") {
          let obj = { ...a };
          obj.GroupJob = e?.GroupJob;
          met2?.push(obj);
        }
      });

      let met3 = [];
      met2?.forEach((a) => {
        let findrec = met3?.findIndex(
          (el) => el?.StockBarcode === el?.GroupJob
        );
        if (findrec === -1) {
          met3?.push(a);
        } else {
          met3[findrec].Wt += a?.Wt;
        }
      });
      if (e?.GroupJob === "") {
        return;
      } else {
        e.metal = met3;
      }
    });

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
      } else {
        diaonlyrndarr6[find_record].wtWts += e?.wtWt;
        diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
        diaonlyrndarr6[find_record].rRates += e?.rRate;
        diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
      }
    });

    let diamondDetail = [];
    data?.BillPrint_Json2?.forEach((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        let findDiamond = diamondDetail?.findIndex(
          (ele, ind) =>
            ele?.ShapeName === e?.ShapeName &&
            ele?.QualityName === e?.QualityName &&
            ele?.Colorname === e?.Colorname
        );
        if (findDiamond === -1) {
          diamondDetail.push(e);
        } else {
          diamondDetail[findDiamond].Pcs += e?.Pcs;
          diamondDetail[findDiamond].Wt += e?.Wt;
          diamondDetail[findDiamond].Amount += e?.Amount;
        }
      }
    });
    let findRND = [];
    let remaingDia = [];
    diamondDetail?.forEach((ele, ind) => {
      if (ele?.ShapeName === "RND") {
        findRND.push(ele);
      } else {
        remaingDia.push(ele);
      }
    });

    let resultArr = [];
    findRND.sort((a, b) => {
      if (a.ShapeName !== b.ShapeName) {
        return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
      } else if (a.QualityName !== b.QualityName) {
        return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
      } else {
        return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
      }
    });

    remaingDia.sort((a, b) => {
      if (a.ShapeName !== b.ShapeName) {
        return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
      } else if (a.QualityName !== b.QualityName) {
        return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
      } else {
        return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
      }
    });
    if (findRND?.length > 6) {
      let arr = findRND.slice(0, 6);
      let anotherArr = [...findRND.slice(6), remaingDia].flat();
      let obj = { ...anotherArr[0] };
      anotherArr?.reduce((acc, cobj) => {
        obj.Pcs += cobj?.Pcs;
        obj.Wt += cobj?.Wt;
        obj.Amount += cobj?.Amount;
      }, obj);
      obj.ShapeName = "OTHER";
      resultArr = [...arr, obj].flat();
    } else {
      let arr = [...findRND].flat();
      let smallArr = [...remaingDia.slice(0, 6 - findRND?.length)].flat();
      let largeArr = [...remaingDia.slice(6 - findRND?.length)].flat();
      let finalArr = [...arr, ...smallArr].flat();

      let obj = { ...largeArr[0] };
      obj.Pcs = 0;
      obj.Wt = 0;
      obj.Amount = 0;
      largeArr?.reduce((acc, cobj) => {
        obj.Pcs += cobj?.Pcs;
        obj.Wt += cobj?.Wt;
        obj.Amount += cobj?.Amount;
      }, obj);
      obj.ShapeName = "OTHER";
      resultArr = [...finalArr, obj].flat();
    }

    setDiamondDetails(resultArr);

    diarndotherarr5 = [...diaonlyrndarr6, diaObj];
    const sortedData = diarndotherarr5?.sort(customSort);
    // setDiamonds(sortedData);
    setDiamondWise(sortedData);

    setResult(datas);
  }

  const handleCheckbox = () => {
    if (imgFlag) {
      setImgFlag(false);
    } else {
      setImgFlag(true);
    }
  };
  const handleCheckbox2 = () => {
    if (imgFlag2) {
      setImgFlag2(false);
    } else {
      setImgFlag2(true);
    }
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const customSort = (a, b) => {
    if (a?.ShapeName === "OTHER" && b?.ShapeName !== "OTHER") {
      return 1; // "OTHER" comes after any other ShapeName
    } else if (a?.ShapeName !== "OTHER" && b?.ShapeName === "OTHER") {
      return -1; // Any other ShapeName comes before "OTHER"
    } else {
      // If ShapeNames are equal, compare by QualityName
      if (a?.QualityName < b?.QualityName) {
        return -1;
      } else if (a?.QualityName > b?.QualityName) {
        return 1;
      } else {
        // If QualityNames are equal, compare by Colorname
        return a?.Colorname?.localeCompare(b?.Colorname);
      }
    }
  };
  console.log("result", result);

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
                  <span>
                    <input
                      type="checkbox"
                      id="imghideshow"
                      className="mx-1"
                      checked={imgFlag}
                      onChange={handleCheckbox}
                    />
                    <label
                      htmlFor="imghideshow"
                      className="me-3 user-select-none"
                    >
                      With Image
                    </label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      id="imghideshow2"
                      className="mx-1"
                      checked={imgFlag2}
                      onChange={handleCheckbox2}
                    />
                    <label
                      htmlFor="imghideshow2"
                      className="me-3 user-select-none"
                    >
                      With Header
                    </label>
                  </span>
                  <button
                    className="btn_white blue mb-0 hidedp10_pcl7 m-0 p-2"
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button>
                </div>
                {/* header */}
                <div>
                  <div className="pheaddp10_pcl7">
                    {result?.header?.PrintHeadLabel}
                  </div>
                  {imgFlag2 && (
                    <div className="d-flex justify-content-between">
                      <div className="p-1 fsgdp10_pcl7_2">
                        <div className="fw-bold cfullname_pcl7 ">
                          {result?.header?.CompanyFullName}
                        </div>
                        <div>
                          <span>{result?.header?.CompanyAddress}</span>
                          <span>{result?.header?.CompanyAddress2}</span>{" "}
                          {result?.header?.CompanyCity}{" "}
                          {result?.header?.CompanyCity}-
                          {result?.header?.CompanyPinCode},{" "}
                          {result?.header?.CompanyState}(
                          {result?.header?.CompanyCountry}){" "}
                        </div>
                        {/* <div>{result?.header?.CompanyAddress2}</div> */}
                        {/* <div>{result?.header?.CompanyCity}</div> */}
                        <div>
                          <span>T {result?.header?.CompanyTellNo}</span>{" "}
                          <span>
                            {result?.header?.CompanyEmail} |{" "}
                            {result?.header?.CompanyWebsite} | {" "}
                          </span>
                          {result?.header?.Company_VAT_GST_No} |{" "}
                          {result?.header?.Company_CST_STATE}-
                          {result?.header?.Company_CST_STATE_No} | PAN-
                          {result?.header?.Pannumber}
                        </div>
                        {/* <div>T {result?.header?.CompanyTellNo}</div> */}
                        {/* <div>
                          {result?.header?.CompanyEmail} |{" "}
                          {result?.header?.CompanyWebsite}
                        </div> */}
                        <div>
                          {/* {result?.header?.Company_VAT_GST_No} |{" "}
                          {result?.header?.Company_CST_STATE}-
                          {result?.header?.Company_CST_STATE_No} | PAN-
                          {result?.header?.Pannumber} */}
                        </div>
                      </div>
                      <div className="d-flex justify-content-end pe-2 pt-2">
                        {isImageWorking && result?.header?.PrintLogo !== "" && (
                          <img
                            src={result?.header?.PrintLogo}
                            alt=""
                            className="w-100 h-auto ms-auto d-block object-fit-contain headImg_Pcl7"
                            onError={handleImageErrors}
                            height={120}
                            width={150}
                            style={{ maxWidth: "116px" }}
                          />
                        )}
                        {/* <img
                        src={result?.header?.PrintLogo}
                        alt="#companylogo"
                        className="imgHWdp10"
                      /> */}
                      </div>
                    </div>
                  )}
                </div>
                {/* subheader */}
                <div className="subheaderdp10_pcl7">
                  <div className="subdiv1dp10_pcl7 border-end fsgdp10_pcl7_2 border-start ">
                    <div className="px-1">{result?.header?.lblBillTo}</div>
                    <div
                      className="px-1 fsgdp10_pcl7_3"
                      style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                    >
                      <b>{result?.header?.customerfirmname}</b>
                      {result?.header?.customerAddress2 &&
                        `, ${result.header.customerAddress2}`}
                      {result?.header?.customerAddress1 &&
                        ` ${result.header.customerAddress1}`}
                      {result?.header?.customerAddress3 &&
                        ` ${result.header.customerAddress3}`}
                      {result?.header?.customercity1 &&
                        ` ${result.header.customercity1}`}
                      {result?.header?.PinCode && ` - ${result.header.PinCode}`}
                    </div>
                    <div className="px-1">
                      {result?.header?.customeremail1}{" "}
                      {result?.header?.vat_cst_pan}
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subdiv2dp10_pcl7 border-end fsgdp10_pcl7_2">
                    <div className="px-1">Ship To,</div>
                    <div className="px-1 fsgdp10_pcl7_3">
                      <b>{result?.header?.customerfirmname}</b>
                      {result?.header?.address?.map((e, i) => {
                        return (
                          <div className="px-1" key={i}>
                            {e}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="subdiv3dp10_pcl7 fsgdp10_pcl7_2 border-end">
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">BILL NO</div>
                      <div className="w-50">{result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">DATE</div>
                      <div className="w-50">{result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">
                        {" "}
                        {result?.header?.HSN_No_Label}{" "}
                      </div>
                      <div className="w-50">{result?.header?.HSN_No}</div>
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
                  <div
                    className="theaddp10_pcl7 fw-bold fsg2dp10_pcl7"
                    style={{ backgroundColor: "#F5F5F5" }}
                  >
                    <div className="col1dp10_pcl7 centerdp10_pcl7 ">Sr</div>

                    <div
                      className="col2dp10_pcl7 centerdp10_pcl7  fw-bold"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">
                        Design Details
                      </div>
                      {imgFlag && (
                        <div className="d-flex  align-items-center h-50 bt_dp10_pcl7 w-100">
                          <div
                            className=" h-100 centerdp10_pcl7 bright_dp10_pcl7"
                            style={{ width: "50%" }}
                          >
                            Design
                          </div>
                          <div
                            className="centerdp10_pcl7 h-100"
                            style={{ width: "50%" }}
                          >
                            Item
                          </div>
                        </div>
                      )}
                    </div>
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
                        <div
                          className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7"
                          style={{ width: "10.66%" }}
                        >
                          Pcs
                        </div>
                        <div
                          className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7"
                          style={{ width: "16.66%" }}
                        >
                          Wt
                        </div>
                        <div
                          className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7"
                          style={{ width: "16.66%" }}
                        >
                          Rate
                        </div>
                        <div
                          className="centerdp10_pcl7 h-100 theadsubcol1_dp10_pcl7"
                          style={{ width: "22.66%" }}
                        >
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col4dp10_pcl7">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">
                        Metal
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10_pcl7 w-100">
                        <div
                          className="theadsubcol2_dp10_pcl7 bright_dp10_pcl7 h-100 centerdp10_pcl7"
                          style={{ width: "21%" }}
                        >
                          Quality
                        </div>
                        <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 bright_dp10_pcl7 h-100">
                          Gross Wt
                        </div>
                        <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 bright_dp10_pcl7 h-100">
                          {/* N+L */}
                          Net Wt
                        </div>
                        <div
                          className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 bright_dp10_pcl7 h-100"
                          style={{ width: "18%" }}
                        >
                          Rate
                        </div>
                        <div
                          className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 h-100"
                          style={{ width: "21%" }}
                        >
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col3dp10_pcl7">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100">
                        Stone & Misc
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10_pcl7 w-100">
                        <div
                          className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7"
                          style={{ width: "21.66%" }}
                        >
                          Code
                        </div>
                        <div className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7 ">
                          Size
                        </div>
                        <div
                          className="centerdp10_pcl7 h-100 bright_dp10_pcl7 theadsubcol1_dp10_pcl7"
                          style={{ width: "11.66%" }}
                        >
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
                    <div className="col7dp10_pcl7 border-end border-black">
                      <div className="h-50 centerdp10_pcl7 fw-bold w-100 bb_dp10_pcl7">
                        Labour & Other Charges
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50   w-100">
                        {/* <div className="w-50 h-100 centerdp10_pcl7 bright_dp10_pcl7">
                          Rate
                        </div> */}
                        <div
                          className=" h-100 centerdp10_pcl7  bright_dp10_pcl7"
                          style={{ width: "33.33%" }}
                        >
                          Charges
                        </div>
                        <div
                          className=" h-100 centerdp10_pcl7  bright_dp10_pcl7"
                          style={{ width: "33.33%" }}
                        >
                          Rate
                        </div>
                        <div
                          className=" h-100 centerdp10_pcl7 "
                          style={{ width: "33.33%" }}
                        >
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col8dp10_pcl7  border-black">
                      <div className="d-flex justify-content-center align-items-center h-50  w-100">
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
                      return (
                        <div className="summarydp10_pcl7" key={i}>
                          <div className="tbrowdp10_pcl7 h-100 ">
                            <div className="tbcol1dp10_pcl7 center_sdp10_pcl7 pad_top_pcl7">
                              {/* {e?.SrNo} */}
                              {i + 1}
                            </div>
                            <div className="tbcol2dp10_pcl7 d-flex justify-content-between">
                              {imgFlag && (
                                <div
                                  className=""
                                  style={{
                                    borderRight: "1px solid #BDBDBD",
                                    width: "50%",
                                    height: "100%",
                                  }}
                                >
                                  <div
                                    className="w-100 d-flex justify-content-center align-items-start fsgdp10_pcl7"
                                    style={{ minHeight: "80px" }}
                                  >
                                    <img
                                      src={e?.DesignImage}
                                      // src={e?.GroupJob === "" ? e?.DesignImage : result?.json1?.map((el) => el?.DesignImage)}
                                      onError={(e) => handleImageError(e)}
                                      alt="design"
                                      className="imgdp10_pcl7"
                                    />
                                  </div>
                                </div>
                              )}
                              <div style={{ width: imgFlag ? "50%" : "100%" }}>
                                <div className=" centerdp10_pcl7 fsgdp10_pcl7">
                                  {e?.designno}&nbsp;
                                </div>
                                <div className="centerdp10_pcl7 fsgdp10_pcl7">
                                  {atob(evn)?.toLowerCase() === "quote"
                                    ? ""
                                    : e?.GroupJob !== ""
                                    ? e?.GroupJob
                                    : e?.SrJobno}
                                </div>

                                <div>
                                  {e?.CertificateNo !== "" && (
                                    <div
                                      className="centerdp10_pcl7 fsgdp10_pcl7 text-break d-flex flex-wrap ps-1"
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        fontSize: "9px"
                                      }}
                                    >
                                      <span className="fw-bold">Certificate# :</span>{" "}
                                      <span>
                                        {e?.CertificateNo}
                                      </span>
                                    </div>
                                  )}
                                  {e?.HUID !== "" ? (
                                    <div
                                      className="centerdp10_pcl7 fsgdp10_pcl7 text-break ps-1"
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        fontSize: "9px"
                                      }}
                                    >
                                      <p className="fw-bold">HUID :{" "}</p>
                                      <span>
                                        {e?.HUID}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {e?.PO === "" ? (
                                    ""
                                  ) : (
                                    <div
                                      className="centerdp10_pcl7 fsgdp10 text-break ps-1"
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        fontSize: "9px"
                                      }}
                                    >
                                      <p className="fw-bold">PO:</p>{" "}
                                      <span>{e?.PO}</span>
                                    </div>
                                  )}
                                  {e?.lineid === "" ? (
                                    ""
                                  ) : (
                                    <div
                                      className="centerdp10_pcl7 fsgdp10 text-break ps-1"
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        fontSize: "9px"
                                      }}
                                    >
                                      <p className="fw-bold">L:</p> <span>{e?.lineid}</span>
                                    </div>
                                  )}
                                  {e?.Size === "" && (<div
                                    className="centerdp10_pcl7"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      fontSize: "9px"
                                    }}
                                  >
                                    <p className="fw-bold">Size:</p> <span>{e?.Size}</span>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="tbcol3dp10_pcl7 ">
                              {e?.diamonds?.map((el, idia) => {
                                return (
                                  <div
                                    className="d-flex pad_top_pcl7"
                                    key={idia}
                                  >
                                    <div
                                      className="theadsubcol1_dp10_pcl7"
                                      style={{
                                        wordBreak: "break-word",
                                        paddingLeft: "2px",
                                      }}
                                    >
                                      {el?.ShapeName} {el?.QualityName}&nbsp;
                                      {el?.Colorname}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 text-start ps-1"
                                      style={{ lineHeight: "8px !important" }}
                                    >
                                      {el?.SizeName}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                                      style={{ width: "10.66%" }}
                                    >
                                      {el?.Pcs}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 text-end end_dp10_pcl7 pr_dp10_pcl7"
                                      style={{ width: "16.66%" }}
                                    >
                                      {el?.Wt?.toFixed(3)}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 text-end end_dp10_pcl7 pr_dp10_pcl7"
                                      style={{ width: "16.66%" }}
                                    >
                                      {formatAmount(el?.Rate, 0)}
                                      {/* {formatAmount(((el?.Amount / result?.header?.CurrencyExchRate) / (el?.Wt)))} */}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 fw-bold end_dp10_pcl7 pr_dp10_pcl7"
                                      style={{ width: "22.66%" }}
                                    >
                                      {formatAmount(
                                        el?.Amount /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="tbcol4dp10_pcl7">
                              {e?.metal?.map((el, imet) => {
                                return (
                                  <div
                                    className="d-flex w-100 pad_top_pcl7"
                                    key={imet}
                                  >
                                    <div
                                      className="theadsubcol2_dp10_pcl7 d-flex justify-content-start border-end h-100 ps-1 border-end-0 text-break"
                                      style={{
                                        width: "21%",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {el?.ShapeName} {el?.QualityName}{" "}
                                      {el?.Colorname}
                                    </div>
                                    <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                      {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                                      {el?.IsPrimaryMetal === 1 &&
                                        e?.grosswt?.toFixed(3)}
                                    </div>
                                    <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                      {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                                      {/* { el?.IsPrimaryMetal === 1 ? ((el?.Wt - (e?.LossWt + e?.totals?.finding?.Wt))?.toFixed(3)) : (el?.Wt?.toFixed(3))} */}
                                      {el?.IsPrimaryMetal === 1
                                        ? (el?.Wt - e?.LossWt)?.toFixed(3)
                                        : el?.Wt?.toFixed(3)}
                                    </div>
                                    <div
                                      className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7"
                                      style={{ width: "18%" }}
                                    >
                                      {el?.Rate?.toFixed(2)}
                                    </div>
                                    <div
                                      className={`theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 pr_dp10_pcl7 ${
                                        el?.IsPrimaryMetal === 1
                                          ? "fw-bold"
                                          : "fw-bold"
                                      }`}
                                      style={{ width: "21%" }}
                                    >
                                      {/* {formatAmount(((el?.Amount) / result?.header?.CurrencyExchRate))} */}
                                      {/* { formatAmount((el?.IsPrimaryMetal === 1 ? (((el?.Wt - (e?.LossWt + e?.totals?.finding?.Wt)) * el?.Rate)) : (el?.Amount))) } */}
                                      {formatAmount(
                                        el?.IsPrimaryMetal === 1
                                          ? (el?.Wt - e?.LossWt) * el?.Rate
                                          : el?.Amount /
                                              result?.header?.CurrencyExchRate
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              {e?.LossWt === 0 ? (
                                ""
                              ) : (
                                <div className="d-flex w-100">
                                  <div
                                    className="theadsubcol2_dp10_pcl7 d-flex justify-content-start border-end h-100 ps-1 border-end-0 text-break"
                                    style={{
                                      width: "21%",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    Loss Wt
                                  </div>
                                  <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                    {e?.LossPer?.toFixed(3)} %
                                  </div>
                                  <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 ">
                                    {e?.LossWt?.toFixed(3)}
                                  </div>
                                  <div
                                    className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7"
                                    style={{ width: "18%" }}
                                  >
                                    {formatAmount(
                                      e?.LossAmt /
                                        (e?.LossWt === 0 ? 1 : e?.LossWt)
                                    )}
                                  </div>
                                  <div
                                    className={`theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 pr_dp10_pcl7 fw-bold`}
                                    style={{ width: "21%" }}
                                  >
                                    {formatAmount(e?.LossAmt)}
                                  </div>
                                </div>
                              )}

                              {
                                // e?.totals?.finding?.Wt === 0 ? '' :
                                // <>
                                // {
                                //   e?.finding?.map((e, i) => {
                                //     return <div className="d-flex w-100" key={i}>
                                //     <div className="theadsubcol2_dp10_pcl7 d-flex justify-content-start border-end h-100 ps-1 border-end-0 text-break" style={{ width: "21%", wordBreak:'break-word' }} >
                                //       FINDING ACESSORIES
                                //     </div>
                                //     <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                //     </div>
                                //     <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7">
                                //       {/* {e?.totals?.finding?.Wt?.toFixed(3)} */}
                                //       {e?.Wt?.toFixed(3)}
                                //     </div>
                                //     <div className="theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7" style={{width:'18%'}}>
                                //     {/* { formatAmount(e?.metal_rate) } */}
                                //     </div>
                                //     <div className={`theadsubcol2_dp10_pcl7 centerdp10_pcl7 border-end h-100 pe-1 border-end-0 end_dp10_pcl7 pr_dp10_pcl7 `} style={{width:'21%'}}>
                                //       {/* {formatAmount(((e?.totals?.finding?.Wt * e?.metal_rate) / result?.header?.CurrencyExchRate))} */}
                                //       {formatAmount(e?.Amount)}
                                //     </div>
                                //   </div>
                                //   })
                                // }
                                // </>
                              }
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
                                  <div
                                    className="d-flex pad_top_pcl7"
                                    key={ics}
                                  >
                                    <div
                                      className="theadsubcol1_dp10_pcl7"
                                      style={{
                                        wordBreak: "break-word",
                                        paddingLeft: "2px",
                                        width: "21.66%",
                                      }}
                                    >
                                      {el?.ShapeName +
                                        " " +
                                        el?.QualityName +
                                        " " +
                                        el?.Colorname}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 text-center">
                                      {el?.SizeName}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 end_dp10_pcl7"
                                      style={{ width: "11.66%" }}
                                    >
                                      {el?.Pcs}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                      {el?.Wt?.toFixed(3)}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                      {/* {el?.Rate?.toFixed(2)} */}
                                      {formatAmount(
                                        el?.Amount /
                                          result?.header?.CurrencyExchRate /
                                          (el?.isRateOnPcs === 0
                                            ? el?.Wt === 0
                                              ? 1
                                              : el?.Wt
                                            : el?.Pcs === 0
                                            ? 1
                                            : el?.Pcs),
                                        0
                                      )}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 fw-bold pr_dp10_pcl7">
                                      {formatAmount(
                                        el?.Amount /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              {e?.misc?.map((el, ics) => {
                                return (
                                  <div
                                    className="d-flex pad_top_pcl7"
                                    key={ics}
                                  >
                                    <div
                                      className="theadsubcol1_dp10_pcl7"
                                      style={{
                                        wordBreak: "break-word",
                                        paddingLeft: "2px",
                                        width: "21.66%",
                                      }}
                                    >
                                      M: {el?.ShapeName + " " + el?.QualityName}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 text-center">
                                      {el?.SizeName}
                                    </div>
                                    <div
                                      className="theadsubcol1_dp10_pcl7 end_dp10_pcl7"
                                      style={{ width: "11.66%" }}
                                    >
                                      {el?.Pcs}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                      {el?.Wt?.toFixed(3)}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                      {/* {el?.Rate?.toFixed(2)} */}
                                      {formatAmount(
                                        el?.Amount /
                                          result?.header?.CurrencyExchRate /
                                          (el?.isRateOnPcs === 0
                                            ? el?.Wt === 0
                                              ? 1
                                              : el?.Wt
                                            : el?.Pcs === 0
                                            ? 1
                                            : el?.Pcs),
                                        0
                                      )}
                                    </div>
                                    <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 fw-bold pr_dp10_pcl7">
                                      {formatAmount(
                                        el?.Amount /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
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
                            <div className="tbcol7dp10_pcl7 border-end border-black">
                              <div className="d-flex flex-column pad_top_pcl7">
                                {/* <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div> */}

                                {e?.MakingAmount !== 0 && (
                                  <div className="d-flex align-items-center w-100 fsgdp10_pcl7">
                                    <div
                                      style={{ width: "33.33%" }}
                                      className=" text-start fsgdp10_pcl7"
                                    >
                                      Labour
                                    </div>
                                    <div
                                      style={{ width: "33.33%" }}
                                      className="pr_dp10_pcl7 text-end fsgdp10_pcl7"
                                    >
                                      {formatAmount(e?.MaKingCharge_Unit, 0)}
                                    </div>
                                    <div
                                      style={{ width: "33.33%" }}
                                      className="pr_dp10_pcl7 text-end fsgdp10_pcl7"
                                    >
                                      {formatAmount(
                                        e?.MakingAmount /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
                                    </div>
                                  </div>
                                )}
                                {e?.stone_misc
                                    .filter(el => el?.ShapeName === "Hallmark")
                                    .map((el, ics) => (
                                    <div className="d-flex pad_top_pcl7" key={ics}>
                                      <div style={{ width: "33.33%" }} className=" text-start fsgdp10_pcl7">
                                        {el?.ShapeName}
                                      </div>
                                      <div style={{ width: "33.33%" }} className="pr_dp10_pcl7 text-end"></div>
                                      <div style={{ width: "33.33%" }} className="pr_dp10_pcl7 text-end fsgdp10_pcl7">
                                        {( el?.Amount )?.toFixed(0)}
                                      </div>
                                    </div>
                                ))}
                                {e?.totals?.finding?.SettingAmount !== 0 && (
                                  <div className="d-flex align-items-center w-100 fsgdp10_pcl7">
                                    <div
                                      style={{ width: "33.33%" }}
                                      className=" text-start fsgdp10_pcl7"
                                    >
                                      Labour
                                    </div>
                                    <div
                                      style={{ width: "33.33%" }}
                                      className="pr_dp10_pcl7 text-end fsgdp10_pcl7"
                                    >
                                      {formatAmount(
                                        e?.totals?.finding?.SettingRate,
                                        0
                                      )}
                                    </div>
                                    <div
                                      style={{ width: "33.33%" }}
                                      className="pr_dp10_pcl7 text-end fsgdp10_pcl7"
                                    >
                                      {formatAmount(
                                        e?.totals?.finding?.SettingAmount /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
                                    </div>
                                  </div>
                                )}
                                {e?.other_details?.map((el, ind) => {
                                  return (
                                    <div
                                      className="d-flex align-items-center w-100 fsgdp10_pcl7"
                                      key={ind}
                                    >
                                      <div
                                        style={{ width: "58%" }}
                                        className=" text-start text-break fsgdp10_pcl7 spbrWord"
                                      >
                                        {el?.label}
                                      </div>
                                      <div
                                        style={{ width: "5%" }}
                                        className="pr_dp10_pcl7 text-end"
                                      ></div>
                                      <div
                                        style={{ width: "38.33%" }}
                                        className="pr_dp10_pcl7 text-end fsgdp10_pcl7"
                                      >
                                        {formatAmount(el?.amtval, 0)}
                                      </div>
                                    </div>
                                  );
                                })}
                                {e?.totals?.diamonds?.SettingAmount +
                                  e?.totals?.colorstone?.SettingAmount !==
                                  0 && (
                                  <div className="d-flex align-items-center w-100 fsgdp10_pcl7">
                                    <div className="w-50 text-start fsgdp10_pcl7">
                                      Setting
                                    </div>
                                    <div className="w-50 pr_dp10_pcl7 text-end fsgdp10_pcl7">
                                      {formatAmount(
                                        (e?.totals?.diamonds?.SettingAmount +
                                          e?.totals?.colorstone
                                            ?.SettingAmount) /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
                                    </div>
                                  </div>
                                )}
                                {e?.TotalDiamondHandling !== 0 && (
                                  <div className="d-flex align-items-center w-100 fsgdp10_pcl7">
                                    <div className="w-50  text-start fsgdp10_pcl7">
                                      Handling
                                    </div>
                                    <div className="w-50 pr_dp10_pcl7 text-end fsgdp10_pcl7">
                                      {formatAmount(
                                        e?.TotalDiamondHandling /
                                          result?.header?.CurrencyExchRate,
                                        0
                                      )}
                                    </div>
                                  </div>
                                )}

                                {e?.miscList_IsHSCODE123?.map((e) => {
                                  return (
                                    <div className="d-flex align-items-center w-100 fsgdp10_pcl7">
                                      {e?.Amount !== 0 && (
                                        <div className="w-50  text-start fsgdp10_pcl7">
                                          {e?.IsHSCOE === 3 && e?.ShapeName}
                                        </div>
                                      )}
                                      {e?.Amount !== 0 && (
                                        <div className="w-50 pr_dp10_pcl7 text-end fsgdp10_pcl7">
                                          {e?.IsHSCOE === 3 &&
                                            formatAmount(
                                              e?.Amount /
                                                result?.header
                                                  ?.CurrencyExchRate,
                                              0
                                            )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* <div className="w-100 end_dp10_pcl7  pr_dp10_pcl7">
                                {formatAmount( ((e?.MakingAmount + e?.totals?.finding?.SettingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost) / result?.header?.CurrencyExchRate) )}
                              </div> */}
                              </div>
                            </div>

                            <div className="tbcol8dp10_pcl7 end_dp10_pcl7 fw-bold  pr_dp10_pcl7 border-start pad_top_pcl7 ">
                              {/* {formatAmount((e?.TotalAmount + e?.DiscountAmt))} */}
                              {formatAmount(
                                e?.UnitCost / result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>

                          <div className="d-flex grandtotaldp10_pcl7 brb_dp10_pcl7  tbrowdp10_pcl7 border-top-0 bb_dp10_pcl7">
                            <div className="col1dp10_pcl7 "></div>
                            <div
                              style={{
                                width: "6.3%",
                                borderRight: imgFlag && "1px solid #BDBDBD",
                              }}
                            ></div>
                            <div
                              className="border-end-0 "
                              style={{ width: "6.2%" }}
                            ></div>
                            {/* <div className="centerdp10_pcl7 " style={{ width: "12.1%", borderTop:'1px solid white' }} >  </div> */}
                            <div
                              className="col3dp10_pcl7 d-flex align-items-center bl_dp10_pcl7 bt_dp10_pcl7"
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              <div className="theadsubcol1_dp10_pcl7">
                                &nbsp;
                              </div>
                              <div className="theadsubcol1_dp10_pcl7">
                                &nbsp;
                              </div>
                              <div
                                className="theadsubcol1_dp10_pcl7 end_dp10_pcl7"
                                style={{ width: "10.66%" }}
                              >
                                {e?.totals?.diamonds?.Pcs !== 0 &&
                                  e?.totals?.diamonds?.Pcs}
                              </div>
                              <div
                                className="theadsubcol1_dp10_pcl7 end_dp10_pcl7"
                                style={{ width: "16.66%" }}
                              >
                                {e?.totals?.diamonds?.Wt !== 0 &&
                                  e?.totals?.diamonds?.Wt?.toFixed(3)}
                              </div>
                              <div
                                className="theadsubcol1_dp10_pcl7"
                                style={{ width: "15.66%" }}
                              >
                                &nbsp;
                              </div>
                              <div
                                className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                                style={{ width: "23.66%" }}
                              >
                                {e?.totals?.diamonds?.Amount !== 0 &&
                                  formatAmount(
                                    e?.totals?.diamonds?.Amount /
                                      result?.header?.CurrencyExchRate,
                                    0
                                  )}
                              </div>
                              {/* <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7"></div>
                      <div className="theadsubcol1_dp10_pcl7 centerdp10_pcl7" style={{width:'11.66%'}}>
                        { e?.totals?.diamonds?.Pcs !== 0 && e?.totals?.diamonds?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7 " style={{width:'17.66%'}}>
                        { e?.totals?.diamonds?.Wt !== 0 && e?.totals?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7" style={{ width: "33.332%" }} >
                        { e?.totals?.diamonds?.Amount !== 0 && formatAmount((e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate))}
                      </div> */}
                            </div>
                            <div
                              className="col4dp10_pcl7 d-flex align-items-center bt_dp10_pcl7"
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              {/* <div className="theadsubcol2_dp10_pcl7"  ></div> */}
                              <div
                                className="theadsubcol2_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                                style={{ width: "42%" }}
                              >
                                {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                                {/* {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} */}
                                {e?.grosswt?.toFixed(3)}
                              </div>
                              <div className="theadsubcol2_dp10_pcl7 pr_dp10_pcl7 end_dp10_pcl7">
                                {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                                {/* {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} */}
                                {/* {  ((e?.totals?.metal?.IsPrimaryMetal + e?.LossWt)?.toFixed(3))} */}
                                {e?.totals?.metal?.Wt?.toFixed(3)}
                              </div>
                              {/* <div className="theadsubcol2_dp10"></div> */}
                              <div
                                className="theadsubcol2_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                                style={{ width: "43%" }}
                              >
                                {/* {formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)} */}
                                {formatAmount(
                                  e?.totals?.metal?.Amount /
                                    result?.header?.CurrencyExchRate
                                )}
                              </div>
                            </div>
                            <div
                              className="col3dp10_pcl7 d-flex align-items-center bt_dp10_pcl7 "
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              <div className="theadsubcol1_dp10_pcl7"></div>
                              <div className="theadsubcol1_dp10_pcl7"></div>
                              <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                {/* {result?.mainTotal?.colorstone?.Pcs} */}
                                {e?.totals?.colorstone?.Pcs +
                                  e?.totals?.misc?.onlyIsHSCODE0_Pcs !==
                                  0 &&
                                  e?.totals?.colorstone?.Pcs +
                                    e?.totals?.misc?.onlyIsHSCODE0_Pcs}
                              </div>
                              <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                                {/* {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} */}
                                {e?.totals?.colorstone?.Wt +
                                  e?.totals?.misc?.onlyIsHSCODE0_Wt !==
                                  0 &&
                                  (
                                    e?.totals?.colorstone?.Wt +
                                    e?.totals?.misc?.onlyIsHSCODE0_Wt
                                  )?.toFixed(3)}
                              </div>
                              {/* <div className="theadsubcol1_dp10_pcl7"></div> */}
                              <div
                                className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                                style={{ width: "33.32%" }}
                              >
                                {/* {formatAmount(result?.mainTotal?.colorstone?.Amount)} */}
                                {e?.totals?.colorstone?.Amount +
                                  e?.totals?.misc?.onlyIsHSCODE0_Amount !==
                                  0 &&
                                  formatAmount(
                                    (e?.totals?.colorstone?.Amount +
                                      e?.totals?.misc?.onlyIsHSCODE0_Amount) /
                                      result?.header?.CurrencyExchRate,
                                    0
                                  )}
                              </div>
                            </div>
                            {/* <div className="col6dp10_pcl7 end_dp10_pcl7  d-flex align-items-center brR_dp10_pcl7 pr_dp10_pcl7" style={{width:'5%', paddingRight:'1px'}}>
                      {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                    </div> */}
                            <div
                              className="col7dp10_pcl7 end_dp10_pcl7  d-flex align-items-center  pr_dp10_pcl7  bt_dp10_pcl7"
                              style={{
                                backgroundColor: "#F5F5F5",
                                borderRight: "1px solid black",
                              }}
                            >
                              {/* {formatAmount( result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost )} */}
                              <div>
                                {formatAmount(
                                  (e?.MakingAmount +
                                    e?.totals?.misc?.isHSCODE123_amt +
                                    e?.OtherCharges +
                                    e?.TotalDiamondHandling +
                                    e?.TotalCsSetcost +
                                    e?.TotalDiaSetcost +
                                    e?.totals?.finding?.SettingAmount) /
                                    result?.header?.CurrencyExchRate,
                                  0
                                )}
                              </div>
                            </div>
                            <div
                              className="col8dp10_pcl7 end_dp10_pcl7  d-flex align-items-center pr_dp10_pcl7 border-start bt_dp10_pcl7 "
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              {/* {formatAmount(result?.finalAmount)} */}
                              {formatAmount(
                                e?.UnitCost / result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="my-1"></div>
                  <div className="pgia_pcl7">
                    {/* main total */}
                    <div
                      className="d-flex grandtotaldp10_pcl7 brb_dp10_pcl7  tbrowdp10_pcl7 border-top border-black fsgdp10_pcl7"
                      style={{ backgroundColor: "#F5F5F5" }}
                    >
                      <div
                        className="centerdp10_pcl7 brR_dp10_pcl7"
                        style={{ width: "14.8%" }}
                      >
                        {" "}
                        Total{" "}
                      </div>
                      <div className="col3dp10_pcl7 d-flex align-items-center brR_dp10_pcl7">
                        <div className="theadsubcol1_dp10_pcl7">&nbsp;</div>
                        <div className="theadsubcol1_dp10_pcl7">&nbsp;</div>
                        <div
                          className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 "
                          style={{ width: "10.66%" }}
                        >
                          {result?.mainTotal?.diamonds?.Pcs}
                        </div>
                        <div
                          className="theadsubcol1_dp10_pcl7 end_dp10_pcl7"
                          style={{ width: "16.66%" }}
                        >
                          {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                        </div>
                        <div
                          className="theadsubcol1_dp10_pcl7"
                          style={{ width: "15.66%" }}
                        >
                          &nbsp;
                        </div>
                        <div
                          className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                          style={{ width: "23.66%" }}
                        >
                          {formatAmount(
                            result?.mainTotal?.diamonds?.Amount /
                              result?.header?.CurrencyExchRate,
                            0
                          )}
                        </div>
                      </div>
                      <div className="col4dp10_pcl7 d-flex align-items-center brR_dp10_pcl7">
                        <div className="theadsubcol2_dp10_pcl7"></div>
                        <div className="theadsubcol2_dp10_pcl7 end_dp10_pcl7">
                          {result?.mainTotal?.grosswt?.toFixed(3)}
                        </div>
                        <div className="theadsubcol2_dp10_pcl7 pr_dp10_pcl7 end_dp10_pcl7">
                          {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                          {result?.mainTotal?.metal?.Wt?.toFixed(3)}
                        </div>
                        {/* <div className="theadsubcol2_dp10"></div> */}
                        <div
                          className="theadsubcol2_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                          style={{ width: "42%" }}
                        >
                          {formatAmount(
                            result?.mainTotal?.metal?.Amount /
                              result?.header?.CurrencyExchRate
                          )}
                        </div>
                      </div>
                      <div className="col3dp10_pcl7 d-flex align-items-center brR_dp10_pcl7">
                        <div className="theadsubcol1_dp10_pcl7"></div>
                        <div className="theadsubcol1_dp10_pcl7"></div>
                        <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                          {result?.mainTotal?.colorstone?.Pcs +
                            result?.mainTotal?.misc?.onlyIsHSCODE0_Pcs}
                        </div>
                        <div className="theadsubcol1_dp10_pcl7 end_dp10_pcl7">
                          {(
                            result?.mainTotal?.colorstone?.Wt +
                            result?.mainTotal?.misc?.onlyIsHSCODE0_Wt
                          )?.toFixed(3)}
                        </div>
                        {/* <div className="theadsubcol1_dp10_pcl7"></div> */}
                        <div
                          className="theadsubcol1_dp10_pcl7 end_dp10_pcl7 pr_dp10_pcl7"
                          style={{ width: "33.32%" }}
                        >
                          {formatAmount(
                            (result?.mainTotal?.colorstone?.Amount +
                              result?.mainTotal?.misc?.onlyIsHSCODE0_Amount) /
                              result?.header?.CurrencyExchRate,
                            0
                          )}
                        </div>
                      </div>
                      {/* <div className="col6dp10_pcl7 end_dp10_pcl7  d-flex align-items-center brR_dp10_pcl7 pr_dp10_pcl7" style={{width:'5%', paddingRight:'1px'}}>
                        {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                      </div> */}
                      <div className="col7dp10_pcl7 end_dp10_pcl7  d-flex align-items-center  pr_dp10_pcl7  border-end-0">
                        {formatAmount(
                          (result?.mainTotal?.total_Making_Amount +
                            result?.mainTotal?.total_diamondHandling +
                            result?.mainTotal?.misc?.isHSCODE123_amt +
                            result?.mainTotal?.total_TotalDiaSetcost +
                            result?.mainTotal?.total_TotalCsSetcost +
                            result?.mainTotal?.finding?.SettingAmount +
                            result?.mainTotal?.total_other_charges) /
                            result?.header?.CurrencyExchRate,
                          0
                        )}
                      </div>
                      <div className="col8dp10_pcl7 end_dp10_pcl7  d-flex align-items-center pr_dp10_pcl7 border-start border-black">
                        {formatAmount(
                          result?.mainTotal?.total_unitcost /
                            result?.header?.CurrencyExchRate
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end align-items-start brb_dp10_pcl7 tbrowdp10_pcl7 border-bottom border-black">
                      <div
                        style={{
                          width: "83%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          borderRight: "1px solid",
                        }}
                      >
                        <div className="text-start ps-1 pt-1 fs_5_pcl7">
                          No. Of Items :{" "}
                          <span className="fw-bold">
                            {result?.resultArray?.length}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <div className="d-flex flex-column sumdp10_pcl7">
                            <div className="fw-bold bg_dp10_pcl7 w-100 centerdp10_pcl7  ball_dp10_pcl7">
                              SUMMARY
                            </div>
                            <div className="d-flex w-100 fsgdp10_pcl7">
                              <div className="w-50 bright_dp10_pcl7  bl_dp10_pcl7">
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">
                                    GOLD IN 24KT
                                  </div>
                                  <div className="w-50 end_dp10_pcl7 pe-1">
                                    {(
                                      result?.mainTotal?.total_purenetwt -
                                      notGoldMetalWtTotal
                                    )?.toFixed(3)}{" "}
                                    gm
                                  </div>
                                </div>
                                {MetShpWise?.map((e, i) => {
                                  return (
                                    <div
                                      className="d-flex justify-content-between px-1"
                                      key={i}
                                    >
                                      <div className="w-50 fw-bold">
                                        {e?.ShapeName}
                                      </div>
                                      <div className="w-50 end_dp10_pcl7 pe-1">
                                        {e?.metalfinewt?.toFixed(3)} gm
                                      </div>
                                    </div>
                                  );
                                })}
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">GROSS WT</div>
                                  <div className="w-50 end_dp10_pcl7 pe-1">
                                    {result?.mainTotal?.grosswt?.toFixed(3)} gm
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">NET WT</div>
                                  <div className="w-50 end_dp10_pcl7 pe-1">
                                    {result?.mainTotal?.metal?.Wt?.toFixed(3)}{" "}
                                    gm
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
                                    {result?.mainTotal?.diamonds?.Wt?.toFixed(
                                      3
                                    )}{" "}
                                    cts
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">STONE WT</div>
                                  <div className="w-50 end_dp10_pcl7 pe-1">
                                    {result?.mainTotal?.colorstone?.Pcs} /{" "}
                                    {result?.mainTotal?.colorstone?.Wt?.toFixed(
                                      3
                                    )}{" "}
                                    cts
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">MISC WT</div>
                                  <div className="w-50 end_dp10_pcl7 pe-1">
                                    {result?.mainTotal?.misc?.onlyIsHSCODE0_Pcs}{" "}
                                    /{" "}
                                    {result?.mainTotal?.misc?.onlyIsHSCODE0_Wt?.toFixed(
                                      3
                                    )}{" "}
                                    gm
                                  </div>
                                </div>
                              </div>
                              <div className="w-50 bright_dp10_pcl7 ">
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">GOLD</div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      (result?.mainTotal?.metal?.Amount -
                                        notGoldMetalTotal) /
                                        result?.header?.CurrencyExchRate
                                    )}
                                  </div>
                                </div>
                                {MetShpWise?.map((e, i) => {
                                  return (
                                    <div
                                      className="d-flex justify-content-between px-1"
                                      key={i}
                                    >
                                      <div className="w-50 fw-bold">
                                        {e?.ShapeName}
                                      </div>
                                      <div className="w-50 end_dp10_pcl7">
                                        {formatAmount(
                                          e?.Amount /
                                            result?.header?.CurrencyExchRate
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">DIAMOND</div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      result?.mainTotal?.diamonds?.Amount /
                                        result?.header?.CurrencyExchRate,
                                      0
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">CST</div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      result?.mainTotal?.colorstone?.Amount /
                                        result?.header?.CurrencyExchRate,
                                      0
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">MISC</div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      result?.mainTotal?.misc
                                        ?.onlyIsHSCODE0_Amount /
                                        result?.header?.CurrencyExchRate,
                                      0
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">MAKING </div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      (// result?.mainTotal?.misc?.isHSCODE123_amt +
                                        result?.mainTotal?.finding
                                          ?.SettingAmount +
                                        result?.mainTotal?.total_labour
                                          ?.labour_amount +
                                        result?.mainTotal
                                          ?.total_TotalDiaSetcost +
                                        result?.mainTotal
                                          ?.total_TotalCsSetcost) /
                                        result?.header?.CurrencyExchRate,
                                      0
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">OTHER </div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      (result?.mainTotal?.total_other_charges / result?.header?.CurrencyExchRate) +
                                        result?.mainTotal?.total_diamondHandling, 0
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between px-1">
                                  <div className="w-50 fw-bold">
                                    {result?.header?.AddLess > 0
                                      ? "ADD"
                                      : "LESS"}
                                  </div>
                                  <div className="w-50 end_dp10_pcl7">
                                    {formatAmount(
                                      result?.header?.AddLess /
                                        result?.header?.CurrencyExchRate
                                    )}
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
                                    result?.mainTotal?.total_amount /
                                      result?.header?.CurrencyExchRate +
                                      result?.allTaxesTotal +
                                      result?.header?.FreightCharges /
                                        result?.header?.CurrencyExchRate +
                                      result?.header?.AddLess /
                                        result?.header?.CurrencyExchRate
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="dia_sum_dp10_pcl7 d-flex flex-column  fsgdp10_pcl7  border-start border-end">
                            <div className="h_bd10_pcl7 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                              Diamond Detail
                            </div>
                            {/* {diamondWise?.map((e, i) => {
                            return (
                              <div
                                className="d-flex justify-content-between px-1 ball_dp10_pcl7 border-top-0 border-bottom-0 fsgdp10_pcl7"
                                key={i}
                              >
                                <div className="fw-bold w-50">
                                  {e?.ShapeName} {e?.QualityName} {e?.Colorname}
                                </div>
                                <div className="w-50 end_dp10_pcl7">
                                  {e?.pcPcss} / {e?.wtWts?.toFixed(3)} cts
                                </div>
                              </div>
                            );
                          })} */}
                            <div className="d-flex flex-column justify-content-start h-100">
                              {diamondDetails?.map((e, i) => {
                                return (
                                  e?.Wt !== undefined && (
                                    <React.Fragment key={i}>
                                      <div
                                        className={`d-flex justify-content-between px-1 pb-1  align-items-center ${
                                          i === 0 && "pt-1"
                                        }`}
                                      >
                                        <p className="fw-bold">
                                          {e?.ShapeName === "OTHER" ? (
                                            e?.ShapeName
                                          ) : (
                                            <>
                                              {e?.ShapeName} {e?.QualityName}{" "}
                                              {e?.Colorname}
                                            </>
                                          )}
                                        </p>
                                        <p>
                                          {NumberWithCommas(e?.Pcs, 0)}/
                                          {NumberWithCommas(e?.Wt, 3)} Cts
                                        </p>
                                      </div>
                                    </React.Fragment>
                                  )
                                );
                              })}
                            </div>
                            <div className="d-flex justify-content-between px-1 bg_dp10_pcl7 h_bd10_pcl7  ball_dp10_pcl7">
                              <div className="fw-bold w-50 h14_dp10_pcl7"></div>
                              <div className="w-50"></div>
                            </div>
                          </div>
                          <div className="oth_sum_dp10_pcl7 fsgdp10_pcl7">
                            <div className="h_bd10 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                              OTHER DETAILS
                            </div>
                            <div className="d-flex flex-column justify-content-between w-100 px-1 ball_dp10_pcl7 border-top-0 p-1  fw-bold">
                              <div className="d-flex">
                                <div className="w-50 fw-bold start_dp10_pcl7 fsgdp10_pcl7">
                                  RATE IN 24KT
                                </div>
                                <div className="w-50 end_dp10_pcl7 fsgdp10_pcl7">
                                  {result?.header?.MetalRate24K?.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                {result?.header?.BrokerageDetails?.map(
                                  (e, i) => {
                                    return (
                                      <div
                                        className="d-flex fsgdp10_pcl7"
                                        key={i}
                                      >
                                        <div className="w-50 fw-bold start_dp10_pcl7">
                                          {e?.label}
                                        </div>
                                        <div className="w-50 end_dp10_pcl7">
                                          {e?.value}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="remark_sum_dp10_pcl7 fsgdp10_pcl7">
                            {result?.header?.PrintRemark === "" ? (
                              ""
                            ) : (
                              <>
                                <div className="h_bd10 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                                  Remark
                                </div>
                                <div
                                  className="ball_dp10_pcl7 border-top-0 p-1"
                                  dangerouslySetInnerHTML={{
                                    __html: result?.header?.PrintRemark,
                                  }}
                                ></div>
                              </>
                            )}
                          </div>
                          {/* No. Of Items :{" "}
                        <span className="fw-bold">
                          {result?.resultArray?.length}
                        </span> */}
                        </div>
                      </div>
                      <div
                        className="border-black"
                        style={{ width: "17%", borderTop: "0px solid black" }}
                      >
                        {result?.mainTotal?.total_discount_amount !== 0 && (
                          <div className="d-flex justify-content-between fs_5_pcl7">
                            <div className="w-50 end_dp10_pcl7">
                              Total Discount
                            </div>
                            <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                              {formatAmount(
                                result?.mainTotal?.total_discount_amount /
                                  result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                        )}
                        <div className="d-flex justify-content-between fs_5_pcl7">
                          <div className="w-50 end_dp10_pcl7">Total Amount</div>
                          <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                            {formatAmount(
                              result?.mainTotal?.total_amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                        <div>
                          {result?.allTaxes?.map((e, i) => {
                            return (
                              <div
                                className="d-flex justify-content-between fs_5_pcl7"
                                key={i}
                              >
                                <div className="w-50 end_dp10_pcl7">
                                  {" "}
                                  {e?.name} {e?.per}{" "}
                                </div>
                                <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                                  {" "}
                                  {formatAmount(e?.amountInNumber)}{" "}
                                </div>
                              </div>
                            );
                          })}
                          <div className="d-flex justify-content-between fs_5_pcl7">
                            <div className="w-50 end_dp10_pcl7">
                              {result?.header?.AddLess > 0 ? "Add" : "Less"}
                            </div>
                            <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                              {formatAmount(
                                result?.header?.AddLess /
                                  result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between fs_5_pcl7">
                          <div className="w-50 end_dp10_pcl7">
                            {result?.header?.ModeOfDel}
                          </div>
                          <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                            {formatAmount(
                              result?.header?.FreightCharges /
                                result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                        <div
                          className="d-flex justify-content-between fw-bold fs_5_pcl7 "
                          style={{ borderTop: "1px solid black" }}
                        >
                          <div className="w-50 end_dp10_pcl7">Final Amount</div>
                          <div className="w-50 end_dp10_pcl7 pr_dp10_pcl7">
                            {formatAmount(
                              result?.mainTotal?.total_amount /
                                result?.header?.CurrencyExchRate +
                                result?.allTaxesTotal +
                                result?.header?.FreightCharges /
                                  result?.header?.CurrencyExchRate +
                                result?.header?.AddLess /
                                  result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* summary */}
                {/* <div>
                  {result?.header?.PrintRemark === "" ? (
                    <div style={{ width: "15%" }}></div>
                  ) : (
                    <div className="remark_sum_dp10_pcl7 fsgdp10_pcl7">
                      <div className="h_bd10 centerdp10_pcl7 bg_dp10_pcl7 fw-bold ball_dp10_pcl7">
                        Remark
                      </div>
                      <div
                        className="ball_dp10_pcl7 border-top-0 p-1"
                        dangerouslySetInnerHTML={{
                          __html: result?.header?.PrintRemark,
                        }}
                      ></div>
                    </div>
                  )}
                </div> */}
                <div className="d-flex justify-content-between mt-1">
                  <div
                    className=" ball_dp10_pcl7 d-flex justify-content-center align-items-end pb-1 "
                    style={{ minHeight: "50px", width: "50%" }}
                  >
                    <i>Created By</i>
                  </div>
                  <div
                    className=" ball_dp10_pcl7 d-flex justify-content-center align-items-end pb-1"
                    style={{ minHeight: "50px", width: "50%" }}
                  >
                    <i>Checked By</i>
                  </div>
                </div>
                <div
                  style={{ color: "gray", fontSize: "10px" }}
                  className="pt-3"
                >
                  ** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US
                  IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF
                  TRANSACTIONS
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

export default PackingList7;
