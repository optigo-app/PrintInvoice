import React, { useState, useEffect } from 'react'
import { NumberWithCommas, apiCall, checkImageExists, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import defaultImg from "../../assets/img/default.jpg";
const DetailPrint11Excel = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [taxes, setTaxes] = useState([]);
  // const [diamondSize, setDiamondSize] = useState(true);
  // const [image, setImage] = useState(true);
  // const [setting, setSetting] = useState(true);
  // const [tunch, setTunch] = useState(true);
  const [msg, setMsg] = useState("");
  const [gold, setGold] = useState({
    gold14k: false,
    gold18k: false,
  })
  const [total, setTotal] = useState({
    pcs: 0,
    diaWt: 0,
    diaAmount: 0,
    totalAmount: 0,
    totalGold: 0,
    totalLabour: 0,
    totalJewelleryAmount: 0,
    grandTotal: 0
  });
  const [summary, setSummary] = useState({
    gold14k: 0,
    gold18k: 0,
    diamondWt: 0,
    stoneWt: 0,
    grossWt: 0,
  });
  const [len, totalLen] = useState(0);

  const [goldTotal, setGoldTotal] = useState([]);

  const [totalArr, setTotalArr] = useState([]);

  const [excelData, setExcelData] = useState([]);

  const [bankDetail, setBankDetail] = useState([]);

  const loadData = (data) => {
    // console.log(data);
    let golds = { ...gold };
    setJson0Data(data.BillPrint_Json[0]);
    let resultAr = [];
    let totals = { ...total };
    let summaries = { ...summary };
    let fineWt = 0;
    data?.BillPrint_Json1.forEach((e, i) => {
      let elementsArr = [];
      let obj = { ...e };
      obj.metalRateGold = 0;
      obj.alloy = 0;
      obj.totalGold = 0;
      let totalCol = {
        pcs: 0,
        diaWt: 0,
        diaAmount: 0,
        settingAmount: 0,
      }
      obj.puregoldWeightWithLoss = obj?.NetWt + obj?.LossWt;
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          totalCol.settingAmount += (ele?.SettingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
          obj.puregoldWeightWithLoss += ele?.FineWt;
          if (ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2) {
            totalCol.pcs += ele?.Pcs;
            let obj = { ...ele };
            obj.Amount = ele?.Amount / data?.BillPrint_Json[0]?.CurrencyExchRate;
            obj.SettingAmount = ele?.SettingAmount / data?.BillPrint_Json[0]?.CurrencyExchRate;
            let findIndex = elementsArr.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname && elem?.SizeName === ele?.SizeName);
            if (findIndex === -1) {
              elementsArr.push(obj);
            } else {
              elementsArr[findIndex].Rate = ((elementsArr[findIndex].Amount / elementsArr[findIndex].Wt) + (ele.Amount / ele.Wt)) / 2
              elementsArr[findIndex].Wt += ele?.Wt;
              elementsArr[findIndex].Amount += ele?.Amount;
              elementsArr[findIndex].SettingAmount += ele?.SettingAmount;
              elementsArr[findIndex].Pcs += ele?.Pcs;
              if (elementsArr[findIndex].GroupName !== "") {
                elementsArr[findIndex].SizeName = elementsArr[findIndex].GroupName;
              }
              if (ele.GroupName !== "") {
                elementsArr[findIndex].SizeName = ele.GroupName;
              }
            }
            totals.pcs += ele?.Pcs;
            totals.diaWt += ele?.Wt;
            totals.diaAmount += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalAmount += (ele?.SettingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totalCol.diaWt += ele?.Wt;
            totalCol.diaAmount += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              summaries.diamondWt += ele?.Wt;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              summaries.stoneWt += ele?.Wt;
            }
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            obj.alloy += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            obj.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            if (ele?.QualityName === "18K") {
              golds.gold18k = true;
            } else if (ele?.QualityName === "14K") {
              golds.gold14k = true;
            }
            obj.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            if (ele?.QualityName === "14K") {
              summaries.gold14k += ele?.Wt;
            } else if (ele?.QualityName === "18K") {
              summaries.gold18k += ele?.Wt;
            }
            obj.metalRateGold += (ele?.Rate / data.BillPrint_Json[0]?.CurrencyExchRate);
            fineWt = ele?.FineWt
          }
        }
      });
      summaries.grossWt += e?.grosswt;
      obj.OtherCharges = (e?.OtherCharges / data.BillPrint_Json[0]?.CurrencyExchRate);
      totals.totalLabour += (e?.MakingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.MakingAmount = (e?.MakingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      totals.totalJewelleryAmount += (e?.TotalAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.TotalAmount = (e?.TotalAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.materials = elementsArr;
      obj.totalCol = totalCol;
      obj.fineWt = fineWt;
      resultAr.push(obj);
    });
    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.totalJewelleryAmount);
    taxValue.length > 0 && taxValue.forEach((e, i) => {
      totals.grandTotal += (+e?.amount / data.BillPrint_Json[0]?.CurrencyExchRate);
    });
    totals.grandTotal += data?.BillPrint_Json[0]?.AddLess + totals?.totalJewelleryAmount;
    setTaxes(taxValue);
    setSummary(summaries);
    setTotal(totals);
    // setJson1Data(resultAr);
    setLoader(false);
    setGold(golds);

    let newArr = [];
    resultAr.forEach((e, i) => {
      let obj = { ...e };
      let findRecord = newArr.findIndex((ele, ind) => ele?.GroupJobid === e?.GroupJobid && e?.GroupJobid !== 0);
      if (findRecord === -1) {
        newArr.push(obj);
      } else {
        if (newArr[findRecord]?.SrJobno !== newArr[findRecord]?.GroupJob) {
          newArr[findRecord].SrJobno = obj?.SrJobno;
          newArr[findRecord].designno = obj?.designno;
          newArr[findRecord].MetalColor = obj?.MetalColor;
          newArr[findRecord].DesignImage = obj?.DesignImage;
          newArr[findRecord].MetalPurity = obj?.MetalPurity;
          newArr[findRecord].MetalColor = obj?.MetalColor;
        }
        newArr[findRecord].grosswt += obj?.grosswt;
        newArr[findRecord].NetWt += obj?.NetWt;
        newArr[findRecord].LossPer += obj?.LossPer;
        newArr[findRecord].PureNetWt += obj?.PureNetWt;
        newArr[findRecord].metalRateGold += obj?.metalRateGold;
        newArr[findRecord].alloy += obj?.alloy;
        newArr[findRecord].totalGold += obj?.totalGold;
        newArr[findRecord].OtherCharges += obj?.OtherCharges;
        newArr[findRecord].MakingAmount += obj?.MakingAmount;
        newArr[findRecord].TotalAmount += obj?.TotalAmount;

        newArr[findRecord].totalCol.pcs += obj.totalCol.pcs;
        newArr[findRecord].totalCol.diaWt += obj.totalCol.diaWt;
        newArr[findRecord].totalCol.diaAmount += obj.totalCol.diaAmount;
        newArr[findRecord].totalCol.settingAmount += obj.totalCol.settingAmount;

        let materialArr = [newArr[findRecord].materials, e.materials];
        let materials = [];
        materialArr.forEach((element, indexs) => {
          element.forEach((ele, ind) => {
            let findRecords = materials.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
              elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate &&
              elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
            // newArr[findRecord].totalCol.pcs += ele?.Pcs;
            // newArr[findRecord].totalCol.diaWt += ele?.Wt;
            // newArr[findRecord].totalCol.diaAmount += ele?.Amount;
            // newArr[findRecord].totalCol.settingAmount += ele?.SettingAmount;
            if (findRecords === -1) {
              materials.push(ele);
            } else {
              materials[findRecords].Pcs += ele?.Pcs;
              materials[findRecords].Wt += ele?.Wt;
              materials[findRecords].Amount += ele?.Amount;
              materials[findRecords].SettingRate = ele?.SettingRate;
              materials[findRecords].SettingAmount += ele?.SettingAmount;
            }
          });
        });
        newArr[findRecord].materials = materials;
      }
    });
    setJson1Data(newArr);

    let excelArr = [];
    newArr.forEach((e, i) => {
      let obj = { ...e };
      let length = obj?.materials?.length > 10 ? obj?.materials?.length : 10;
      let goldArr = [
        {
          label: "Quality",
          value: `${e?.MetalPurity} ${e?.MetalColor}`,
        },
        {
          label: "QualGross Weight(Gms)",
          value: `${fixedValues(e?.grosswt, 3)} G`,
        },
        {
          label: "Net Weight",
          value: `${fixedValues(e?.NetWt, 3)} G`,
        },
        {
          label: "Gold Loss",
          value: `${fixedValues(e?.LossPer, 0)}%`,
        },
        {
          label: "Pure Gold weight with Loss",
          value: `${fixedValues(e?.PureNetWt, 3)} G `,
        },
        {
          label: "Gold Price",
          value: `${NumberWithCommas(e?.metalRateGold, 2)}`,
        },
        {
          label: "Alloy",
          value: `${NumberWithCommas(e?.alloy, 2)}`,
        },
        {
          label: "Total Gold",
          value: `${NumberWithCommas(e?.totalGold, 2)}`,
        },
      ];
      Array.from({ length: length }).forEach((ele, ind) => {
        let object = {
          srNo: ind === 0 ? i + 1 : "",
          designNo: ind === 0 ? obj?.designno : "",
          SrJobno: ind === 0 ? obj?.SrJobno : "",
          metalColor: ind === 1 ? obj?.MetalColor : "",
          img: ind === 2 ? obj?.DesignImage : "",
          isImg: ind === 2 ? true : false,
          tunch: ind === 6 ? NumberWithCommas(obj?.Tunch, 3) : "",
          grossWt: ind === 7 ? fixedValues(obj?.grosswt, 3) : "",
          size: ind === 8 ? obj?.Size : "",
          huid: ind === 9 ? obj?.HUID : "",
          diamondShape: obj?.materials[ind] ? obj?.materials[ind]?.ShapeName : "",
          diamondSize: obj?.materials[ind] ? obj?.materials[ind]?.SizeName : "",
          diamondPcs: obj?.materials[ind] ? obj?.materials[ind]?.Pcs : "",
          diamondWt: obj?.materials[ind] ? obj?.materials[ind]?.Wt : "",
          diamondRate: obj?.materials[ind] ? obj?.materials[ind]?.Rate : "",
          diamondAmount: obj?.materials[ind] ? obj?.materials[ind]?.Amount : "",
          diamondSettingType: "",
          diamondSettingRate: obj?.materials[ind] ? obj?.materials[ind]?.SettingRate : "",
          diamondSettingAmount: obj?.materials[ind] ? obj?.materials[ind]?.SettingAmount : "",
          goldLabel: (goldArr[ind] && ind < 7) ? goldArr[ind]?.label : "",
          goldValue: (goldArr[ind] && ind < 7) ? goldArr[ind]?.value : "",
          otherChanges: ind === 0 ? NumberWithCommas(e?.OtherCharges, 2) : "",
          labourAmount: ind === 0 ? NumberWithCommas(e?.MakingAmount, 2) : "",
          totalAmount: ind === 0 ? NumberWithCommas(e?.TotalAmount, 2) : "",
          totalLine: false,
        };
        excelArr.push(object)
      });
      let objectTotal = {
        srNo: "",
        designNo: "",
        SrJobno: "",
        metalColor: "",
        img: "",
        isImg: false,
        tunch: "",
        grossWt: "",
        size: "",
        huid: "",
        diamondShape: "Total",
        diamondSize: "No of Pieces",
        diamondPcs: NumberWithCommas(obj?.totalCol?.pcs, 0),
        diamondWt: fixedValues(e?.totalCol?.diaWt, 3),
        diamondRate: "Diamond total",
        diamondAmount: NumberWithCommas(e?.totalCol?.diaAmount, 2),
        diamondSettingType: "",
        diamondSettingRate: "Setting Total (Currency)",
        diamondSettingAmount: NumberWithCommas(e?.totalCol?.settingAmount, 2),
        // goldLabel: goldArr[7].label,
        goldLabel: goldArr[7]?.label,
        goldValue: goldArr[7]?.value,
        // goldValue: goldArr[7].value,
        otherChanges: NumberWithCommas(e?.OtherCharges, 2),
        labourAmount: NumberWithCommas(e?.MakingAmount, 2),
        totalAmount: NumberWithCommas(e?.TotalAmount, 2),
        totalLine: true,
      };
      excelArr.push(objectTotal);
    });
    setExcelData(excelArr);
    let goldArr = [
      {
        label: "GOLD 18K: ",
        value: `${fixedValues(summaries?.gold18k, 3)} gm`,
      },
      {
        label: "Diamond Wt: ",
        value: `${fixedValues(summaries?.gold18k, 3)} gm`,
      },
      {
        label: "Stone Wt:",
        value: `${fixedValues(summaries?.stoneWt, 3)} cts`,
      },
      {
        label: "Gross Wt:",
        value: `${fixedValues(summaries?.grossWt, 3)} gm`,
      },
    ];
    golds?.gold14k && goldArr.unshift({ label: "GOLD 14K: ", value: `${fixedValues(summary?.gold14k, 3)} gm` });

    let totalArr = [];
    totalArr.push({ label: "Total", value: NumberWithCommas(totals?.totalJewelleryAmount, 2) });
    taxValue.forEach((e, i) => {
      let obj = { ...e };
      totalArr.push({ label: `${e?.name} per ${e?.per}`, value: e?.amount });
    });
    totalArr.push({ label: `${data.BillPrint_Json[0]?.AddLess > 0 ? "Add" : "Less"}`, value: data.BillPrint_Json[0]?.AddLess });

    let lens = totalArr.length > goldArr.length ? totalArr.length : goldArr.length;
    totalLen(lens);

    setGoldTotal(goldArr);
    setTotalArr(totalArr);

    let bankArr = [{      
      label: "Bank Detail",
      value: "",
    },{      
      label: "Bank Name: ",
      value: data.BillPrint_Json[0]?.bankname,
    },
    {      
      label: "Branch: ",
      value: data.BillPrint_Json[0]?.bankaddress,
    },
    {      
      label: "Account Name:",
      value: data.BillPrint_Json[0]?.accountname,
    },
    {      
      label: "Account No.:",
      value: data.BillPrint_Json[0]?.accountnumber,
    },
    {      
      label: "RTGS/NEFT IFSC: ",
      value: data.BillPrint_Json[0]?.rtgs_neft_ifsc,
    },];

    setBankDetail(bankArr);

    
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      button.click();
    }, 1500);
  }
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
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
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    sendData();
  }, []);
  return (
    loader ? <Loader /> : msg === "" ? <>
      <div className="container max_width_container pad_60_allPrint mt-4 d-none">
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
          table="table-to-xls"
          filename={`DetailPrint11_${json0Data?.InvoiceNo}_${Date.now()}`}
          sheet="tablexls"
          buttonText="Download as XLS" />
        <table id='table-to-xls' >
          <tbody>
            <tr>
            </tr>
            {/* company address and logo */}
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black', borderTop: '1px solid black', padding: '1px' }}><b>{json0Data?.CompanyFullName}</b></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td style={{ borderTop: '1px solid black', borderRight: '1px solid black', padding: '1px' }} className='d-block text-end' width={180}>
                <img src={json0Data?.PrintLogo} alt="" className='w-25 h-auto ms-auto d-block object-fit-contain' height={120} width={150} />
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.CompanyAddress}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ borderRight: '1px solid black', padding: '1px' }}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.CompanyAddress2}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ borderRight: '1px solid black', padding: '1px' }}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.CompanyCity} {json0Data?.CompanyPinCode} {json0Data?.CompanyState} {json0Data?.CompanyCountry}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ borderRight: '1px solid black', padding: '1px' }}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ borderRight: '1px solid black', padding: '1px' }}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black', borderBottom: "1px solid black", padding: '1px' }}>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderRight: '1px solid black', borderBottom: "1px solid black", padding: '1px' }}></td>
            </tr>
            {/* company address and logo */}
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.lblBillTo}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}>invoice#:{json0Data?.InvoiceNo} </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.customerfirmname}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}>{json0Data?.Cust_VAT_GST_No !== "" && (`${json0Data?.Cust_VAT_GST_No} | `)}  {json0Data?.Cust_CST_STATE_No_} </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.customerAddress1}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}>Terms: {json0Data?.DueDays} Days</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.customerAddress2}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}>Due Date: {json0Data?.DueDate}</td>
            </tr>
            {json0Data?.customerAddress3 !== "" && <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.customerAddress3}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}></td>
            </tr>}
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.customercity}, {json0Data?.State}-{json0Data?.PinCode}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>Tel: {json0Data?.customermobileno}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', borderBottom: '1px solid black', padding: '1px' }}>{json0Data?.customeremail1}</td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td style={{ borderBottom: `1px solid #000` }}></td>
              <td colSpan={4} style={{ borderRight: '1px solid black', borderBottom: '1px solid black', padding: '1px' }} className='d-block' align="right" width={150}></td>
            </tr>
            {/* table header */}
            <tr></tr>
            <tr>
              <td></td>
              <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderTop: "1px solid #000", padding: "1px" }} align='center' ><b>Sr. No.</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'><b>Design Detail</b></td>
              <td colSpan={9} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Diamond & Stone Detail</b></td>
              <td colSpan={2} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'><b>Gold</b></td>
              <td colSpan={2} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'><b>Labour</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'><b>Total Jewellery Amount</b></td>
            </tr>
            <tr>
              <td></td>
              <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderTop: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center' ></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center'></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Shape</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Size (mm)</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Pcs</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>DIA WT.</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Price / cts</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Dia Amount</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Setting Type</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Setting Price (Currency)</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "1px" }} align='center'><b>Total Amount (Currency)</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center'></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center'></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center'><b>Other Charges</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center'><b>Labour Amount</b></td>
              <td style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: "1px solid #000" }} align='center'><b>Total Jewellery Amount</b></td>
            </tr>
            {/* table data */}
            {excelData.length > 0 && excelData.map((e, i) => {
              return <tr key={i}>
                <td></td>
                <td width={90} style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center' >{e?.srNo}</td>
                <td width={200} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }}>
                  {e?.SrJobno !== "" && <><span> {e?.designNo}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style={{ marginLeft: "5px", position: "relative", left: "10px" }}>{e?.SrJobno}</span></>}
                  {e?.isImg && <img src={e?.img} alt="" onError={handleImageError} width={150} height={80} style={{ paddingLeft: "10px", objectFit: "contain" }} />}
                  {e?.metalColor !== "" && e?.metalColor} {e?.tunch !== "" && (`Tunch: ${NumberWithCommas(e?.tunch, 3)}`)}
                  {e?.grossWt !== "" && `${fixedValues(e?.grossWt, 3)} gm Gross`}
                  {e?.size !== "" && <>Size {e?.size}</>}
                  {e?.huid !== "" && <>HUID: {e?.huid}</>}
                </td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondShape}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondSize}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondPcs}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondWt}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondRate}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondAmount}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondSettingType}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondSettingRate}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.diamondSettingAmount}</td>
                <td width={150} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.goldLabel}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.goldValue}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.OtherCharges}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.labourAmount}</td>
                <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `${e?.totalLine && `1px solid`}`, borderTop: `${e?.totalLine && `1px solid`}` }} align='center'>{e?.totalAmount}</td>
              </tr>
            })}
            {/* table total */}
            <tr>
              <td></td>
              <td colSpan={2} width={290} style={{ border: "1px solid #000", padding: "1px" }} align='center'><b>Total</b> </td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'></td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>No of Pieces</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{NumberWithCommas(total?.pcs, 0)}</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{fixedValues(total?.diaWt, 3)}</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>Diamond total</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{NumberWithCommas(total?.diaAmount, 2)}</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'></td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>Setting Total (Currency)</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{NumberWithCommas(total?.totalAmount, 2)}</td>
              <td width={150} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>Total Gold</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{fixedValues(total?.totalGold, 3)}</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>Total Labour</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{NumberWithCommas(total?.totalLabour, 2)}</td>
              <td width={90} style={{ borderRight: "1px solid #000", padding: "1px", borderBottom: `1px solid`, borderTop: `1px solid` }} align='center'>{NumberWithCommas(total?.totalJewelleryAmount, 2)}</td>
            </tr>
            {len > 0 && Array.from({ length: len }).map((e, i) => {
              return <tr key={i}>
                <td></td>
               {i===0 && <td colSpan={4} rowSpan={4} width={560} style={{ borderBottom: "1px solid #000", borderLeft: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} VALIGN="TOP">
                  {i === 0 && <><span>Remark :</span><span dangerouslySetInnerHTML={{ __html: json0Data?.PrintRemark }} className='p-1'></span></>}
                </td>}
                <td colSpan={4} width={270} style={{ borderBottom: (i === len - 1 && "1px solid #000"), borderRight: "1px solid #000", padding: "1px" }}><b></b> </td>
                <td colSpan={2} width={180} style={{ borderBottom: (i === len - 1 && "1px solid #000"), padding: "1px" }}>{goldTotal[i] && goldTotal[i]?.label}</td>
                <td colSpan={2} width={180} style={{ borderBottom: (i === len - 1 && "1px solid #000"), borderRight: "1px solid #000", padding: "1px" }} align='right'>{goldTotal[i] && goldTotal[i]?.value}</td>
                <td colSpan={2} width={420} style={{ borderBottom: (i === len - 1 && "1px solid #000"), borderRight: "1px solid #000", padding: "1px" }}>{totalArr[i] && totalArr[i]?.label} </td>
                <td colSpan={2} width={180} style={{ borderBottom: (i === len - 1 && "1px solid #000"), borderRight: "1px solid #000", padding: "1px" }}><b>{totalArr[i] && totalArr[i]?.value}</b></td>
              </tr>
            })}
            <tr>
              <td></td>
              <td colSpan={14} style={{ borderLeft: "1px solid", borderRight: "1px solid", borderBottom: "1px solid" }} align='right'><b>Grand Total</b> </td>
              <td colSpan={2} style={{ borderRight: "1px solid", borderBottom: "1px solid" }} align='right'><b>{NumberWithCommas(total?.grandTotal, 2)}</b></td>
            </tr>
            {bankDetail.length > 0 && bankDetail.map((e, i) => {
              return <tr key={i}>
              <td></td>
              <td colSpan={8} style={{ borderLeft: "1px solid", borderRight: "1px solid", borderBottom: `${i===bankDetail.length-1 && "1px solid"}` }} >{e?.label} {e?.value}</td>
              <td colSpan={4} style={{ borderRight: "1px solid", borderBottom: `${i===bankDetail.length-1 && "1px solid"}` }}>{i===0 && json0Data?.CompanyFullName} {i===bankDetail.length-1 && "Signature"}</td>
              <td colSpan={4} style={{ borderRight: "1px solid", borderBottom: `${i===bankDetail.length-1 && "1px solid"}` }}>{i===0 && json0Data?.customerfirmname} {i===bankDetail.length-1 && "Signature"}</td>
            </tr>
            })}
          </tbody>
        </table>
      </div>
    </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default DetailPrint11Excel