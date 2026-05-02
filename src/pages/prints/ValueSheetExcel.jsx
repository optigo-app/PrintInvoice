// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0syMTA0MjAyNA==&evn=c2FsZQ==&pnm=cGFja2luZyBsaXN0&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
//http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=anMzNDc=&evn=U2FsZQ==&pnm=dmFsdWVTaGVldA==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&etp=ZXhjZWw=&ctv=NzE=
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleImageError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import "../../assets/css/prints/packingliste.css";
import Button from "../../GlobalFunctions/Button";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import { cloneDeep } from "lodash";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ValueSheetExcel = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [priceFlag, setPriceFlag] = useState(true);

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [diaGroupFlag, setDiaGroupFlag] = useState(false);

  const [diamondArr, setDiamondArr] = useState([]);
  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
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
          //   setMsg(data?.Message);
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
  }, [diaGroupFlag]);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeInvoicePrintData(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    datas.header.PrintRemark = datas.header.PrintRemark?.replace(
      /<br\s*\/?>/gi,
      ""
    );

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

          finalArr[find_record].diamonds = [
            ...finalArr[find_record]?.diamonds,
            ...b?.diamonds,
          ]?.flat();
          finalArr[find_record].colorstone = [
            ...finalArr[find_record]?.colorstone,
            ...b?.colorstone,
          ]?.flat();
          finalArr[find_record].metal = [
            ...finalArr[find_record]?.metal,
            ...b?.metal,
          ]?.flat();
          finalArr[find_record].misc = [
            ...finalArr[find_record]?.misc,
            ...b?.misc,
          ]?.flat();
          finalArr[find_record].misc_0List = [
            ...finalArr[find_record]?.misc_0List,
            ...b?.misc_0List,
          ]?.flat();
          finalArr[find_record].finding = [
            ...finalArr[find_record]?.finding,
            ...b?.finding,
          ]?.flat();
          finalArr[find_record].other_details_array = [
            ...finalArr[find_record]?.other_details_array,
            ...b?.other_details_array,
          ]?.flat();

          finalArr[find_record].other_details_array_amount +=
            b?.other_details_array_amount;

          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount +=
            b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.diamonds.SettingAmount +=
            b?.totals?.diamonds?.SettingAmount;

          finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
          finalArr[find_record].totals.finding.Rate = b?.totals?.finding?.Rate;
          finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
          finalArr[find_record].totals.finding.Amount +=
            b?.totals?.finding?.Amount;
          finalArr[find_record].totals.finding.SettingAmount +=
            b?.totals?.finding?.SettingAmount;
          finalArr[find_record].totals.finding.FineWt +=
            b?.totals?.finding?.FineWt;

          finalArr[find_record].totals.colorstone.Wt +=
            b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs +=
            b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount +=
            b?.totals?.colorstone?.Amount;
          finalArr[find_record].totals.colorstone.SettingAmount +=
            b?.totals?.colorstone?.SettingAmount;

          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
          finalArr[find_record].totals.misc.SettingAmount +=
            b?.totals?.misc?.SettingAmount;

          finalArr[find_record].totals.misc.IsHSCODE_0_amount +=
            b?.totals?.misc?.IsHSCODE_0_amount;
          finalArr[find_record].totals.misc.IsHSCODE_0_pcs +=
            b?.totals?.misc?.IsHSCODE_0_pcs;
          finalArr[find_record].totals.misc.IsHSCODE_0_wt +=
            b?.totals?.misc?.IsHSCODE_0_wt;

          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
          finalArr[find_record].totals.metal.Pcs += b?.totals?.metal?.Pcs;
          // finalArr[find_record].totals.metal.FineWt += b?.totals?.metal?.FineWt;

          finalArr[find_record].totals.metal.IsNotPrimaryMetalAmount +=
            b?.totals?.metal?.IsNotPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalPcs +=
            b?.totals?.metal?.IsNotPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalSettingAmount +=
            b?.totals?.metal?.IsNotPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalWt +=
            b?.totals?.metal?.IsNotPrimaryMetalWt;

          finalArr[find_record].totals.metal.IsPrimaryMetalAmount +=
            b?.totals?.metal?.IsPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalPcs +=
            b?.totals?.metal?.IsPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsPrimaryMetalSettingAmount +=
            b?.totals?.metal?.IsPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalWt +=
            b?.totals?.metal?.IsPrimaryMetalWt;
        }
      }
    });

    datas.resultArray = finalArr;

    let darr = [];
    let darr2 = [];
    let darr3 = [];
    let darr4 = [];

    datas?.resultArray?.forEach((e) => {
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

    datas?.json2?.forEach((el) => {
      if (el?.MasterManagement_DiamondStoneTypeid === 1) {
        if (el?.ShapeName?.toLowerCase() === "rnd") {
          darr.push(el);
        } else {
          darr2.push(el);
        }
      }
    });

    setResult(datas);

    darr?.forEach((a) => {
      let aobj = cloneDeep(a);
      let findrec = darr3?.findIndex(
        (al) =>
          al?.ShapeName === aobj?.ShapeName &&
          al?.Colorname === aobj?.Colorname &&
          al?.QualityName === aobj?.QualityName
      );
      if (findrec === -1) {
        darr3.push(aobj);
      } else {
        darr3[findrec].Wt += a?.Wt;
        darr3[findrec].Pcs += a?.Pcs;
      }
    });

    let obj_ = {
      ShapeName: "OTHERS",
      QualityName: "",
      Colorname: "",
      Wt: 0,
      Pcs: 0,
    };
    darr2?.forEach((a) => {
      obj_.Wt += a?.Wt;
      obj_.Pcs += a?.Pcs;
    });
    darr4 = [...darr3, obj_];

    setDiamondArr(darr4);

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

    if (diaGroupFlag) {
      datas?.resultArray?.forEach((e) => {
        let dia2 = [];
        let dia1_ = [];
        let dia2_ = [];
        e?.diamonds?.forEach((el) => {
          if (el?.GroupName === "") {
            dia1_.push(el);
          } else {
            dia2_.push(el);
          }
        });
        let dia1_g = [];
        dia1_?.forEach((ell) => {
          let bll = cloneDeep(ell);
          let findrec = dia1_g.findIndex(
            (a) =>
              a?.ShapeName === bll?.ShapeName && a?.SizeName === bll?.SizeName
          );
          if (findrec === -1) {
            dia1_g.push(bll);
          } else {
            dia1_g[findrec].Wt += bll?.Wt;
            dia1_g[findrec].Pcs += bll?.Pcs;
            dia1_g[findrec].Amount += bll?.Amount;
          }
        });
        let dia2_g = [];
        dia2_?.forEach((ell) => {
          let bll = cloneDeep(ell);
          let findrec = dia2_g.findIndex(
            (a) =>
              a?.ShapeName === bll?.ShapeName && a?.GroupName === bll?.GroupName
          );
          if (findrec === -1) {
            dia2_g.push(bll);
          } else {
            dia2_g[findrec].Wt += bll?.Wt;
            dia2_g[findrec].Pcs += bll?.Pcs;
            dia2_g[findrec].Amount += bll?.Amount;
          }
        });
        let dia2_g_ = [];
        dia2_g?.forEach((e) => {
          e.SizeName = e?.GroupName;
          dia2_g_.push(e);
        });
        dia2 = [...dia1_g, ...dia2_g_];

        e.diamonds = dia2;
      });
    }
  };

  if (result) {
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      //   button.click();
    }, 500);
  }


  console.log("TCL: ValueSheetExcel ->result ", result)

  // const mergeByPurityAndMaterial = (data) => {
  //   const map = new Map();

  //   data?.forEach((item) => {
  //     const purity = item.MetalPurity;

  //     const materials = [
  //       ...(item.diamonds || []),
  //       ...(item.colorstone || []),
  //       ...(item.misc || [])
  //     ]
  //       .map((x) => x.MaterialTypeName?.toUpperCase())
  //       .filter((x) => x && x.trim() !== "");

  //     const uniqueMaterials = [...new Set(materials)].sort();

  //     const key = `${purity}_${uniqueMaterials.join(",")}`;

  //     if (!map.has(key)) {
  //       map.set(key, {
  //         MetalPurity: purity,
  //         MaterialTypes: uniqueMaterials,
  //         items: [],

  //         // 🔥 aggregation fields
  //         totalNetWt: 0,
  //         totalGrossWt: 0,
  //         totalAmount: 0,
  //         totalPcs: 0,
  //       });
  //     }

  //     const group = map.get(key);

  //     // ✅ push raw item (optional)
  //     group.items.push(item);

  //     // 🔥 MERGE LOGIC (this is what you were missing)
  //     group.totalNetWt += item.NetWt || 0;
  //     group.totalGrossWt += item.grosswt || 0;
  //     group.totalAmount += item.TotalAmount || 0;

  //     // example: pcs from diamonds
  //     const pcs =
  //       (item.diamonds || []).reduce((sum, d) => sum + (d.Pcs || 0), 0) +
  //       (item.colorstone || []).reduce((sum, d) => sum + (d.Pcs || 0), 0) +
  //       (item.misc || []).reduce((sum, d) => sum + (d.Pcs || 0), 0);

  //     group.totalPcs += pcs;
  //   });

  //   return Array.from(map.values());
  // };


  // const mergeByPurityAndMaterial = (data) => {
  //   const map = new Map();

  //   data?.forEach((item) => {
  //     const purity = item.MetalPurity;

  //     const materials = [
  //       ...(item.diamonds || []),
  //       ...(item.colorstone || []),
  //       ...(item.misc || [])
  //     ]
  //       .map((x) => x.MaterialTypeName)
  //       .filter((x) => x && x.trim() !== "");

  //     const uniqueMaterials = [...new Set(materials)].sort();

  //     const key = `${purity}_${uniqueMaterials.join(",")}`;

  //     if (!map.has(key)) {
  //       map.set(key, {
  //         MetalPurity: purity,
  //         MaterialTypes: uniqueMaterials,
  //         items: [],
  //         total: {
  //           grosswt: 0,
  //           NetWt: 0,
  //           LossWt: 0,
  //           Quantity: 0,
  //           totalWt: 0,
  //           metalAmount: 0,
  //           diaCsPcs: 0,
  //           diaCsWt: 0,
  //           diaCsAmount: 0,
  //           findingWt: 0,
  //           findingAmount: 0,
  //           TotalAmount: 0,
  //           totalRMValue: 0,
  //           totalValueAddition: 0,
  //           perOfVA: 0,
  //         }
  //       });
  //     }

  //     const group = map.get(key);

  //     group.items.push(item);

  //     // 🔥 aggregate totals
  //     group.total.grosswt += item?.grosswt || 0;
  //     group.total.NetWt += item?.NetWt || 0;
  //     group.total.LossWt += item?.LossWt || 0;
  //     group.total.Quantity += item?.Quantity || 0;
  //     group.total.totalWt += (item?.NetWt || 0) + (item?.LossWt || 0);

  //     const metalAmount = item?.totals?.metal?.Amount || 0;

  //     group.total.metalAmount += metalAmount;
  //     const diaPcs =
  //     item?.totals?.diamonds?.Pcs ??
  //     item?.diamonds?.reduce((s, d) => s + (d.Pcs || 0), 0) ??
  //     0;
    
  //   const csPcs =
  //     item?.totals?.colorstone?.Pcs ??
  //     item?.colorstone?.reduce((s, c) => s + (c.Pcs || 0), 0) ??
  //     0;
    
  //   const diaWt =
  //     item?.totals?.diamonds?.Wt ??
  //     item?.diamonds?.reduce((s, d) => s + (d.Wt || 0), 0) ??
  //     0;
    
  //   const csWt =
  //     item?.totals?.colorstone?.Wt ??
  //     item?.colorstone?.reduce((s, c) => s + (c.Wt || 0), 0) ??
  //     0;
 

  //     const diaAmt = item?.totals?.diamonds?.Amount || 0;
  //     const csAmt = item?.totals?.colorstone?.Amount || 0;

  //     const miscAmt = item?.totals?.misc?.Amount || 0;

  //     group.total.diaPcs += diaPcs;
  //     group.total.diaWt += diaWt;
  //     group.total.diaAmount += diaAmt;
 

  //     group.total.findingWt += item?.totals?.finding?.Wt || 0;
  //     group.total.findingAmount += item?.totals?.finding?.Amount || 0;

  //     group.total.TotalAmount += item?.TotalAmount || 0;

  //     group.total.totalRMValue += (diaAmt + csAmt + miscAmt + metalAmount);

  //     const valueAdd = (item?.OtherCharges || 0) + (item?.MakingAmount || 0) + (item?.TotalDiamondHandling || 0);

  //     group.total.totalValueAddition += valueAdd;
  //   });

  //   // 🔥 final percentage calculation after sum
  //   map.forEach((group) => {
  //     group.total.perOfVA =
  //       group.total.metalAmount > 0
  //         ? (group.total.totalValueAddition * 100) / group.total.metalAmount
  //         : 0;
  //   });

  //   return Array.from(map.values());
  // };

  const mergeByPurityAndMaterial = (data) => {
    const map = new Map();
  
    data?.forEach((item) => {
      const purity = item.MetalPurity;
  
      const materials = [
        ...(item.diamonds || []),
        ...(item.colorstone || []),
        ...(item.misc || [])
      ]
        .map((x) => x.MaterialTypeName)
        .filter((x) => x && x.trim() !== "");
  
      const uniqueMaterials = [...new Set(materials)].sort();
  
      const key = `${purity}_${uniqueMaterials.join(",")}`;
  
      if (!map.has(key)) {
        map.set(key, {
          MetalPurity: purity,
          MaterialTypes: uniqueMaterials,
          items: [],
          total: {
            grosswt: 0,
            NetWt: 0,
            LossWt: 0,
            Quantity: 0,
            totalWt: 0,
            metalAmount: 0,
            diaCsPcs: 0,
            diaCsWt: 0,
            diaCsAmount: 0,
            findingWt: 0,
            findingAmount: 0,
            TotalAmount: 0,
            totalRMValue: 0,
            totalValueAddition: 0,
            perOfVA: 0,
          }
        });
      }
  
      const group = map.get(key);
      group.items.push(item);
  
      // 🔥 base totals
      group.total.grosswt += item?.grosswt || 0;
      group.total.NetWt += item?.NetWt || 0;
      group.total.LossWt += item?.LossWt || 0;
      group.total.Quantity += item?.Quantity || 0;
      group.total.totalWt += (item?.NetWt || 0) + (item?.LossWt || 0);
  
      const metalAmount = item?.totals?.metal?.Amount || 0;
      group.total.metalAmount += metalAmount;
  
      // ✅ SAFE diamond + colorstone calculation
      const diaPcs =
        item?.totals?.diamonds?.Pcs ??
        item?.diamonds?.reduce((s, d) => s + (d.Pcs || 0), 0) ??
        0;
  
      const csPcs =
        item?.totals?.colorstone?.Pcs ??
        item?.colorstone?.reduce((s, c) => s + (c.Pcs || 0), 0) ??
        0;
  
      const diaWt =
        item?.totals?.diamonds?.Wt ??
        item?.diamonds?.reduce((s, d) => s + (d.Wt || 0), 0) ??
        0;
  
      const csWt =
        item?.totals?.colorstone?.Wt ??
        item?.colorstone?.reduce((s, c) => s + (c.Wt || 0), 0) ??
        0;
  
      const diaAmt = item?.totals?.diamonds?.Amount || 0;
      const csAmt = item?.totals?.colorstone?.Amount || 0;
      const miscAmt = item?.totals?.misc?.Amount || 0;
  
     
      group.total.diaCsPcs += (diaPcs );
      group.total.diaCsWt += (diaWt  );
      group.total.diaCsAmount += (diaAmt + csAmt);
  
      group.total.findingWt += item?.totals?.finding?.Wt || 0;
      group.total.findingAmount += item?.totals?.finding?.Amount || 0;
  
      group.total.TotalAmount += item?.TotalAmount || 0;
  
      group.total.totalRMValue += (diaAmt + csAmt + miscAmt + metalAmount);
  
      const valueAdd =
        (item?.OtherCharges || 0) +
        (item?.MakingAmount || 0) +
        (item?.TotalDiamondHandling || 0);
  
      group.total.totalValueAddition += valueAdd;
    });
  
    // 🔥 final % calculation
    map.forEach((group) => {
      group.total.perOfVA =
        group.total.metalAmount > 0
          ? (group.total.totalValueAddition * 100) / group.total.metalAmount
          : 0;
    });
  
    return Array.from(map.values());
  };


  const MergedData = mergeByPurityAndMaterial(result?.resultArray)


  console.log("TCL: ValueSheetExcel -> MergedData", MergedData)

  const calculateGrandTotal = (groups, exchRate = 1) => {
    return groups.reduce((acc, group) => {
      const t = group.total;

      acc.Quantity += t.Quantity;
      acc.grosswt += t.grosswt;
      acc.NetWt += t.NetWt;
      acc.LossWt += t.LossWt;
      acc.totalWt += t.totalWt;

      acc.metalAmount += t.metalAmount / exchRate;

      acc.diaPcs += t.diaCsPcs;
      acc.diaWt += t.diaCsWt;
      acc.diaAmount += t.diaCsAmount / exchRate;

      acc.totalAmount += t.TotalAmount / exchRate;

      return acc;
    }, {
      Quantity: 0,
      grosswt: 0,
      NetWt: 0,
      LossWt: 0,
      totalWt: 0,
      metalAmount: 0,
      diaPcs: 0,
      diaWt: 0,
      diaAmount: 0,
      totalAmount: 0
    });
  };



  const grandTotal = calculateGrandTotal(
    MergedData,
    result?.header?.CurrencyExchRate
  );


  const th = {
    border: "1px solid #000",
    padding: "4px",
    textAlign: "center",
    backgroundColor: "#e6e6e6",
    fontWeight: "bold",
  };

  const td = {
    border: "1px solid #000",
    padding: "4px",
    textAlign: "right",
  };

  const section = {
    border: "1px solid #000",
    padding: "4px",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
            table="table-to-xls"
            filename={`Export Excel B`}
            sheet={`Export_Excel_B_${result?.header?.InvoiceNo}`}
            buttonText="Download as XLS"
          />
          {/* <table id="table-to-xls" className="d-none"> */}
          {/* <table id="table-to-xls" >
            <tr style={{textAlign:"center"}} ><td>VALUE ADDITION SHEET (REMAKING/REMELTING)</td></tr>
            <tr>
              <td>
                <b>Item Name</b>
              </td>
              <td>
                <b>SKU</b>
              </td>
              <td>
                <b>Sales Description
                </b>
              </td>
              <td>
                <b>Brand</b>
              </td>
              <td>
                <b>CF.Category
                </b>
              </td>
              <td>
                <b>CF.Price Key
                </b>
              </td>
              <td>
                <b>CF.Collection
                </b>
              </td>
              <td>
                <b>Selling Rate
                </b>
              </td>
              <td>
                <b>CF.Tag Price
                </b>
              </td>
            </tr>

        




          </table> */}
          <div>
            <div style={{ textAlign: "center" }}>VALUE ADDITION SHEET (REMAKING/REMELTING)</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  Invoice No. & Date :
                </td>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  {result?.header?.InvoiceNo}
                </td>
                <td style={{ border: "1px solid #000", textAlign: "center" }}>
                  {result?.header?.EntryDate}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Main Section */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>

                {/* Exporter Section */}
                <td
                  style={{
                    width: "60%",
                    border: "1px solid #000",
                    verticalAlign: "top",
                    padding: 8,
                  }}
                >
                  <div><b>EXPORTER</b></div>
                  <div>{result?.header?.companyname}</div>
                  <div>{result?.header?.CompanyAddress}</div>
                  <div>{result?.header?.CompanyAddress2}</div>


                  <div>Dist : {result?.header?.CompanyCity} ({result?.header?.CompanyState})</div>
                  <div>GSTIN : {result?.header?.Company_VAT_GST_No}</div>

                  <div style={{ marginTop: 10 }}>
                    <b>Email: {result?.header?.CompanyEmail}</b>
                  </div>
                </td>

                {/* Consignee Section */}
                <td
                  style={{
                    width: "40%",
                    border: "1px solid #000",
                    verticalAlign: "top",
                    padding: 8,
                  }}
                >
                  <div><b>Consinee :</b></div>

                  <table style={{ width: "100%", marginTop: 10 }}>
                    <tbody>
                      {[...Array(6)].map((_, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: "center" }}>0</td>
                          <td style={{ textAlign: "center" }}>0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr>
                <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', width: "19%" }}>Sr#</th>
                <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', width: "9%" }}>Desc</th>
                <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>Qty</th>
                <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>Gross wt</th>

                <th colSpan="7" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Details of Gold</th>
                <th colSpan="5" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Details of Studding</th>
                <th colSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Details of Value Additions</th>
                <th colSpan="2" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', textOrientation: 'mixed' }}>Total</th>
              </tr>
              <tr>
                <th colSpan="2" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Gold /Silver</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Wt. Loss</th>
                <th rowSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>% of</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Tot. Wt.</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Rt. Of </th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Tot Cost of.</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Type</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Diam</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Wt. In</th>
                <th colSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Rate Per</th>
                <th rowSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Total Value</th>
                <th rowSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Unit Price</th>
                <th colspan="2" rowSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Value</th>

                <th rowSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Unit Price</th>
                <th rowSpan="1" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>FOB Value</th>
              </tr>
              <tr>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Purity</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>in Gms</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>in Gms</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Wt</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>in Gms</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Gold /Silver/gm <br /> IN US $</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Gold/Silver <br /> in US $ </th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}></th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Pcs</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Cts</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Cts in US $</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>In USD</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>US $</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Addition %</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Addition in US $</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>US $</th>
                <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>in US $</th>
              </tr>
            </thead>
            <tbody>

              {MergedData.map((item, index) => (

                <>
                  {/* part start */}
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>{item?.MetalPurity + " GOLD JEWELLERY STUDDED WITH " + item?.MaterialTypes.filter(Boolean).join(", ")}</td>
                    <td colSpan="20" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}></td>
                  </tr>
                  {item?.items.map((e, i) => (
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'Right' }}>{i + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'left' }}>{e?.designno}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.Quantity}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.grosswt, 3)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>{e?.MetalPurity}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.NetWt, 3)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.LossWt}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.LossPer}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.LossWt + e?.NetWt !== 0 && formatAmount(e?.LossWt + e?.NetWt, 3)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{(e?.metal_rate !== undefined && e?.metal_rate !== 0) && formatAmount(e?.metal_rate, 2)} </td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.totals?.metal?.Amount !== 0 && formatAmount(e?.totals?.metal?.Amount / result?.header?.CurrencyExchRate, 2)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.diamonds[0]?.ShapeName}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{e?.totals?.diamonds?.Pcs}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.totals?.diamonds?.Wt, 3)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.totals?.diamonds?.rate / result?.header?.CurrencyExchRate, 2)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate, 2)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.UnitCost / result?.header?.CurrencyExchRate, 2)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>8%</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount((e?.UnitCost / result?.header?.CurrencyExchRate * 8) / 100, 2)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.UnitCost / result?.header?.CurrencyExchRate + ((e?.UnitCost / result?.header?.CurrencyExchRate * 8) / 100), 2)} </td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{formatAmount(e?.UnitCost / result?.header?.CurrencyExchRate + ((e?.UnitCost / result?.header?.CurrencyExchRate * 8) / 100), 2)}</td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr>
                    <td colSpan="2" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontWeight: 'bold' }}>Total</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{item?.items[0]?.Quantity}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.grosswt, 3)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}></td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.NetWt, 3)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.LossWt, 3)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}></td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>
                      {item?.items[0]?.LossWt + item?.items[0]?.NetWt !== 0 && formatAmount(item?.items[0]?.LossWt + item?.items[0]?.NetWt, 3)}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}></td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.UnitCost, 3)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}> </td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{item?.items[0]?.totals?.diamonds?.Pcs}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}> </td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.totals?.diamonds?.rate / result?.header?.CurrencyExchRate, 2)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate, 2)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.UnitCost / result?.header?.CurrencyExchRate, 2)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}></td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount((item?.items[0]?.UnitCost / result?.header?.CurrencyExchRate * 8) / 100, 2)}</td>

                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.UnitCost / result?.header?.CurrencyExchRate + ((item?.items[0]?.UnitCost / result?.header?.CurrencyExchRate * 8) / 100), 2)}</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item?.items[0]?.UnitCost / result?.header?.CurrencyExchRate + ((item?.items[0]?.UnitCost / result?.header?.CurrencyExchRate * 8) / 100), 2)}</td>
                  </tr>

                  <tr >  <td colSpan="21" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', fontWeight: 'bold' }}></td></tr>
                  {/* partend */}


                </>

              ))}







              {/* Total Row */}

              <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
                <td colSpan={2} style={{ border: '1px solid #000', textAlign: 'center' }}>
                  TOTAL
                </td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {grandTotal.Quantity}
                </td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.grosswt, 3)}
                </td>

                <td style={{ border: '1px solid #000' }}></td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.NetWt, 3)}
                </td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.LossWt, 3)}
                </td>

                <td style={{ border: '1px solid #000' }}></td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.totalWt, 3)}
                </td>

                <td style={{ border: '1px solid #000' }}></td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.metalAmount, 2)}
                </td>

                <td style={{ border: '1px solid #000' }}></td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {grandTotal.diaPcs}
                </td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.diaWt, 3)}
                </td>

                <td style={{ border: '1px solid #000' }}></td>

                <td style={{ border: '1px solid #000', textAlign: 'right' }}>
                  {formatAmount(grandTotal.diaAmount, 2)}
                </td>

                <td colSpan={5} style={{ border: '1px solid #000' }}></td>
              </tr>
            </tbody>
          </table>


          <div style={{ margin: "20px 0" }}></div>


          {/* summary detail  */}

          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <table style={{ width: '40%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', width: "19%" }}>Import  BOE No</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>Diam Cts</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>10kt Gold</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>14 kt Gold</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>18 kt Gold</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>22 kt Gold</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>L.G.DIAM</th>
                  <th rowSpan="3" style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0', }}>925 SILVER</th>

                </tr>

              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781/23.06.2025</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1713.802 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>6.225 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>

                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781/23.06.2025</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1713.802 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>6.225 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>

                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781/23.06.2025</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1713.802 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>6.225 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>

                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781/23.06.2025</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1001781 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>1713.802 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>6.225 </td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>  </td>

                </tr>
              </tbody>
            </table>

            <table style={{ width: "60%", borderCollapse: "collapse", fontSize: "10px" }}>
              <thead>
                {/* TOP HEADER */}
                <tr>
                  <th colSpan="2" style={th}>Opening Stock</th>

                  <th colSpan="4" style={th}>
                    B.E. No. 1002279 Dt. 04.08.2025 (Remaking/Remelting)
                    <br />
                    B.E. No. 1001563 Dt. 06.04.2026 (Remaking/Remelting)
                  </th>

                  <th colSpan="2" style={th}>Total Recovered</th>
                  <th style={th}></th>
                  <th colSpan="2" style={th}>Used in Export</th>
                  <th colSpan="2" style={th}>Stock in Hand</th>
                </tr>

                {/* SUB HEADER */}
                <tr>
                  {/* Opening */}
                  <th style={th}>Gold 999</th>
                  <th style={th}>Natural Diam</th>

                  {/* BE Section (empty like image) */}
                  <th colSpan="4" style={th}></th>

                  {/* Total Recovered */}
                  <th style={th}>Total Gold<br />(Rec. 0.999)</th>
                  <th style={th}>Total Diam<br />Received</th>
                  <th style={th}>M.Z Diamond<br />Recovered</th>

                  {/* Used */}
                  <th style={th}>Gold (99.9)</th>
                  <th style={th}>Diamond</th>


                  {/* Stock */}
                  <th style={th}>Gold (99.9)</th>
                  <th style={th}>Natural Diamond</th>
                </tr>
              </thead>

              <tbody>
                {/* MAIN VALUES */}
                <tr>
                  <td style={td}>1011.143</td>
                  <td style={td}>507.287</td>

                  <td colSpan="4" style={td}></td>

                  <td style={td}>4322.002</td>
                  <td style={td}>783.690</td>
                  <td style={td}></td>

                  <td style={td}>114.524</td>
                  <td style={td}>-2945.061</td>


                  <td style={td}>5218.621</td>
                  <td style={td}>4236.038</td>
                </tr>

                {/* STONE HEADER */}
                <tr>
                  <td style={section}>STONE</td>
                  <td style={section}>C.Z</td>

                  <td colSpan="4" style={section}></td>


                  <td style={section}>C.Z</td>
                  <td style={section}>SILVER</td>

                  <td style={section}>C.Z</td>
                  <td style={section}></td>
                  <td style={section}>SILVER</td>

                  <td style={section}>SILVER</td>
                  <td style={section}>C.Z</td>
                </tr>

                {/* STONE VALUES */}
                <tr>
                  <td style={td}>0.000</td>
                  <td style={td}>0.000</td>

                  <td colSpan="4" style={td}></td>

                  <td style={td}></td>
                  <td style={td}>13.969</td>
                  <td style={td}>82.975</td>

                  <td style={td}></td>
                  <td style={td}></td>


                  <td style={td}>4142.358</td>
                  <td style={td}>13.969</td>
                </tr>

                {/* LAB GROWN HEADER */}
                <tr>
                  <td colSpan="2" style={section}>LAB GROWN</td>
                  <td colSpan="4" style={section}>LAB GROWN</td>
                  <td colSpan="3" style={section}>LAB GROWN</td>
                  <td colSpan="3" style={section}>LAB GROWN</td>
                  <td colSpan="2" style={section}></td>
                </tr>

                {/* LAB GROWN VALUES */}
                <tr>
                  <td colSpan="2" style={td}>6.225</td>
                  <td colSpan="4" style={td}>95.930</td>
                  <td colSpan="3" style={td}>102.155</td>

                  <td colSpan="2" style={td}>0.000</td>
                </tr>

                {/* SILVER HEADER */}
                <tr>
                  <td style={section}>SILVER</td>
                  <td style={section}>Treated</td>

                  <td style={section}>SILVER</td>
                  <td style={section}>Treated</td>
                  <td style={section}>STONE</td>
                  <td style={section}>Treated</td>

                  <td style={section}>stone</td>
                  <td style={section}></td>
                  <td style={section}></td>

                  <td style={section}>TREATED</td>
                  <td style={section}></td>


                  <td style={section}></td>
                  <td style={section}>Stone</td>
                </tr>

                {/* SILVER VALUES */}
                <tr>
                  <td style={td}>366.066</td>
                  <td style={td}>232.170</td>

                  <td style={td}>3859.267</td>
                  <td style={td}>33.82</td>
                  <td style={td}>95.121</td>
                  <td style={td}></td>

                  <td style={td}></td>
                  <td style={td}></td>
                  <td style={td}></td>

                  <td style={td}>265.990</td>
                  <td style={td}></td>


                  <td style={td}></td>
                  <td style={td}>95.121</td>
                </tr>
              </tbody>
            </table>
          </div>



          {/* last part */}

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginTop: "10px" }}>

            <tr>
              <td style={{ width: "20%" }}>Note: Gold/Silver Rate taken as per</td>
              <td style={{ width: "20%" }}>Bill Of Entry No.</td>

              {/* This cell spans 4 rows */}
              <td style={{ width: "20%" }}>
                1001781 (10 KT) Dt.: 23.06.2025 $45.03 Per Gms
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>1001563 925 Silver Dt.: 06.04.2026 $2.05 Per Gms</td>
              <td></td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td>1001563 925 Silver Dt.: 06.04.2026 $2.05 Per Gms</td>
              <td></td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td>1001563 925 Silver Dt.: 06.04.2026 $2.05 Per Gms</td>
              <td></td>
            </tr>
          </table>


          <div className="footer" style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ width: "33%" }}></div>
            <div style={{ width: "34%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginTop: "10px" }}>



                <thead>
                  <tr>
                    Gold in 0.999
                  </tr>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >Purity</th>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >Net Wt.</th>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >Loss</th>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >0.999</th>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >Loss(0.999)</th>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >Rate of Gold /Silver Gms in US $</th>
                    <th style={{ border: '1px solid #000', padding: '2px', textAlign: 'center', backgroundColor: '#f0f0f0' }} >Value of Gold/silver in US $</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >10 KT</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >0.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >45.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>

                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >10 KT</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >0.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >45.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>

                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >10 KT</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >0.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >45.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>

                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >10 KT</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >0.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >64.232</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >45.00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>
                    <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }} >00</td>

                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ width: "33%", display: "flex", justifyContent: "flex-end" }}>
              <table style={{ fontSize: "10px" }}>
                <tr>
                  <td>For, BRITISH JEWELS</td>
                </tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr style={{ height: "10px" }}><td></td></tr>
                <tr><td>AUTHORISED / PROPRIETOR</td></tr>
              </table>
            </div>

          </div>



        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {" "}
          {msg}{" "}
        </p>
      )}
    </>
  );
};

export default ValueSheetExcel;
