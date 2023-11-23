import React, { useState, useEffect } from 'react'
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const DetailPrint11Excel = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [diamondSize, setDiamondSize] = useState(true);
  const [image, setImage] = useState(true);
  const [setting, setSetting] = useState(true);
  const [tunch, setTunch] = useState(true);
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

  const loadData = (data) => {
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

        let materialArr = [newArr[findRecord].materials, e.materials];
        let materials = [];
        materialArr.forEach((element, indexs) => {
          element.forEach((ele, ind) => {
            let findRecords = materials.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
              elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate &&
              elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
            newArr[findRecord].totalCol.pcs += ele?.Pcs;
            newArr[findRecord].totalCol.diaWt += ele?.Wt;
            newArr[findRecord].totalCol.diaAmount += ele?.Amount;
            newArr[findRecord].totalCol.settingAmount += ele?.SettingAmount;
            if (findRecords === -1) {
              materials.push(ele);
            } else {
              materials[findRecords].Pcs = ele?.Pcs;
              materials[findRecords].Wt = ele?.Wt;
              materials[findRecords].Amount = ele?.Amount;
              materials[findRecords].SettingRate = ele?.SettingRate;
              materials[findRecords].SettingAmount = ele?.SettingAmount;
            }
          });
        });
        newArr[findRecord].materials = materials;
      }
    });
    setJson1Data(newArr);

    let excelArr = [];
    console.log(newArr);
    newArr.forEach((e, i) => {
      let obj = { ...e };
      let length = obj?.materials?.length > 7 ? obj?.materials?.length : 7;
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
          metalColor: ind === 1 ? obj?.MetalColor : "",
          img: ind === 2 ? obj?.DesignImage : "",
          isImg: ind === 2 ? true : false,
          tunch: ind === 5 ? NumberWithCommas(obj?.Tunch, 3) : "",
          grossWt: ind === 6 ? fixedValues(obj?.grosswt, 3) : "",
          size: ind === 7 ? obj?.Size : "",
          diamondShape: obj?.materials[ind] ? obj?.materials[ind]?.ShapeName : "",
          diamondSize: obj?.materials[ind] ? obj?.materials[ind]?.SizeName : "",
          diamondPcs: obj?.materials[ind] ? obj?.materials[ind]?.Pcs : "",
          diamondWt: obj?.materials[ind] ? obj?.materials[ind]?.Wt : "",
          diamondRate: obj?.materials[ind] ? obj?.materials[ind]?.Rate : "",
          diamondAmount: obj?.materials[ind] ? obj?.materials[ind]?.Amount : "",
          // diamondSettingType: obj?.materials[ind] ? obj?.materials[ind]?.SettingRate : "",
          diamondSettingType: "",
          diamondSettingAmount: obj?.materials[ind] ? obj?.materials[ind]?.SettingAmount : "",
        }
      });
    })
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      // button.click();
    }, 0);
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
      <div className="container max_width_container pad_60_allPrint mt-4">
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
          table="table-to-xls"
          filename={`Sale_Format_A_${json0Data?.InvoiceNo}_${Date.now()}`}
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
            {/* {json1Data.length > 0 && json1Data.map((e, i) => {
              return <div className="d-flex w-100 border-bottom border-start border-end border-2 no_break overflow-hidden" key={i}>
                <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center"><p>{e?.SrNo}</p></div>
                <div className="designDetailPrint11 border-end">
                  <div className="d-flex justify-content-between p-1">
                    <div><p>{e?.designno}</p></div>
                    <div> <p>{e?.SrJobno}</p> <p>{e?.MetalColor}</p> </div>
                  </div>
                  {image && <img src={e?.DesignImage} alt="" className='w-100 p-1' onError={handleImageError} />}
                  {tunch && <p className='text-center fw-bold'>Tunch: {NumberWithCommas(e?.Tunch, 3)}</p>}
                  <p className='text-center fw-bold'>{fixedValues(e?.grosswt, 3)}gm Gross</p>
                  {e?.Size.length > 0 && <p className='text-center pb-1'>Size {e?.Size}</p>}
                  {e?.HUID !== "" && <p className='text-center pb-1'>HUID: {e?.HUID}</p>}
                </div>
                <div className="diamondStoneDetailPrint11 d-grid pad_bt_20semiTotalDetailPrint11 position-relative">
                  {e?.materials.length > 0 ? e?.materials.map((ele, ind) => {
                    return <div className='d-flex border-bottom' key={ind}>
                      <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''>{ele?.ShapeName}</p></div>
                      <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''>{diamondSize && (ele?.GroupName === "" ? ele?.SizeName : ele?.GroupName)}</p></div>
                      <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                      <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''>{fixedValues(ele?.Wt, 3)}</p></div>
                      <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className=''>{NumberWithCommas(ele?.Rate, 2)}</p></div>
                      <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                      <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'>{setting && ele?.SettingName}</p></div>
                      <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'>{setting && NumberWithCommas(ele?.SettingRate, 2)}</p></div>
                      <div className='totalMaterialAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'>{NumberWithCommas(ele?.SettingAmount, 2)}</p></div>
                    </div>
                  }) : <div className='d-flex border-bottom'>
                    <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''></p></div>
                    <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''></p></div>
                    <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''></p></div>
                    <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className=''></p></div>
                    <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className=''></p></div>
                    <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'></p></div>
                    <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'></p></div>
                    <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'></p></div>
                    <div className='totalMaterialAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center'></p></div>
                  </div>
                  }
                  <div className='d-flex position-absolute w-100 bottom-0 totalHeightDetailPrint11 semiTotalDetailPrint11 border-end'>
                    <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='fw-bold'>Total</p></div>
                    <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='fw-bold'>No. Of </p><p className="fw-bold">Pieces</p></div>
                    <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='fw-bold'>{NumberWithCommas(e?.totalCol?.pcs, 0)}</p></div>
                    <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='fw-bold'>{fixedValues(e?.totalCol?.diaWt, 3)}</p></div>
                    <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='fw-bold'>Diamond </p><p className="fw-bold">Total</p></div>
                    <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center fw-bold'>{NumberWithCommas(e?.totalCol?.diaAmount, 2)}</p></div>
                    <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center fw-bold'></p></div>
                    <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='text-center fw-bold'>Setting</p><p>Total</p><p>(Currency)</p></div>
                    <div className='totalMaterialAmountDetailPrint11 d-flex align-items-center justify-content-center flex-column'><p className='text-center fw-bold'>{NumberWithCommas(e?.totalCol?.settingAmount, 2)}</p></div>
                  </div>
                </div>
                <div className="goldDetailPrint11 border-end d-grid">
                  <div className='d-flex border-bottom'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Quality</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{e?.MetalPurity} {e?.MetalColor}</p></div>
                  </div>
                  <div className='d-flex border-bottom'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Gross Weight(Gms)</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{fixedValues(e?.grosswt, 3)} G</p></div>
                  </div>
                  <div className='d-flex border-bottom'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Net Weight</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{fixedValues(e?.NetWt, 3)} G</p></div>
                  </div>
                  <div className='d-flex border-bottom'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Gold Loss</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p>{fixedValues(e?.LossPer, 0)}%</p></div>
                  </div>
                  <div className='d-flex border-bottom'>
                    <div className='col-7 border-end d-flex align-items-start justify-content-center fw-bold flex-column'><p>Pure Gold weight</p><p> with Loss</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p>{fixedValues(e?.PureNetWt, 3)} G </p></div>
                  </div>
                  <div className='d-flex border-bottom'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Gold Price</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p>{NumberWithCommas(e?.metalRateGold, 2)}</p></div>
                  </div>
                  <div className='d-flex border-bottom broder-start'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className='p-1'>Alloy</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p>{NumberWithCommas(e?.alloy, 2)}</p></div>
                  </div>
                  <div className='d-flex'>
                    <div className='col-7 border-end d-flex align-items-center fw-bold'><p className='p-1'>Total Gold</p></div>
                    <div className='col-5 d-flex align-items-center justify-content-center'><p className='fw-bold'>{NumberWithCommas(e?.totalGold, 2)}</p></div>
                  </div>
                </div>
                <div className="labourDetailPrint11 border-end d-grid pad_bt_20DetailPrint11 position-relative">
                  <div className='d-flex border-bottom'>
                    <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                    <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                      <p>{NumberWithCommas(e?.MakingAmount, 2)}</p>
                    </div>
                  </div>
                  <div className='d-flex position-absolute bottom-0 w-100 min_height_20DetailPrint11'>
                    <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p className='fw-bold'>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                    <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                      <p className='fw-bold'>{NumberWithCommas(e?.MakingAmount, 2)}</p>
                    </div>
                  </div>
                </div>
                <div className="d-grid pad_bt_20DetailPrint11 position-relative totalAmountJewelleryDetailPrint11 ">
                  <div className="d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery border-bottom pe-2"><p>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                  <div className=" d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery position-absolute bottom-0 w-100 min_height_20DetailPrint11 pe-2"><p className='fw-bold'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                </div>
              </div>
            })} */}
            {/* {e?.MetalColor}
                  {image && <img src={e?.DesignImage} alt="" className='w-100 p-1' onError={handleImageError} width={120} height={120} />}
                  {tunch && (`Tunch: ${NumberWithCommas(e?.Tunch, 3)}`)}
                  {fixedValues(e?.grosswt, 3)}gm Gross
                  {e?.Size.length > 0 && <>Size {e?.Size}</>}
                  {e?.HUID !== "" && <>HUID: {e?.HUID}</>} */}
            {json1Data.length > 0 && json1Data.map((e, i) => {
              return <tr key={i}>
                <td></td>
                <td width={90} style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderTop: "1px solid #000", padding: "1px" }} align='center' >{i + 1}</td>
                <td width={200} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }}><span> {e?.designno}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ marginLeft: "5px", position: "relative", left: "10px" }}>{e?.SrJobno}</span>
                </td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Shape</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Size (mm)</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Pcs</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>DIA WT.</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Price / cts</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Dia Amount</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Setting Type</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Setting Price (Currency)</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000" }} align='center'>Total Amount (Currency)</td>
                <td width={150} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'></td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'></td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'>Other Charges</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'>Labour Amount</td>
                <td width={90} style={{ borderTop: "1px solid #000", borderRight: "1px solid #000", padding: "1px" }} align='center'>Total Jewellery Amount</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default DetailPrint11Excel