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
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      button.click();
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
              <td width={630} colSpan={6} style={{ borderLeft: '1px solid black', borderTop: '1px solid black', padding: '1px' }}><b>{json0Data?.CompanyFullName}</b></td>
              <td width={90} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={90} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={90} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={90} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={90} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={180} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={90} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
              <td width={150} style={{ borderTop: '1px solid black', padding: '1px' }}></td>
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
              <td style={{ borderRight: '1px solid black', padding: '1px' }}></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={6} style={{ borderLeft: '1px solid black',borderBottom: "1px solid black", padding: '1px' }}>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{borderBottom: "1px solid black", padding: '1px' }}></td>
              <td style={{ borderRight: '1px solid black',borderBottom: "1px solid black", padding: '1px' }}></td>
            </tr>
            {/* company address and logo */}
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.lblBillTo}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={6} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block'  align="right" width={150}>invoice#:{json0Data?.InvoiceNo} </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={4} style={{ borderLeft: '1px solid black', padding: '1px' }}>{json0Data?.customerfirmname}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={6} style={{ borderRight: '1px solid black', padding: '1px' }} className='d-block'  align="right" width={150}>{json0Data?.Cust_VAT_GST_No !== "" && (`${json0Data?.Cust_VAT_GST_No} | `)}  {json0Data?.Cust_CST_STATE_No_} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default DetailPrint11Excel