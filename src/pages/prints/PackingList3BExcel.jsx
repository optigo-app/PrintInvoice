import React, { useEffect, useState } from 'react'
import { apiCall, checkMsg, formatAmount, handleGlobalImgError, isObjectEmpty, handleImageError, } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import sanitizeHtml from 'sanitize-html';
import { htmlToText } from 'html-to-text';
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";

const PackingListExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);
  const [result3, setResult3] = useState(null);
  const [diamondWise, setDiamondWise] = useState([]);
  const [rowWise, setRowWise] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === '200') {
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
    }
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    const copydata = cloneDeep(data);

    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;

    const datas = OrganizeInvoicePrintData(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );
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
      QualityName: '',
      Colorname: ''
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

    diaonlyrndarr1.forEach((e) => {
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

    diaonlyrndarr2.forEach((e) => {
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

    diaonlyrndarr4.forEach((e) => {
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

    diarndotherarr5 = [...diaonlyrndarr6, diaObj];
    setDiamondWise(diarndotherarr5);
    datas?.resultArray?.forEach((el) => {
      let dia = [];
      el?.diamonds?.forEach((a) => {
        let obj = cloneDeep(a);
        let findrec = dia?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
        if (findrec === -1) {
          dia.push(obj);
        } else {
          dia[findrec].Wt += obj?.Wt;
          dia[findrec].Pcs += obj?.Pcs;
          dia[findrec].Rate = obj?.Rate;
          dia[findrec].Amount += obj?.Amount;
        }
      })
      el.diamonds = dia;

      let clr = [];
      el?.colorstone?.forEach((a) => {
        let obj = cloneDeep(a);
        let findrec = clr?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.isRateOnPcs === obj?.isRateOnPcs && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
        if (findrec === -1) {
          clr.push(obj);
        } else {
          clr[findrec].Wt += obj?.Wt;
          clr[findrec].Pcs += obj?.Pcs;
          clr[findrec].Rate = obj?.Rate;
          clr[findrec].Amount += obj?.Amount;
        }
      })
      el.colorstone = clr;

      let miscAr = [];
      el?.misc?.forEach((a) => {
        let obj = cloneDeep(a);
        let findrec = miscAr?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.isRateOnPcs === obj?.isRateOnPcs && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
        if (findrec === -1) {
          miscAr.push(obj);
        } else {
          miscAr[findrec].Wt += obj?.Wt;
          miscAr[findrec].Pcs += obj?.Pcs;
          miscAr[findrec].Rate = obj?.Rate;
          miscAr[findrec].Amount += obj?.Amount;
        }
      })
      el.misc = miscAr;

      let misc2arr = el?.misc?.filter((e) => e?.IsHSCOE === 0);

      el.misc = misc2arr;

      let clr_misc_ar = [...el?.colorstone, ...el?.misc];

      el.colorstone = clr_misc_ar;

    })

    let finalArr = [];

    datas?.resultArray?.forEach((e, i) => {

      let arr = [];

      let len = 7;

      if (e?.diamonds?.length > e?.colorstone?.length) {
        if (e?.diamonds?.length > 7) {
          len = e?.diamonds?.length;
        }
      }
      else if (e?.diamonds?.length < e?.colorstone?.length) {
        if (e?.colorstone?.length > 7) {
          len = e?.colorstone?.length;
        }
      }

      let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)
      let obj = {};
      obj.sr = i + 1;
      obj.srflag = true;
      obj.srRowSpan = len;
      obj.SrJobno = `${e?.SrJobno}`;
      obj.designno = e?.designno;

      obj.dia_code = e?.diamonds[0] ? (e?.diamonds[0]?.ShapeName) : '';
      obj.dia_size = e?.diamonds[0] ? e?.diamonds[0]?.SizeName : '';
      obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : '';
      obj.dia_wt = e?.diamonds[0] ? ((e?.diamonds[0]?.Wt)?.toFixed(3)) : '';
      obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
      obj.dia_amt = e?.diamonds[0] ? (e?.diamonds[0]?.Amount) : '';
      // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';

      obj.met_quality = '';
      obj.met_wt = 0;
      obj.met_rate = 0;
      obj.met_amt = 0;

      obj.met_wt = e?.NetWt;
      // obj.met_rate = findMetal ? (Math.round(((findMetal?.Amount / datas?.header?.CurrencyExchRate)) / e?.NetWt)) : '';
      obj.met_rate = findMetal ? (Math.round((findMetal?.Rate))) : '';
      obj.met_amt = findMetal ? ((findMetal?.Amount)) : '';
      obj.met_quality = findMetal ? (findMetal?.ShapeName + " " + findMetal?.QualityName) : '';

      obj.cls_code = e?.colorstone[0] ? (` ${e?.colorstone[0]?.MasterManagement_DiamondStoneTypeid === 3 ? 'M:' : ''} ${e?.colorstone[0]?.ShapeName}`) : '';
      obj.cls_size = e?.colorstone[0] ? (e?.colorstone[0]?.SizeName) : '';
      obj.cls_pcs = e?.colorstone[0] ? (e?.colorstone[0]?.Pcs) : '';
      obj.cls_wt = e?.colorstone[0] ? ((e?.colorstone[0]?.Wt)?.toFixed(3)) : '';
      // obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / result?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
      obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / datas?.header?.CurrencyExchRate)) / (e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) : (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
      obj.cls_amt = e?.colorstone[0] ? ((e?.colorstone[0]?.Amount)) : '';

      obj.oth_amt = (e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount);
      obj.labour_rate = e?.MaKingCharge_Unit;
      obj.labour_amt = (e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount);
      obj.total_amount = e?.TotalAmount;
      obj.duty_amount = e?.CustomDuty_Amount;
      obj.grosswt = e?.grosswt;
      obj.NetWt = e?.NetWt;
      obj.LossWt = e?.LossWt;
      obj.Categoryname = e?.Categoryname;
      obj.BillReferenceNo = e?.BillReferenceNo;

      Array?.from({ length: len })?.map((el, ind) => {

        let obj = {};

        obj.srflag = false
        obj.img = e?.DesignImage;
        obj.imgflag = false;
        if (ind === 0) {
          obj.imgflag = true;
        }
        obj.tunch = ((e?.Tunch)?.toFixed(3));

        obj.tunchflag = false;
        if (ind === 4) {
          obj.tunchflag = true;
        }

        obj.grosswt = ((e?.grosswt)?.toFixed(3));

        obj.grosswetflag = false;
        if (ind === 5) {
          obj.grosswetflag = true;
        }

        //diamond
        obj.dia_code = '';
        obj.dia_size = '';
        obj.dia_pcs = 0;
        obj.dia_wt = 0;
        obj.dia_rate = 0;
        obj.dia_amt = 0;
        obj.diaflag = false;

        if (e?.diamonds[ind + 1]) {
          obj.diaflag = true;
          obj.dia_code = (e?.diamonds[ind + 1]?.ShapeName);
          obj.dia_size = e?.diamonds[ind + 1]?.SizeName;
          obj.dia_pcs = e?.diamonds[ind + 1]?.Pcs;
          obj.dia_wt = ((e?.diamonds[ind + 1]?.Wt)?.toFixed(3));
          // obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
          obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
          obj.dia_amt = ((e?.diamonds[ind + 1]?.Amount));
        }

        // colorstone
        obj.cls_code = '';
        obj.cls_size = '';
        obj.cls_pcs = 0;
        obj.cls_wt = 0;
        obj.cls_rate = 0;
        obj.cls_amt = 0;
        obj.clsflag = false;

        if (e?.colorstone[ind + 1]) {
          obj.clsflag = true;
          obj.cls_code = `${e?.colorstone[ind + 1]?.MasterManagement_DiamondStoneTypeid === 3 ? 'M:' : ''}  ${e?.colorstone[ind + 1]?.ShapeName}`;
          obj.cls_size = e?.colorstone[ind + 1]?.SizeName;
          obj.cls_pcs = e?.colorstone[ind + 1]?.Pcs;
          obj.cls_wt = ((e?.colorstone[ind + 1]?.Wt)?.toFixed(3));
          // obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / result?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
          obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / datas?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
          obj.cls_amt = ((e?.colorstone[ind + 1]?.Amount));

        }

        obj.JobRemark = e?.JobRemark;
        obj.jobRemarkflag = false;
        if (ind === 1 && e?.JobRemark !== '') {
          obj.jobRemarkflag = true;
        }

        arr.push(obj);

      })

      obj.matrialArr = arr;
      obj.values = e;

      finalArr.push(obj);
    })
    setResult2(finalArr);
    setResult(datas);

    let catewise = [];

    datas?.resultArray?.forEach((e, i) => {
      let obj = cloneDeep(e);
      let findrec = catewise?.findIndex((a) => a?.Categoryname === obj?.Categoryname)
      if (findrec === -1) {
        catewise.push(obj)
      } else {
        catewise[findrec].Quantity += obj?.Quantity;
      }
    })

    catewise.sort((a, b) => a.Categoryname.localeCompare(b.Categoryname));

    setResult3(catewise)

    let rowArr = [];

    let rowObj = {};
    rowObj.grosswt_name = 'GROSS WT'
    rowObj.grosswt_value = ((datas?.mainTotal?.grosswt)?.toFixed(3));
    rowObj.name = 'GOLD'
    rowObj.value = (formatAmount(datas?.mainTotal?.MetalAmount));
    rowObj.dia_info_name = (diarndotherarr5[0] !== undefined ? (diarndotherarr5[0]?.ShapeName + " " + diarndotherarr5[0]?.QualityName + " " + diarndotherarr5[0]?.Colorname) : '')
    rowObj.dia_info_value = (diarndotherarr5[0] !== undefined ? (diarndotherarr5[0]?.pcPcss + " / " + (diarndotherarr5[0]?.wtWts)?.toFixed(3)) : '')
    rowObj.sum_info_name = (catewise[0] === undefined ? '' : catewise[0]?.Categoryname);
    rowObj.sum_info_value = (catewise[0] === undefined ? '' : catewise[0]?.Quantity);
    rowObj.remark = ((datas?.header?.PrintRemark));
    rowArr.push(rowObj);

    let rowObj1 = {};
    rowObj1.grosswt_name = 'WT'
    rowObj1.grosswt_value = ((datas?.mainTotal?.netwt)?.toFixed(3));
    rowObj1.name = 'DIAMOND';
    rowObj1.value = (formatAmount(datas?.mainTotal?.diamonds?.Amount));
    rowObj1.dia_info_name = (diarndotherarr5[1] === undefined ? '' : (diarndotherarr5[1]?.ShapeName + " " + diarndotherarr5[1]?.QualityName + " " + diarndotherarr5[1]?.Colorname))
    rowObj1.dia_info_value = (diarndotherarr5[1] === undefined ? '' : (diarndotherarr5[1]?.pcPcss + " / " + ((diarndotherarr5[1]?.wtWts)?.toFixed(3))))
    // rowObj1.dia_info_name = ((diarndotherarr5[1]?.ShapeName !== undefined ? diarndotherarr5[1]?.ShapeName : "") + " " + 
    // ((diarndotherarr5[1]?.QualityName) === undefined ? '' : diarndotherarr5[1]?.QualityName) + " " + (diarndotherarr5[1]?.Colorname === undefined) ? '' : diarndotherarr5[1]?.Colorname)
    // rowObj1.dia_info_value = ((diarndotherarr5[1]?.pcPcss === undefined ? '' : diarndotherarr5[1]?.Colorname ) + " / " + ( diarndotherarr5[1]?.wtWts === undefined ? '' : (diarndotherarr5[1]?.wtWts)?.toFixed(3)))
    rowObj1.sum_info_name = (catewise[1] === undefined ? '' : catewise[1]?.Categoryname);
    rowObj1.sum_info_value = (catewise[1] === undefined ? '' : catewise[1]?.Quantity);
    rowObj1.remark = '';
    rowArr.push(rowObj1);



    let rowObj2 = {};
    rowObj2.grosswt_name = 'DIAMOND WT'
    rowObj2.grosswt_value = (`${datas?.mainTotal?.diamonds?.Pcs} / ${(datas?.mainTotal?.diamonds?.Wt)?.toFixed(3)}`);
    rowObj2.name = 'CST';
    rowObj2.value = (formatAmount((datas?.mainTotal?.colorstone?.Amount + datas?.mainTotal?.misc?.onlyIsHSCODE0_Amount)));
    rowObj2.dia_info_name = (diarndotherarr5[2] === undefined ? '' : (diarndotherarr5[2]?.ShapeName + " " + diarndotherarr5[2]?.QualityName + " " + diarndotherarr5[2]?.Colorname))
    rowObj2.dia_info_value = (diarndotherarr5[2] === undefined ? '' : (diarndotherarr5[2]?.pcPcss + " / " + (diarndotherarr5[2]?.wtWts)?.toFixed(3)))
    rowObj2.sum_info_name = (catewise[2] === undefined ? '' : catewise[2]?.Categoryname);
    rowObj2.sum_info_value = (catewise[2] === undefined ? '' : catewise[2]?.Quantity);
    rowObj2.remark = '';
    rowArr.push(rowObj2);


    let rowObj3 = {};
    rowObj3.grosswt_name = 'STONE WT'
    rowObj3.grosswt_value = (`${datas?.mainTotal?.colorstone?.Pcs} / ${(datas?.mainTotal?.colorstone?.Wt)?.toFixed(3)}`);
    rowObj3.name = 'MAKING';
    rowObj3.value = (formatAmount((datas?.mainTotal?.total_Making_Amount + datas?.mainTotal?.diamonds?.SettingAmount + datas?.mainTotal?.colorstone?.SettingAmount)));
    rowObj3.dia_info_name = (diarndotherarr5[3] === undefined ? '' : ((diarndotherarr5[3]?.ShapeName + " " + diarndotherarr5[3]?.QualityName + " " + diarndotherarr5[3]?.Colorname)))
    rowObj3.dia_info_value = (diarndotherarr5[3] === undefined ? '' : ((diarndotherarr5[3]?.pcPcss + " / " + (diarndotherarr5[3]?.wtWts)?.toFixed(3))))
    rowObj3.sum_info_name = (catewise[3] === undefined ? '' : catewise[3]?.Categoryname);
    rowObj3.sum_info_value = (catewise[3] === undefined ? '' : catewise[3]?.Quantity);
    rowObj3.remark = '';
    rowArr.push(rowObj3);


    let rowObj4 = {};
    rowObj4.grosswt_name = ''
    rowObj4.grosswt_value = '';
    rowObj4.name = 'OTHER';
    rowObj4.value = (formatAmount((datas?.mainTotal?.total_other + datas?.mainTotal?.totalMiscAmount + datas?.mainTotal?.total_diamondHandling)));
    rowObj4.dia_info_name = (diarndotherarr5[4] === undefined ? '' : (diarndotherarr5[4]?.ShapeName + " " + diarndotherarr5[4]?.QualityName + " " + diarndotherarr5[4]?.Colorname))
    rowObj4.dia_info_value = (diarndotherarr5[4] === undefined ? '' : (diarndotherarr5[4]?.pcPcss + " / " + (diarndotherarr5[4]?.wtWts)?.toFixed(3)))
    rowObj4.sum_info_name = (catewise[4] === undefined ? '' : catewise[4]?.Categoryname);
    rowObj4.sum_info_value = (catewise[4] === undefined ? '' : catewise[4]?.Quantity);
    rowObj4.remark = '';
    rowArr.push(rowObj4);


    let rowObj5 = {};
    rowObj5.grosswt_name = ''
    rowObj5.grosswt_value = '';
    rowObj5.name = 'TAX';
    rowObj5.value = (formatAmount(((+datas?.allTaxesTotal) * datas?.header?.CurrencyExchRate)));
    rowObj5.dia_info_name = (diarndotherarr5[5] === undefined ? '' : (diarndotherarr5[5]?.ShapeName + " " + diarndotherarr5[5]?.QualityName + " " + diarndotherarr5[5]?.Colorname))
    rowObj5.dia_info_value = (diarndotherarr5[5] === undefined ? '' : (diarndotherarr5[5]?.pcPcss + " / " + (diarndotherarr5[5]?.wtWts)?.toFixed(3)))
    rowObj5.sum_info_name = (catewise[5] === undefined ? '' : catewise[5]?.Categoryname);
    rowObj5.sum_info_value = (catewise[5] === undefined ? '' : catewise[5]?.Quantity);
    rowObj5.remark = '';
    rowArr.push(rowObj5);


    let rowObj6 = {};
    rowObj6.grosswt_name = ''
    rowObj6.grosswt_value = '';
    rowObj6.name = 'LESS';
    rowObj6.value = (formatAmount((datas?.header?.AddLess)));
    rowObj6.dia_info_name = (diarndotherarr5[6] === undefined ? '' : (diarndotherarr5[6]?.ShapeName + " " + diarndotherarr5[6]?.QualityName + " " + diarndotherarr5[6]?.Colorname))
    rowObj6.dia_info_value = (diarndotherarr5[6] === undefined ? '' : (diarndotherarr5[6]?.pcPcss + " / " + (diarndotherarr5[6]?.wtWts)?.toFixed(3)))
    rowObj6.sum_info_name = (catewise[6] === undefined ? '' : catewise[6]?.Categoryname);
    rowObj6.sum_info_value = (catewise[6] === undefined ? '' : catewise[6]?.Quantity);
    rowObj6.remark = '';
    rowArr.push(rowObj6);


    let rowObj7 = {};
    rowObj7.grosswt_name = ''
    rowObj7.grosswt_value = '';
    rowObj7.name = 'TOTAL';
    rowObj7.value = formatAmount((datas?.mainTotal.total_amount + datas?.header?.AddLess + (datas?.allTaxesTotal * datas?.header?.CurrencyExchRate)));
    rowObj7.dia_info_name = (diarndotherarr5[7] === undefined ? '' : (diarndotherarr5[7]?.ShapeName + " " + diarndotherarr5[7]?.QualityName + " " + diarndotherarr5[7]?.Colorname))
    rowObj7.dia_info_value = (diarndotherarr5[7] === undefined ? '' : (diarndotherarr5[7]?.pcPcss + " / " + (diarndotherarr5[7]?.wtWts)?.toFixed(3)))
    rowObj7.sum_info_name = (catewise[7] === undefined ? '' : catewise[7]?.Categoryname);
    rowObj7.sum_info_value = (catewise[7] === undefined ? '' : catewise[7]?.Quantity);
    rowObj7.remark = '';
    rowArr.push(rowObj7);

    let len2 = 8;
    if (catewise?.length > 8 || diarndotherarr5?.length > 8) {
      if (catewise?.length > diarndotherarr5?.length) {
        len2 = catewise?.length;
      }
      if (catewise?.length < diarndotherarr5?.length) {
        len2 = diarndotherarr5?.length;
      }
    }

    Array.from({ length: len2 })?.map((e, i) => {
      if (i > 7) {
        let rowObjs = {};
        rowObjs.grosswt_name = ''
        rowObjs.grosswt_value = '';
        rowObjs.name = '';
        rowObjs.value = ''
        rowObjs.dia_info_name = diarndotherarr5[i] !== undefined ? ((diarndotherarr5[i]?.ShapeName + " " + diarndotherarr5[i]?.QualityName + " " + diarndotherarr5[i]?.Colorname)) : ""
        rowObjs.dia_info_value = (diarndotherarr5[i] === undefined ? '' : (diarndotherarr5[i]?.pcPcss + " / " + (diarndotherarr5[i]?.wtWts)?.toFixed(3)))
        rowObjs.sum_info_name = catewise[i] !== undefined ? (catewise[i]?.Categoryname) : '';
        rowObjs.sum_info_value = catewise[i] !== undefined ? (catewise[i]?.Quantity) : '';
        rowObjs.remark = '';
        rowArr.push(rowObjs);
      }
    })

    setRowWise(rowArr);

    // for download excel direct
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      button.click();
    }, 500);



    // // Remove <blockquote> element
    // let modifiedContent = datas?.header?.Declaration?.replace(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/g, '');

    // // Wrap each item in <br> tags
    // let modifiedContent1 = modifiedContent?.replace(/<u><i><b><\span><\font><\div>/g, '<br>');
    // let modifiedContent2 = modifiedContent1?.replace(/<\/u><\/i><\/b><\/span><\/font><\/div>/g, '</br>');

    // console.log(modifiedContent2);

    //   const sanitizedHtml = sanitizeHtml(datas?.header?.Declaration, {
    //     allowedTags: ['b', 'i', 'u', 'span', 'font'], // Allow only basic formatting tags
    //     allowedAttributes: {
    //       'span': ['style'],
    //       'font': ['face']
    //     },
    //     textFilter: text => text.replace(/\n/g, ' ') // Replace newlines with spaces
    //   });

    //   // Convert sanitized HTML to plain text or simplified HTML
    //   const plainText = htmlToText(sanitizedHtml, {
    //     wordwrap: false, // Disable word wrapping
    //     singleNewLineParagraphs: true // Single new line between paragraphs
    //   });

    //   // datas.header.Declaration = plainText;

    // const sentences = plainText.replace(/\['1.','2.','3.','4.','5.']/g, '<br />');

    // Filter out empty strings and trim whitespace
    // const filteredSentences = sentences.filter(sentence => sentence.trim() !== '');

    // console.log(sentences);





    //loadData end
  }


  const totalMakingAmount = result?.resultArray?.reduce((acc, e) => {

    const weight = e?.GroupJob !== ''
      ? (e?.totals?.metal?.Wt - e?.totals?.metal?.IsNotPrimaryMetalWt)
      : e?.totals?.metal?.Wt;

    const calculation = e?.MakingChargeOnid == 4
      ? e?.MaKingCharge_Unit
      // : e?.MaKingCharge_Unit * weight;
      : e?.MakingAmount;

    return acc + (calculation || 0);

  }, 0);
  const TotalDuty = result?.resultArray?.reduce((acc, e) => {
    return acc + (e?.CustomDuty_Amount || 0);
  }, 0)

  //styles and css
  const tableCellStyle = {
    height: '40px',
    backgroundColor: '#939292',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  };

  {/* ── Style helpers (define outside JSX, e.g. at top of component file) ── */ }

  // Shared cell border/padding
  function thStyle(align = "center", bottomBorder = false) {
    return {
      border: "1px solid black",
      borderBottom: bottomBorder ? "1px solid black" : "1px solid black",
      padding: "3px 4px",
      textAlign: align,
      whiteSpace: "nowrap",
    };
  }

  function tdStyle(align = "left") {
    return {
      border: "none",
      borderRight: "1px solid black",
      padding: "2px 4px",
      textAlign: align,
      wordBreak: "break-word",
      verticalAlign: "top",
    };
  }

  function tdTotalStyle(align = "left") {
    return {
      ...tdStyle(align),
      borderTop: "1px solid #ccc",
      background: "#f0f0f0",
    };
  }

  // Build the flat labour rows array for a single item
  function buildLabourRows(e, result) {
    const rows = [];

    if (e?.GroupJob !== "") {
      result?.labour
        ?.filter((el) => el?.GroupjobNo === e?.GroupJob)
        ?.forEach((el) => {
          rows.push({
            charges: el?.name,
            rate: formatAmount(el?.MakingUnit),
            amount: formatAmount(el?.MakingCharge, 2),
          });
        });
    } else if (e?.MaKingCharge_Unit !== 0) {
      rows.push({
        charges: "Labour",
        rate: formatAmount(e?.MaKingCharge_Unit),
        amount: formatAmount(e?.MakingAmount),
      });
    }

    e?.other_details_array?.forEach((ele) => {
      rows.push({ charges: ele?.label, rate: "", amount: ele?.value });
    });

    [...(e?.misc_1List ?? []), ...(e?.misc_2List ?? []), ...(e?.misc_3List ?? [])].forEach((ele) => {
      if (ele?.Amount !== 0) {
        rows.push({
          charges: ele?.ShapeName,
          rate: "",
          amount: formatAmount(ele?.Amount / result?.header?.CurrencyExchRate),
        });
      }
    });

    if ((e?.totals?.diamonds?.SettingAmount ?? 0) + (e?.totals?.colorstone?.SettingAmount ?? 0) !== 0) {
      rows.push({
        charges: "Setting",
        rate: "",
        amount: formatAmount(
          ((e?.totals?.diamonds?.SettingAmount ?? 0) +
            (e?.totals?.colorstone?.SettingAmount ?? 0)) /
          result?.header?.CurrencyExchRate
        ),
      });
    }

    if ((e?.totals?.finding?.SettingAmount ?? 0) !== 0) {
      rows.push({
        charges: "Labour",
        rate: formatAmount(e?.totals?.finding?.SettingRate),
        amount: formatAmount(
          e?.totals?.finding?.SettingAmount / result?.header?.CurrencyExchRate
        ),
      });
    }

    if ((e?.TotalDiamondHandling ?? 0) !== 0) {
      rows.push({
        charges: "Handling",
        rate: "",
        amount: formatAmount(e?.TotalDiamondHandling / result?.header?.CurrencyExchRate),
      });
    }

    return rows;
  }


  console.log("TCL: result", result)


  return (
    <>
      {
        loader ? <Loader /> : <>
          {
            msg === '' ? <>
              <div style={{ paddingBottom: '5rem' }}>
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                  // className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5"
                  table="table-to-xls"
                  filename={`PackingList3B${result?.header?.InvoiceNo}_${Date.now()}`}
                  sheet="PackingList3B"
                  buttonText="Download as XLS"
                />


                <div className="mt-1">
                  <table
                    id="table-to-xls"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "inherit",        // inherits tb_fs_pcls equivalent
                      tableLayout: "fixed",
                    }}
                  >
                    {/* ── COLGROUP – mirrors the original CSS column widths ────────────── */}
                    <colgroup>
                      <col style={{ width: "3%" }} />         {/* Sr */}
                      <col style={{ width: "10%" }} />        {/* Design */}
                      {/* Diamond sub-cols */}
                      <col style={{ width: "5%" }} />         {/* D-Shape */}
                      <col style={{ width: "3%" }} />         {/* D-Pcs */}
                      <col style={{ width: "4%" }} />         {/* D-Wt */}
                      <col style={{ width: "4%" }} />         {/* D-Rate */}
                      <col style={{ width: "4%" }} />         {/* D-Amount */}
                      {/* Metal sub-cols */}
                      <col style={{ width: "5%" }} />         {/* M-Quality */}
                      <col style={{ width: "4%" }} />         {/* M-Gwt */}
                      <col style={{ width: "4%" }} />         {/* M-Net */}
                      <col style={{ width: "4%" }} />         {/* M-Loss */}
                      <col style={{ width: "4%" }} />         {/* M-Rate */}
                      <col style={{ width: "4%" }} />         {/* M-Amount */}
                      {/* Stone & Misc sub-cols */}
                      <col style={{ width: "5%" }} />         {/* S-Shape */}
                      <col style={{ width: "3%" }} />         {/* S-Pcs */}
                      <col style={{ width: "4%" }} />         {/* S-Wt */}
                      <col style={{ width: "4%" }} />         {/* S-Rate */}
                      <col style={{ width: "4%" }} />         {/* S-Amount */}
                      {/* Labour sub-cols */}
                      <col style={{ width: "5%" }} />         {/* L-Charges */}
                      <col style={{ width: "4%" }} />         {/* L-Rate */}
                      <col style={{ width: "4%" }} />         {/* L-Amount */}
                      {/* Duty + Total */}
                      <col style={{ width: "5%" }} />         {/* Duty Amount */}
                      <col style={{ width: "6%" }} />         {/* Total Amount */}
                    </colgroup>

                    {/* ── THEAD ─────────────────────────────────────────────────────────── */}
                    <thead>
                      {/* Row 1 – group headers */}
                      <tr style={{ borderTop: "1px solid black", background: "#f5f5f5", fontWeight: "bold" }}>
                        <th rowSpan={2} style={thStyle("center")}>Sr</th>
                        <th rowSpan={2} style={thStyle("center")}>Design</th>

                        <th colSpan={5} style={thStyle("center", true)}>Diamond</th>
                        <th colSpan={6} style={thStyle("center", true)}>Metal</th>
                        <th colSpan={5} style={thStyle("center", true)}>Stone &amp; Misc</th>
                        <th colSpan={3} style={thStyle("center", true)}>Labour &amp; Other Charges</th>

                        <th rowSpan={2} style={thStyle("center")}>Duty Amount</th>
                        <th rowSpan={2} style={thStyle("center")}>Total Amount</th>
                      </tr>

                      {/* Row 2 – sub-column labels */}
                      <tr style={{ background: "#f5f5f5", fontWeight: "bold" }}>
                        {/* Diamond */}
                        <th style={thStyle("center")}>Shape</th>
                        <th style={thStyle("center")}>Pcs</th>
                        <th style={thStyle("center")}>Wt</th>
                        <th style={thStyle("center")}>Rate</th>
                        <th style={thStyle("center")}>Amount</th>
                        {/* Metal */}
                        <th style={thStyle("center")}>Quality</th>
                        <th style={thStyle("center")}>Gwt</th>
                        <th style={thStyle("center")}>Net</th>
                        <th style={thStyle("center")}>Loss</th>
                        <th style={thStyle("center")}>Rate</th>
                        <th style={thStyle("center")}>Amount</th>
                        {/* Stone */}
                        <th style={thStyle("center")}>Shape</th>
                        <th style={thStyle("center")}>Pcs</th>
                        <th style={thStyle("center")}>Wt</th>
                        <th style={thStyle("center")}>Rate</th>
                        <th style={thStyle("center")}>Amount</th>
                        {/* Labour */}
                        <th style={thStyle("center")}>Charges</th>
                        <th style={thStyle("center")}>Rate</th>
                        <th style={thStyle("center")}>Amount</th>
                      </tr>
                    </thead>

                    {/* ── TBODY ─────────────────────────────────────────────────────────── */}
                    <tbody>
                      {result?.resultArray?.map((e, i) => {
                        /* ── pre-calculations (identical to original) ── */
                        const labourTotal =
                          e?.GroupJob !== ""
                            ? result?.labour
                              ?.filter((el) => el?.GroupjobNo === e?.GroupJob)
                              ?.reduce((sum, item) => sum + (item.MakingCharge || 0), 0) || 0
                            : 0;

                        const extraCharge =
                          (e?.OtherCharges || 0) +
                          (e?.TotalDiamondHandling || 0) +
                          (e?.totals?.misc?.IsHSCODE_1_amount || 0) +
                          (e?.totals?.misc?.IsHSCODE_2_amount || 0) +
                          (e?.totals?.misc?.IsHSCODE_3_amount || 0) +
                          (e?.totals?.diamonds?.SettingAmount || 0) +
                          (e?.totals?.colorstone?.SettingAmount || 0) +
                          (e?.totals?.finding?.SettingAmount || 0) +
                          labourTotal +
                          (e?.GroupJob !== ""
                            ? (e?.MaKingCharge_Unit || 0) *
                            ((e?.totals?.metal?.Wt || 0) -
                              (e?.totals?.metal?.IsNotPrimaryMetalWt || 0))
                            : e?.MakingAmount);

                        const finalAmount = extraCharge / (result?.header?.CurrencyExchRate || 1);

                        /* ── sorted sub-arrays (identical sort logic to original) ── */
                        const sortedDiamonds = e?.diamonds
                          ?.slice()
                          ?.sort((a, b) => {
                            const aCustom = a?.SizeName?.toLowerCase() === "custom";
                            const bCustom = b?.SizeName?.toLowerCase() === "custom";
                            if (aCustom && !bCustom) return 1;
                            if (!aCustom && bCustom) return -1;
                            const getNum = (v) => {
                              const m = v?.match(/[\d.]+/);
                              return m ? parseFloat(m[0]) : 0;
                            };
                            if (!aCustom && !bCustom) return getNum(a?.SizeName) - getNum(b?.SizeName);
                            return getNum(b?.CustomSize) - getNum(a?.CustomSize);
                          }) ?? [];

                        const sortedMetal = e?.metal
                          ?.slice()
                          ?.sort((a, b) => {
                            const aGJ = a?.StockBarcode === e?.GroupJob ? 1 : 0;
                            const bGJ = b?.StockBarcode === e?.GroupJob ? 1 : 0;
                            if (aGJ !== bGJ) return bGJ - aGJ;
                            const aP = a?.IsPrimaryMetal === 1 ? 1 : 0;
                            const bP = b?.IsPrimaryMetal === 1 ? 1 : 0;
                            return bP - aP;
                          }) ?? [];

                        /* ── build sub-row arrays so we can rowSpan the first column ── */
                        // Each "section" contributes rows; we merge them with rowspan on Sr/Design.

                        // Diamond rows
                        const dRows = sortedDiamonds;
                        // Metal rows: metal entries + finding entries + optional remark
                        const mRows = [
                          ...sortedMetal.map((el) => ({ type: "metal", el })),
                          ...(e?.finding ?? []).map((data) => ({ type: "finding", data })),
                        ];
                        // Stone rows: colorstone + misc_0
                        const sRows = [
                          ...(e?.colorstone ?? []).map((el) => ({ type: "cs", el })),
                          ...(e?.misc_0List ?? []).map((el) => ({ type: "misc0", el })),
                        ];
                        // Labour rows
                        const lRows = buildLabourRows(e, result);

                        const maxRows = Math.max(dRows.length, mRows.length, sRows.length, lRows.length, 1);

                        /* helper: get value for metal row at index idx */
                        const metalCell = (idx) => {
                          if (idx >= mRows.length) return null;
                          const r = mRows[idx];
                          if (r.type === "metal") {
                            const el = r.el;
                            const gwt =
                              e?.GroupJob === ""
                                ? el?.IsPrimaryMetal === 1 ? e?.grosswt?.toFixed(3) : ""
                                : e?.GroupJob === el?.StockBarcode ? e?.grosswt?.toFixed(3) : "";
                            const net =
                              el?.IsPrimaryMetal === 1
                                ? (el?.Wt - e?.totals?.finding?.Wt - e?.LossWt)?.toFixed(3)
                                : el?.Wt?.toFixed(3);
                            const loss =
                              e?.LossWt > 0 && el?.IsPrimaryMetal === 1
                                ? `${e?.LossPer}% / ${e?.LossWt?.toFixed(3)}`
                                : "";
                            return {
                              quality: `${el?.ShapeName} ${el?.QualityName}`,
                              gwt,
                              net,
                              loss,
                              rate: el?.Rate?.toFixed(2),
                              amount: el?.Amount?.toFixed(2),
                            };
                          }
                          if (r.type === "finding") {
                            const data = r.data;
                            const label =
                              e?.GroupJob !== ""
                                ? "FINDING ACCESSORIES"
                                : `${data?.FindingTypename} ${data?.QualityName}`;
                            const rate =
                              e?.GroupJob !== ""
                                ? e?.metal?.filter((m) => m?.IsPrimaryMetal === 1)[0]?.Rate?.toFixed(2)
                                : data?.Rate?.toFixed(2);
                            const amount =
                              e?.GroupJob !== ""
                                ? (
                                  e?.metal?.filter((m) => m?.IsPrimaryMetal === 1)[0]?.Rate *
                                  (parseFloat(data?.Wt) || 0)
                                )?.toFixed(2)
                                : data?.Amount?.toFixed(2);
                            return {
                              quality: label,
                              gwt: "",
                              net: data?.Wt?.toFixed(3),
                              loss: "",
                              rate,
                              amount,
                            };
                          }
                          return null;
                        };

                        /* helper: stone cell */
                        const stoneCell = (idx) => {
                          if (idx >= sRows.length) return null;
                          const r = sRows[idx];
                          if (r.type === "cs") {
                            const el = r.el;
                            return {
                              shape: `${el?.IsSolGem === 1 ? "G: " : ""}${el?.ShapeName}`,
                              pcs: el?.Pcs,
                              wt: el?.Wt?.toFixed(3),
                              rate: formatAmount(el?.Rate),
                              amount: formatAmount(el?.Amount / result?.header?.CurrencyExchRate),
                            };
                          }
                          if (r.type === "misc0") {
                            const el = r.el;
                            return {
                              shape: `${el?.ShapeName?.length !== 0 ? "M : " : ""}${el?.ShapeName}`,
                              pcs: el?.Pcs,
                              wt: el?.Wt?.toFixed(3),
                              rate: formatAmount(el?.Rate),
                              amount: formatAmount(el?.Amount / result?.header?.CurrencyExchRate),
                            };
                          }
                          return null;
                        };

                        /* helper: diamond cell */
                        const diamondCell = (idx) => {
                          if (idx >= dRows.length) return null;
                          const el = dRows[idx];
                          return {
                            shape: `${el?.IsSolGem === 1 ? "S: " : ""}${el?.ShapeName}`,
                            pcs: el?.Pcs,
                            wt: el?.Wt?.toFixed(3),
                            rate: formatAmount(el?.Rate),
                            amount: formatAmount(el?.Amount / result?.header?.CurrencyExchRate),
                          };
                        };

                        /* ── render maxRows table rows per item ── */
                        return Array.from({ length: maxRows + 1 }).map((_, rowIdx) => {
                          const isFirstRow = rowIdx === 0;
                          const isTotalRow = rowIdx === maxRows; // last row = totals / subtotal row

                          const dCell = !isTotalRow ? diamondCell(rowIdx) : null;
                          const mCell = !isTotalRow ? metalCell(rowIdx) : null;
                          const sCell = !isTotalRow ? stoneCell(rowIdx) : null;
                          const lCell = !isTotalRow ? lRows[rowIdx] ?? null : null;

                          return (
                            <tr
                              key={`${i}-${rowIdx}`}
                              style={{
                                borderTop: isFirstRow ? "1px solid black" : "none",
                                borderLeft: "1px solid black",
                                borderRight: "1px solid black",
                                verticalAlign: isTotalRow ? "middle" : "top",
                                background: isTotalRow ? "#f0f0f0" : "white",
                                fontWeight: isTotalRow ? "bold" : "normal",
                              }}
                            >
                              {/* ── Sr & Design: rowSpan covers detail rows only ─────── */}
                              {isFirstRow && (
                                <td
                                  rowSpan={maxRows}
                                  style={{ ...tdStyle("center"), borderTop: "1px solid black", verticalAlign: "top", paddingTop: 4 }}
                                >
                                  {i + 1}
                                </td>
                              )}
                              {isFirstRow && (
                                <td
                                  rowSpan={maxRows}
                                  style={{ ...tdStyle("left"), borderTop: "1px solid black", verticalAlign: "top", paddingTop: 4 }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                                    <span>{e?.designno}</span>
                                    <span>{e?.GroupJob !== "" ? e?.GroupJob : e?.SrJobno}</span>
                                  </div>
                                  <div style={{ textAlign: "right" }}>{e?.MetalColor}</div>

                                  <div>
                                    <img
                                      src={e?.DesignImage}
                                      // onError={handleImageError}
                                      alt="design"
                                      style={{ maxWidth: "20px", maxHeight: 60 }}
                                    />
                                  </div>

                                  {e?.Categoryname !== "" && <div style={{ fontWeight: "bold" }}>{e?.Categoryname}</div>}
                                  {e?.CertificateNo !== "" && <div>Certificate#: <b>{e?.CertificateNo}</b></div>}
                                  {e?.HUID !== "" && <div>HUID: <b>{e?.HUID}</b></div>}
                                  {e?.PO !== "" && <div><b>PO: {e?.PO}</b></div>}
                                  {e?.lineid !== "" && <div>{e?.lineid}</div>}
                                  {e?.Tunch !== "" && <div>Tunch: <b>{e?.Tunch?.toFixed(3)}</b></div>}
                                  {e?.Size !== "" && <div>Size: {e?.Size}</div>}
                                  {e?.grosswt !== "" && <div><b>{e?.grosswt?.toFixed(3)} gm</b> Gross</div>}
                                </td>
                              )}

                              {/* ── Sr & Design: total row replaces the rowSpanned cells ── */}
                              {isTotalRow && (
                                <td colSpan={2} style={{ ...tdStyle("center"), borderTop: "1px solid #ccc" }}>&nbsp;</td>
                              )}

                              {/* ── Diamond ────────────────────────────────────────────── */}
                              {isTotalRow ? (
                                <>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.totals?.diamonds?.Pcs !== 0 && e?.totals?.diamonds?.Pcs}
                                  </td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.totals?.diamonds?.Wt !== 0 && e?.totals?.diamonds?.Wt?.toFixed(3)}
                                  </td>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.totals?.diamonds?.Amount !== 0
                                      ? formatAmount(e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate)
                                      : "0.00"}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={tdStyle()}>{dCell?.shape ?? ""}</td>
                                  <td style={tdStyle("right")}>{dCell?.pcs ?? ""}</td>
                                  <td style={tdStyle("right")}>{dCell?.wt ?? ""}</td>
                                  <td style={tdStyle("right")}>{dCell?.rate ?? ""}</td>
                                  <td style={tdStyle("right")}><b>{dCell?.amount ?? ""}</b></td>
                                </>
                              )}

                              {/* ── Metal ──────────────────────────────────────────────── */}
                              {isTotalRow ? (
                                <>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.grosswt !== 0 && e?.grosswt?.toFixed(3)}
                                  </td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.NetWt + e?.LossWt !== 0 && (e?.NetWt + e?.LossWt)?.toFixed(3)}
                                  </td>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.totals?.metal?.Amount !== 0 &&
                                      formatAmount(
                                        (e?.totals?.metal?.Amount + e?.totals?.finding?.Amount) /
                                        result?.header?.CurrencyExchRate
                                      )}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={tdStyle()}>{mCell?.quality ?? ""}</td>
                                  <td style={tdStyle("right")}>{mCell?.gwt ?? ""}</td>
                                  <td style={tdStyle("right")}>{mCell?.net ?? ""}</td>
                                  <td style={tdStyle()}>{mCell?.loss ?? ""}</td>
                                  <td style={tdStyle("right")}>{mCell?.rate ?? ""}</td>
                                  <td style={tdStyle("right")}><b>{mCell?.amount ?? ""}</b></td>
                                </>
                              )}

                              {/* ── Stone & Misc ────────────────────────────────────────── */}
                              {isTotalRow ? (
                                <>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.totals?.misc?.IsHSCODE_0_pcs + e?.totals?.colorstone?.Pcs !== 0 &&
                                      e?.totals?.misc?.IsHSCODE_0_pcs + e?.totals?.colorstone?.Pcs}
                                  </td>
                                  <td style={tdTotalStyle("right")}>
                                    {e?.totals?.colorstone?.Wt + e?.totals?.misc?.IsHSCODE_0_wt !== 0 &&
                                      (e?.totals?.colorstone?.Wt + e?.totals?.misc?.IsHSCODE_0_wt)?.toFixed(3)}
                                  </td>
                                  <td style={tdTotalStyle()}>&nbsp;</td>
                                  <td style={tdTotalStyle("right")}>
                                    {formatAmount(
                                      e?.totals?.misc?.IsHSCODE_0_amount + e?.totals?.colorstone?.Amount !== 0 &&
                                      (e?.totals?.misc?.IsHSCODE_0_amount + e?.totals?.colorstone?.Amount) /
                                      result?.header?.CurrencyExchRate
                                    )}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={tdStyle()}>{sCell?.shape ?? ""}</td>
                                  <td style={tdStyle("right")}>{sCell?.pcs ?? ""}</td>
                                  <td style={tdStyle("right")}>{sCell?.wt ?? ""}</td>
                                  <td style={tdStyle("right")}>{sCell?.rate ?? ""}</td>
                                  <td style={tdStyle("right")}><b>{sCell?.amount ?? ""}</b></td>
                                </>
                              )}

                              {/* ── Labour ─────────────────────────────────────────────── */}
                              {isTotalRow ? (
                                <td colSpan={3} style={{ ...tdTotalStyle("right"), borderTop: "1px solid #ccc" }}>
                                  {extraCharge !== 0 && formatAmount(finalAmount)}
                                </td>
                              ) : (
                                <>
                                  <td style={tdStyle()}>{lCell?.charges ?? ""}</td>
                                  <td style={tdStyle("right")}>{lCell?.rate ?? ""}</td>
                                  <td style={tdStyle("right")}>{lCell?.amount ?? ""}</td>
                                </>
                              )}

                              {isTotalRow ? (
                                <td   style={{ ...tdTotalStyle("right"), borderTop: "1px solid #ccc" }}>
                                  {formatAmount(e?.CustomDuty_Amount)}
                                </td>
                              ) : (
                                <>
                                {isFirstRow && (

                                 <td     style={tdStyle("right")}>{formatAmount(e?.CustomDuty_Amount)}</td>  
                                )}
                                </>
                              )}

                        {isTotalRow ? (
                                <td    style={{ ...tdTotalStyle("right"), borderTop: "1px solid #ccc" }}>
                                   {formatAmount(
                                    e?.UnitCost + e?.CustomDuty_Amount / result?.header?.CurrencyExchRate
                                  )}
                                </td>
                              ) : (
                                <>
                                {isFirstRow && (
                                     <td   style={tdStyle("right")}>{formatAmount(
                                      e?.UnitCost + e?.CustomDuty_Amount / result?.header?.CurrencyExchRate
                                    )}</td>  
                               
                                )}
                                
                                 
                                 
                                </>
                              )}


                              

                               

                              
                            </tr>
                          );
                        });
                      })}
                    </tbody>

                    {/* ── TFOOT – main totals row ───────────────────────────────────────── */}
                    <tfoot>
                      <tr
                        style={{
                          borderBottom: "1px solid black",
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          borderTop: "1px solid black",
                          background: "#f5f5f5",
                          fontWeight: "bold",
                        }}
                      >
                        <td style={tdStyle("center")}>&nbsp;</td>
                        <td style={tdStyle("center")}>Total</td>

                        {/* Diamond totals */}
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle("right")}>{result?.mainTotal?.diamonds?.Pcs}</td>
                        <td style={tdStyle("right")}>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</td>
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle("right")}>
                          {formatAmount(
                            result?.mainTotal?.diamonds?.Amount / result?.header?.CurrencyExchRate
                          )}
                        </td>

                        {/* Metal totals */}
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle("right")}>{result?.mainTotal?.grosswt?.toFixed(3)}</td>
                        <td style={tdStyle("right")}>
                          {/* {(result?.mainTotal?.NetWt + result?.mainTotal?.LossWt)?.toFixed(3)} */}
                          {(
                            (Number(result?.mainTotal?.netwt) || 0) +
                            (Number(result?.mainTotal?.lossWt) || 0)
                          ).toFixed(3)}
                        </td>
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle("right")}>
                          {formatAmount(
                            (result?.mainTotal?.metal?.Amount + result?.mainTotal?.finding?.Amount) /
                            result?.header?.CurrencyExchRate
                          )}
                        </td>

                        {/* Stone totals */}
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle("right")}>
                          {Number(result?.mainTotal?.colorstone?.Pcs) || 0 + Number(result?.mainTotal?.misc?.IsHSCODE_0_pcs) || 0}
                        </td>
                        <td style={tdStyle("right")}>
                          {(
                            (Number(result?.mainTotal?.colorstone?.Wt) || 0) + Number(result?.mainTotal?.misc?.IsHSCODE_0_wt) || 0
                          )?.toFixed(3)}
                        </td>
                        <td style={tdStyle()}>&nbsp;</td>
                        <td style={tdStyle("right")}>
                          {formatAmount(
                            (Number(result?.mainTotal?.misc?.IsHSCODE_0_amount) || 0) +
                            Number(result?.mainTotal?.colorstone?.Amount) || 0) /
                            Number(result?.header?.CurrencyExchRate || 0)
                          }
                        </td>

                        {/* Labour totals */}
                        <td colSpan={3} style={tdStyle("right")}>
                          {formatAmount(
                            (
                              (result?.mainTotal?.OtherCharges || 0) +
                              (result?.mainTotal?.TotalDiamondHandling || 0) +
                              (result?.mainTotal?.diamonds?.SettingAmount || 0) +
                              (result?.mainTotal?.colorstone?.SettingAmount || 0) +
                              (result?.mainTotal?.finding?.SettingAmount || 0) +
                              (totalMakingAmount || 0) +
                              (result?.mainTotal?.misc?.IsHSCODE_1_amount || 0) +
                              (result?.mainTotal?.misc?.IsHSCODE_2_amount || 0) +
                              (result?.mainTotal?.misc?.IsHSCODE_3_amount || 0)
                            ) / (result?.header?.CurrencyExchRate || 1)
                          )}
                        </td>

                        {/* Duty total */}
                        <td style={tdStyle("right")}>{formatAmount(TotalDuty, 2)}</td>

                        {/* Grand total */}

                        {console.log("TCL:result?.mainTotal?.TotalAmount ", result?.mainTotal?.TotalAmount)}
                        {console.log("TCL:result?.mainTotal?.DiscountAmt ", result?.mainTotal?.DiscountAmt)}
                        <td style={tdStyle("right")}>
                          {formatAmount(
                            (
                              (Number(result?.mainTotal?.TotalAmount) || 0) +
                              (Number(result?.mainTotal?.DiscountAmt) || 0)
                            ) /
                            (Number(result?.header?.CurrencyExchRate) || 1)
                          )}
                        </td>
                      </tr>

                      {/* ── Remarks + tax summary rows ───────────────────────────────── */}
                      <tr
                        style={{
                          borderBottom: "1px solid black",
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                        }}
                      >
                        {/* Remarks spans most of the table */}
                        <td
                          colSpan={20}
                          style={{ padding: "4px 6px", verticalAlign: "top", fontSize: "inherit" }}
                        >
                          {result?.header?.PrintRemark  &&(
                            <>
                             <b>Remarks: </b>
                             <span dangerouslySetInnerHTML={{ __html: result?.header?.PrintRemark }} />
                            </>
                          )}
                         
                        </td>

                        {/* Tax summary stacked in last 3 columns */}
                        <td colSpan={3} style={{ padding: "4px 6px", verticalAlign: "top" }}>
                          {result?.mainTotal?.DiscountAmt !== 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Total Discount</span>
                              <span>
                                {formatAmount(
                                  result?.mainTotal?.DiscountAmt / result?.header?.CurrencyExchRate
                                )}
                              </span>
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Total Amount</span>
                            <span>
                              {formatAmount(
                                result?.mainTotal?.TotalAmount / result?.header?.CurrencyExchRate
                              )}
                            </span>
                          </div>
                          {result?.allTaxes?.map((tax, ti) => (
                            <div key={ti} style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{tax?.name} @ {tax?.per}</span>
                              <span>{formatAmount(tax?.amount)}</span>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>
                              {result?.header?.AddLess > 0
                                ? "Add"
                                : result?.header?.AddLess < 0
                                  ? "Less"
                                  : ""}
                            </span>
                            <span>
                              {result?.header?.AddLess !== 0 &&
                                formatAmount(
                                  result?.header?.AddLess / result?.header?.CurrencyExchRate
                                )}
                            </span>
                          </div>
                          {result?.header?.FreightCharges !== 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{result?.header?.ModeOfDel}</span>
                              <span>
                                {formatAmount(
                                  result?.header?.FreightCharges / result?.header?.CurrencyExchRate
                                )}
                              </span>
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                            <span>Final Amount</span>
                            <span>
                              {formatAmount(
                                (result?.mainTotal?.TotalAmount +
                                  result?.header?.AddLess +
                                  result?.header?.FreightCharges) /
                                result?.header?.CurrencyExchRate +
                                result?.allTaxesTotal
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>



              </div>
            </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          }
        </>
      }
    </>
  )
}

export default PackingListExcel
