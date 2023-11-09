import React, { useEffect } from 'react';
import "../../assets/css/prints/detailPrint1.css";
import { useState } from 'react';
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, otherAmountDetail, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const DetailPrint1 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [image, setImage] = useState(false);
  const [checkBox, setCheckBox] = useState({
    image: false,
    brokarage: false
  })
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [json1Data2, setJson1Data2] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [detailtPrintR, setdetailtPrintR] = useState(atob(printName).toLowerCase() === "detail print r" ? true : false);
  const [detailtPrintL, setdetailtPrintL] = useState(atob(printName).toLowerCase() === "detail print1 (l)" ? true : false);

  const [brokarage, setBrokarage] = useState([]);
  const [msg, setMsg] = useState("");
  const [total, setTotal] = useState({
    diamondPcs: 0,
    diamondWt: 0,
    diamondAmount: 0,
    metalWt: 0,
    metalNL: 0,
    metalAmount: 0,
    colorStonePcs: 0,
    colorStoneWt: 0,
    colorStoneAmount: 0,
    totalAmount: 0,
    discountTotalAmount: 0,
    sgstAmount: 0,
    cgstAmount: 0,
    withoutDiscountTotalAmount: 0,
    withDiscountTaxAmount: 0,
    labourAmount: 0,
    netWt: 0
  });
  const [summary, setSummary] = useState({
    gold24Kt: 0,
    grossWt: 0,
    gDWt: 0,
    netWt: 0,
    diamondWt: 0,
    diamondpcs: 0,
    stoneWt: 0,
    stonePcs: 0,
    metalAmount: 0,
    diamondAmount: 0,
    colorStoneAmount: 0,
    makingAmount: 0,
    otherCharges: 0,
    addLess: 0,
    total: 0,
  });
  const [taxes, setTaxes] = useState([]);
  // const [diamondDetails, setDiamondDetails] = useState([]);

  const handleChange = (e) => {
    const {name, checked} = e?.target;
    setCheckBox({...checkBox, [name]: checked});
  }

  // eslint-disable-next-line no-unused-vars
  const findDiamond = (obj, diamondArr) => {
    let recordIndex = diamondArr.findIndex((e, i) => e?.ShapeName === obj?.ShapeName && e?.QualityName === obj?.QualityName && e?.Colorname === obj?.Colorname);
    return recordIndex;
  }

  const loadData = (data) => {
    setJson0Data(data?.BillPrint_Json[0]);
    setJson1Data2(data?.BillPrint_Json2)
    setLoader(false);
    let brok = otherAmountDetail(data?.BillPrint_Json[0]?.Brokerage);
    setBrokarage(brok);
  }


  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);

            let arr = organizeDataSample(
              data?.Data?.BillPrint_Json[0],
              data?.Data?.BillPrint_Json1,
              data?.Data?.BillPrint_Json2
            );
            setJson1Data(arr)
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

  const organizeDataSample = (hr, ar1, ar2) => {

    let resultArr = [];
    let totals = {
      diamondPcs: 0,
      diamondWt: 0,
      diamondAmount: 0,
      metalWt: 0,
      metalNL: 0,
      metalAmount: 0,
      colorStonePcs: 0,
      colorStoneWt: 0,
      colorStoneAmount: 0,
      totalAmount: 0,
      discountTotalAmount: 0,
      sgstAmount: 0,
      cgstAmount: 0,
      withoutDiscountTotalAmount: 0,
      withDiscountTaxAmount: 0,
      labourAmount: 0,
      netWt: 0
    };

    let summary = {
      gold24Kt: 0,
      grossWt: 0,
      gDWt: 0,
      netWt: 0,
      diamondWt: 0,
      diamondpcs: 0,
      stoneWt: 0,
      stonePcs: 0,
      metalAmount: 0,
      diamondAmount: 0,
      colorStoneAmount: 0,
      makingAmount: 0,
      otherCharges: 0,
      addLess: 0,
      total: 0,
    };


    // eslint-disable-next-line array-callback-return
    ar1?.map((e) => {
      if (detailtPrintR || detailtPrintL) {
        summary.gold24Kt = summary.gold24Kt + e?.PureNetWt;
      }
      let totalAmounts = e?.DiscountAmt + e?.TotalAmount;
      let OtherAmountDetail = otherAmountDetail(e?.OtherAmtDetail);
      let totalOther = e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling;
      totals.labourAmount += e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost;
      let obj = { ...e };
      obj.OtherAmountDetail = OtherAmountDetail;
      obj.totalOther = totalOther;
      obj.SettingAmount = 0;
      let diamondArr = [];
      let metalArr = [];
      let colorStoneArr = [];
      let diamondsTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0
      }
      let metalTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0
      }
      let colorStonesTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0
      }
      let discountTotalAmount = 0;

      // eslint-disable-next-line array-callback-return
      ar2?.map((el) => {
        if (e?.SrJobno === el?.StockBarcode) {
          if (el?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondArr.push(el);
            diamondsTotal.Pcs += el?.Pcs;
            diamondsTotal.Wt += el?.Wt;
            diamondsTotal.Amount += el?.Amount;
            totals.diamondPcs += el?.Pcs;
            totals.diamondWt += el?.Wt;
            totals.diamondAmount += el?.Amount;
            summary.diamondWt += el?.Wt;
            summary.diamondpcs += el?.Pcs;
            summary.diamondAmount += el?.Amount;
          }
          if (el?.MasterManagement_DiamondStoneTypeid === 4) {
            metalArr.push(el);
            metalTotal.Pcs += el?.Pcs;
            metalTotal.Wt += el?.Wt;
            metalTotal.Amount += el?.Amount;
            if (!detailtPrintR) {
              summary.gold24Kt += el?.FineWt;
            }
            totals.metalWt += el?.Wt;
            totals.metalAmount += el?.Amount;
            summary.metalAmount += el?.Amount;
          }
          if (el?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStoneArr.push(el);
            colorStonesTotal.Pcs += el?.Pcs;
            colorStonesTotal.Wt += el?.Wt;
            colorStonesTotal.Amount += el?.Amount;
            totals.colorStonePcs += el?.Pcs;
            totals.colorStoneWt += el?.Wt;
            totals.colorStoneAmount += el?.Amount;
            summary.stoneWt += el?.Wt;
            summary.stonePcs += el?.Pcs;
            summary.colorStoneAmount += el?.Amount;
          }
          obj.SettingAmount += el?.SettingAmount;
          summary.makingAmount += el?.SettingAmount;
        }
      })

      metalTotal.Wt += e?.DiamondCTWwithLoss / 5;
      totals.metalWt += e?.DiamondCTWwithLoss / 5;
      // discountTotalAmount = e?.TotalAmount - e?.DiscountAmt;
      discountTotalAmount = e?.TotalAmount;
      summary.grossWt += e?.grosswt;
      summary.gDWt += e?.MetalDiaWt + (e?.DiamondCTWwithLoss / 5);
      summary.netWt += e?.NetWt;
      summary.makingAmount += e?.MakingAmount;
      // summary.otherCharges += e?.OtherCharges;
      summary.otherCharges += totalOther;
      obj.diamonds = diamondArr;
      obj.metals = metalArr;
      obj.colorStones = colorStoneArr;
      obj.diamondsTotal = diamondsTotal;
      obj.metalTotal = metalTotal;
      obj.colorStonesTotal = colorStonesTotal;
      obj.discountTotalAmount = discountTotalAmount;
      obj.totalAmounts = totalAmounts;
      totals.totalAmount += e?.TotalAmount;
      totals.discountTotalAmount += obj?.DiscountAmt;
      totals.withoutDiscountTotalAmount += e?.TotalAmount;
      totals.netWt += e?.NetWt+e?.LossWt;
      resultArr.push(obj);
      // setDiamondDetails(diamondDetails);
    });
    summary.addLess = hr?.AddLess;
    summary.total = summary?.metalAmount + summary?.diamondAmount + summary?.colorStoneAmount + summary?.makingAmount + summary?.otherCharges + summary?.addLess;
    totals.cgstAmount = (totals?.withoutDiscountTotalAmount * hr?.CGST) / 100;
    totals.sgstAmount = (totals?.withoutDiscountTotalAmount * hr?.SGST) / 100;
    let taxValue = taxGenrator(hr, totals?.totalAmount);
    setTaxes(taxValue);
    taxValue?.length > 0 && taxValue.forEach((e, i) => {
      totals.withDiscountTaxAmount += +(e?.amount);
    });
    totals.withDiscountTaxAmount += hr?.AddLess + totals?.totalAmount;
    setSummary(summary);
    setTotal(totals);
    return resultArr;
  }
  const d = json1Data2?.reduce((grouped, ee) => {
    if (ee?.MasterManagement_DiamondStoneTypeid === 1 && ee?.ShapeName === "Round") {
      const key = `${ee?.ShapeName} ${ee?.QualityName} ${ee?.Colorname}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(ee);
    }
    return grouped;
  }, {});

  const er = json1Data2?.reduce((grouped, ei) => {
    if (ei?.MasterManagement_DiamondStoneTypeid === 1 && ei?.ShapeName !== "Round") {
      const key = `${ei?.ShapeName} ${ei?.QualityName} ${ei?.Colorname}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(ei);
    }
    return grouped;
  }, {});

  const calculatedData = [];
  const calData = [];

  for (const key in d) {
    if (d.hasOwnProperty(key)) {
      const group = d[key];

      const totalPcs = group?.reduce((sum, item) => sum + item.Pcs, 0);
      const totalWt = group?.reduce((sum, item) => sum + item.Wt, 0);

      calculatedData.push({
        ShapeName: key,
        totalPcs,
        totalWt,
      });
    }
  }
  for (const key in er) {
    if (er.hasOwnProperty(key)) {
      const group = er[key];

      const totalPcs = group.reduce((sum, item) => sum + item.Pcs, 0);
      const totalWt = group.reduce((sum, item) => sum + item.Wt, 0);

      calData.push({
        ShapeName: key,
        totalPcs,
        totalWt,
      });
    }
  }
  let totalPcs1 = 0;
  let totalWt1 = 0;

  for (const obj of calData) {
    totalPcs1 += obj.totalPcs;
    totalWt1 += obj.totalWt;
  }
  let other = {
    ShapeName: "OTHER",
    totalPcs: totalPcs1,
    totalWt: totalWt1,
  };

  calculatedData.push(other);


  return (
    <>{loader ? <Loader /> : msg === "" ?
      <div className="container containerDetailPrint1 pt-4 ">
        <div className="pad_60_allPrint">
          {/* buttons */}
          <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
          <div className="form-check d-flex align-items-center">
              <input className="border-dark me-2" type="checkbox" checked={checkBox?.brokarage} onChange={e => handleChange(e)} name='brokarage'/>
              <label className="">
                With Brokarage
              </label>
            </div>
            <div className="form-check d-flex align-items-center">
              <input className="border-dark me-2" type="checkbox" checked={checkBox?.image} onChange={e => handleChange(e)} name='image'/>
              <label className="">
                With Image
              </label>
            </div>
            <div className="form-check">
              <input type="button" className="btn_white blue mt-0" value="Print" onClick={(e) => handlePrint(e)} />
            </div>
          </div>
          {/* header line*/}
          <div className="jewelleryPackingList mb-2 mt-2 recordDetailPrint1">
            <h1 className='fs-4 p-2 fw-bold text-white'>{json0Data?.PrintHeadLabel}</h1>
          </div>
          {/* header */}
          <div className="d-flex align-items-center pb-2 border-bottom  recordDetailPrint1">
            <div className="col-6">
              <h2 className='fw-bold fs-5'>{json0Data?.CompanyFullName}</h2>
              <p className='lhDetailPrint1'>{json0Data?.CompanyAddress}</p>
              <p className='lhDetailPrint1'>{json0Data?.CompanyAddress2}</p>
              <p className='lhDetailPrint1'>{json0Data?.CompanyCity}-{json0Data?.CompanyPinCode}, {json0Data?.CompanyState}({json0Data?.CompanyCountry})</p>
              <p className='lhDetailPrint1'>T {json0Data?.CompanyTellNo}</p>
              <p className='lhDetailPrint1'>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
              <p className='lhDetailPrint1'>{json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
            </div>
            <div className="col-6">
              <img src={json0Data?.PrintLogo} alt="" className='w-25 d-block ms-auto' />
            </div>
          </div>

          {/* address */}
          <div className="d-flex border-start border-end  border-bottom mb-1 recordDetailPrint1">
            <div className="col-4 border-end  p-1">
              <p className='lhDetailPrint1'>{json0Data?.lblBillTo}</p>
              <p className='lhDetailPrint1 fw-bold'>{json0Data?.customerfirmname}</p>
              <p className='lhDetailPrint1'>{json0Data?.customerAddress2}</p>
              <p className='lhDetailPrint1'>{json0Data?.customerAddress1}</p>
              <p className='lhDetailPrint1'>{json0Data?.customerAddress3}</p>
              <p className='lhDetailPrint1'>{json0Data?.customercity}-{json0Data?.customerpincode}</p>
              <p className='lhDetailPrint1'>{json0Data?.customeremail1}</p>
              <p className='lhDetailPrint1'>{json0Data?.vat_cst_pan}</p>
              <p className='lhDetailPrint1'>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
            </div>
            <div className="col-4 border-end  p-1">
              <p className='lhDetailPrint1'>Ship To,</p>
              <p className='lhDetailPrint1 fw-bold'>{json0Data?.customerfirmname}</p>
              <p className='lhDetailPrint1'>{json0Data?.CustName}</p>
              <p className='lhDetailPrint1'>{json0Data?.customerstreet}</p>
              <p className='lhDetailPrint1'>{json0Data?.customercity} {json0Data?.State}</p>
              <p className='lhDetailPrint1'>{json0Data?.CompanyCountry}-{json0Data?.PinCode}</p>
              <p className='lhDetailPrint1'>Mobile No : {json0Data?.customermobileno}</p>
            </div>
            <div className="col-4 p-1">
              <div className="d-flex">
                <p className='fw-bold col-2 me-2'>BILL NO </p>
                <p className='col-10'>{json0Data?.InvoiceNo}</p>
              </div>
              <div className="d-flex">
                <p className='fw-bold col-2 me-2'>DATE </p>
                <p className='col-10'>{json0Data?.EntryDate}</p>
              </div>
              <div className="d-flex">
                <p className='fw-bold col-2 me-2'>HSN </p>
                <p className='col-10'>{json0Data?.HSN_No}</p>
              </div>
            </div>
          </div>
          {/* table header*/}
          <div className="d-flex w-100 border-top  recordDetailPrint1 lightGrey">
            <div className="srNoDetailprint11 border-end border-start  border-bottom d-flex justify-content-center align-items-center flex-column">
              <p className='fw-bold'>Sr. </p>
              <p className='fw-bold'>No. </p>
            </div>
            <div className="designDetalPrint1 border-end  p-1 border-bottom d-flex justify-content-center align-items-center">
              <p className='fw-bold p-1'>Design</p>
            </div>
            <div className="diamondDetailPrint1 border-end ">
              <div className="d-grid h-100">
                <div className='d-flex justify-content-center border-bottom '>
                  <p className='fw-bold p-1'>Diamond</p>
                </div>
                <div className='d-flex border-bottom '>
                  <p className='fw-bold col-3 d-flex align-items-center justify-content-center border-end '>Code</p>
                  <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end '>Size</p>
                  <p className='fw-bold col-1 d-flex align-items-center justify-content-center border-end '>Pcs</p>
                  <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end '>Wt</p>
                  <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end '>Rate</p>
                  <p className='fw-bold col-2 d-flex align-items-center justify-content-center text-center'>Amount</p>
                </div>
              </div>
            </div>
            <div className="metalGoldDetailPrint1 border-end ">
              <div className="d-grid h-100">
                <div className='d-flex justify-content-center align-items-center border-bottom '>
                  <p className='fw-bold p-1'>Metal  </p>
                </div>
                <div className='d-flex border-bottom '>
                  <p className='fw-bold col-3 border-end  d-flex align-items-center justify-content-center'>Quality</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>*Wt</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>N+L</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>Rate</p>
                  <p className='fw-bold col-3 d-flex align-items-center justify-content-center'>Amount</p>
                </div>
              </div>
            </div>
            <div className="stoneDetailsPrint1 border-end ">
              <div className="d-grid h-100">
                <div className='d-flex justify-content-center border-bottom '>
                  <p className='fw-bold p-1'>Stone</p>
                </div>
                <div className='d-flex border-bottom '>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>Code</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>Size</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>Pcs</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>Wt</p>
                  <p className='fw-bold col-2 border-end  d-flex align-items-center justify-content-center'>Rate</p>
                  <p className='fw-bold col-2 d-flex align-items-center justify-content-center text-center'>Amount</p>
                </div>
              </div>
            </div>
            <div className="otherAmountDetailPrint1 border-end  border-bottom d-flex align-items-center justify-content-center flex-column">
              <p className='fw-bold text-center d-flex align-items-center justify-content-center'>Other Amount</p>
            </div>
            <div className="labourAmountDetailPrint1 border-end  border-bottom">
              <div className="d-grid h-100">
                <div className='border-bottom  d-flex align-items-center justify-content-center'><p className='text-center fw-bold'>Labour</p></div>
                <div className='d-flex'>
                  <div className="col-5 border-end  d-flex align-items-center justify-content-center"><p className='fw-bold '>Rate</p></div>
                  <div className="col-7 d-flex align-items-center justify-content-center"><p className='fw-bold text-end '>Amount</p></div>
                </div>
              </div>
            </div>
            <div className="totalAmountDetailPrint1 border-end  border-bottom d-flex align-items-center justify-content-center flex-column">
              <p className='text-center fw-bold '>Total</p>
              <p className='text-center fw-bold '>Amount</p>
            </div>
          </div>
          {/* data */}
          {json1Data?.length > 0 && json1Data?.map((e, i) => {
            return <div key={i} className='recordDetailPrint1'>
              <div className="d-flex w-100">
                <div className="srNoDetailprint11 border-end border-start border-bottom pt-1">
                  <p className='p-1'>{e?.SrNo}</p>
                </div>
                <div className="designDetalPrint1 border-end  p-1 border-bottom pt-1">
                  <div className="d-flex">
                    <div className='col'>
                      <p>{e?.designno}</p>
                    </div>
                    <div className='col d-flex flex-wrap'>
                      <p>{e?.SrJobno}</p>
                      <p>{e?.MetalColor}</p>
                    </div>
                  </div>
                  <div>
                    {checkBox?.image && <img src={e?.DesignImage} alt="" className='w-100 d-block' onError={handleImageError} />}
                  </div>
                  <div className={`${!image && 'pt-2 '}`}>
                    {e?.lineid !== "" && <p className='text-center'>Lineid - {e?.lineid}</p>}
                    {e?.HUID !== "" && <p className='text-center'>HUID - {e?.HUID}</p>}
                    {(e?.PO !== "" && e?.PO !== "-") && <p className='text-center'>PO: {e?.PO}</p>}
                    <p className='text-center'>Tunch : <span className="fw-bold">{NumberWithCommas(e?.Tunch, 3)}</span></p>
                    <p className='text-center'>Gross Wt: <span className="fw-bold">{fixedValues(e?.grosswt, 3)}</span></p>
                    {e?.Size !== "" && e?.Size !== "-" && <p className='text-center'>Size: {e?.Size}</p>}
                  </div>
                </div>
                <div className="diamondDetailPrint1 border-end  position-relative pt-1">
                  <div className="h-100 paddingBottomTotalDetailPrint1">
                    {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                      return <div className={`d-flex justify-content-between `} key={ind}>
                        <p className='col-3'>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                        <p className='col-2 text-center '>{ele?.SizeName}</p>
                        <p className='col-1   text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p>
                        <p className='col-2   text-end'>{fixedValues(ele?.Wt, 3)}</p>
                        <p className='col-2   text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                        <p className='col-2 text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                      </div>
                    })}
                    <div className='d-flex border-bottom position-absolute bottom-0 w-100  border-top totalMinHeightDetailPrint1 lightGrey'>
                      <p className='col-2 '></p>
                      <p className='col-2 '></p>
                      <p className='col-2 text-end fw-bold'>{e?.diamondsTotal?.Pcs !== 0 && NumberWithCommas(e?.diamondsTotal?.Pcs)}</p>
                      <p className='col-2 text-end fw-bold'>{e?.diamondsTotal?.Wt !== 0 && fixedValues(e?.diamondsTotal?.Wt, 3)}</p>
                      <p className='col-2 text-end fw-bold'></p>
                      <p className='col-2 text-end fw-bold'>{e?.diamondsTotal?.Amount !== 0 && NumberWithCommas(e?.diamondsTotal?.Amount, 2)}</p>
                    </div>
                  </div>
                </div>
                <div className="metalGoldDetailPrint1 border-end  position-relative pt-1">
                  <div className="h-100 paddingBottomTotalDetailPrint1">
                    {e?.metals.length > 0 && e?.metals.map((ele, ind) => {
                      return <div className={`d-flex`} key={ind}>
                        <p className='col-3 '>{ele?.ShapeName + " " + ele?.QualityName}</p>
                        <p className='col-2  text-end'>{fixedValues(ele?.Wt + (e?.DiamondCTWwithLoss / 5), 3)}</p>
                        <p className='col-2  text-end'>{fixedValues(e?.NetWt+e?.LossWt, 3)}</p>
                        <p className='col-2  text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                        <p className='col-3  text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                      </div>
                    })}
                    <div className='d-flex position-absolute bottom-0 w-100  totalMinHeightDetailPrint1 border-top border-bottom lightGrey'>
                      <p className='col-3 '></p>
                      <p className='col-2 text-end fw-bold'>{e?.metalTotal?.Wt !== 0 && fixedValues(e?.metalTotal?.Wt, 3)}</p>
                      <p className='col-2 text-end fw-bold'>{e?.NetWt !== 0 && fixedValues(e?.NetWt+e?.LossWt, 3)}</p>
                      <p className='col-2 text-end'></p>
                      <p className='col-3 text-end fw-bold'>{e?.metalTotal.Amount !== 0 && NumberWithCommas(e?.metalTotal.Amount, 2)}</p>
                    </div>
                  </div>
                </div>
                <div className="stoneDetailsPrint1 border-end  position-relative pt-1">
                  <div className="h-100 paddingBottomTotalDetailPrint1">
                    {e?.colorStones.length > 0 && e?.colorStones.map((ele, ind) => {
                      return <div className={`d-flex`} key={ind}>
                        <p className='col-3 '>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                        <p className='col-2 text-center '>{ele?.SizeName}</p>
                        <p className='col-1  text-end'>{NumberWithCommas(ele?.Pcs, 0)}</p>
                        <p className='col-2  text-end'>{fixedValues(ele?.Wt, 3)}</p>
                        <p className='col-2  text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                        <p className='col-2 text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                      </div>
                    })}
                    <div className='d-flex border-bottom position-absolute bottom-0 w-100  border-top totalMinHeightDetailPrint1 lightGrey'>
                      <p className=' col-2 '></p>
                      <p className=' col-2 '></p>
                      <p className=' col-2 text-end fw-bold'>{e?.colorStonesTotal?.Pcs !== 0 && e?.colorStonesTotal?.Pcs}</p>
                      <p className=' col-2 text-end fw-bold'>{e?.colorStonesTotal?.Wt !== 0 && fixedValues(e?.colorStonesTotal?.Wt, 3)}</p>
                      <p className=' col-2 text-end'></p>
                      <p className=' col-2 text-end fw-bold'>{e?.colorStonesTotal?.Amount !== 0 && NumberWithCommas(e?.colorStonesTotal?.Amount, 2)}</p>
                    </div>
                  </div>
                </div>
                <div className="otherAmountDetailPrint1 border-end  position-relative pt-1">
                  <div className="paddingBottomTotalDetailPrint1">
                    <div>
                      {detailtPrintR ? <p className='text-end'>{e?.OtherCharges !== 0 && NumberWithCommas(e?.OtherCharges, 2)}</p> : <>
                        {e?.OtherAmountDetail?.length > 0 && e?.OtherAmountDetail?.map((ele, ind) => {
                          return (
                            <div className='d-flex justify-content-between' style={{ fontSize: "10.5px" }} key={ind}><p>{ele?.label}</p><p>{ele?.value}</p></div>
                          )
                        })}
                      </>}

                    </div>
                  </div>
                  <div className="position-absolute bottom-0 w-100 border-top border-bottom  totalMinHeightDetailPrint1 lightGrey">
                    <p className='text-end fw-bold'>{e?.totalOther !== 0 && NumberWithCommas(e?.totalOther, 2)}</p>
                  </div>
                </div>
                <div className="labourAmountDetailPrint1 border-end  position-relative pt-1">
                  <div className="d-grid h-100 paddingBottomTotalDetailPrint1">
                    <div className='d-flex '>
                      <div className="col-5 "><p className='text-end'>{e?.MaKingCharge_Unit !== 0 && NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                      <div className="col-7"><p className='text-end text-end'>{(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost) !== 0 && NumberWithCommas(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost, 2)}</p></div>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 w-100 border-bottom  border-top totalMinHeightDetailPrint1 d-flex lightGrey">
                    <div className="col-5"><p className='text-end fw-bold'>{e?.MaKingCharge_Unit !== 0 && NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                    <div className="col-7"><p className='text-end fw-bold'>{(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost) !== 0 && NumberWithCommas(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost, 2)}</p></div>
                  </div>
                </div>
                <div className="totalAmountDetailPrint1 border-end  position-relative pt-1">
                  <div className="d-grid h-100 paddingBottomTotalDetailPrint1">
                    <div>
                      <p className='text-end'>{e?.totalAmounts !== 0 && NumberWithCommas(e?.totalAmounts, 2)}</p>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 w-100 border-top border-bottom  totalMinHeightDetailPrint1 lightGrey">
                    <p className='text-end fw-bold'>{e?.totalAmounts !== 0 && NumberWithCommas(e?.totalAmounts, 2)}</p>
                  </div>
                </div>
              </div>
              <div className="d-flex w-100">
                <div className="srNoDetailprint11 border-end border-start  border-bottom">
                  <p className=' p-1'></p>
                </div>
                <div className="designDetalPrint1 border-end  p-1 border-bottom">
                </div>
                <div className="diamondDetailPrint1 border-end  position-relative border-bottom">
                  <div className="d-grid">
                  </div>
                </div>
                <div className="metalGoldDetailPrint1 border-end  position-relative border-bottom">
                </div>
                <div className="stoneDetailsPrint1 border-end position-relative border-bottom pt-1 lightGrey">
                  <div className="d-grid">
                   {e?.Discount !== 0 && <p className='p-1 text-end fw-bold'>Discount {e?.Discount !== 0 && NumberWithCommas(e?.Discount, 2)}% @Total Amount</p>}
                  </div>
                </div>
                <div className="otherAmountDetailPrint1 border-end  border-bottom">
                  <p className='d-flex align-items-center justify-content-end'></p>
                </div>
                <div className="labourAmountDetailPrint1 border-end  lightGrey border-bottom pt-1">
                  <div className="d-grid h-100">
                    <div className='d-flex'>
                      <div className="col-5"><p className=' p-1 text-end'></p></div>
                      <div className="col-7 fw-bold"><p className=' text-end'>{e?.DiscountAmt !== 0 && NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                    </div>
                  </div>
                </div>
                <div className="totalAmountDetailPrint1 border-end  border-bottom d-flex align-tems-center justify-content-end lightGrey">
                  <p className='d-flex align-items-center'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span> <span className='fw-bold'>{e?.discountTotalAmount !== 0 && (e?.discountTotalAmount).toFixed(2)}</span></p>
                </div>
              </div>
            </div>
          })}
          {/* cgst */}
          <div className="d-flex w-100 border-bottom  border-start recordDetailPrint1">
            <div className="cgstDetailPrint1 text-end border-end  ">
              <p>Total Discount</p>
              {taxes.length > 0 && taxes.map((e, i) => {
                return <p key={i}>{e?.name} @ {e?.per}</p>
              })}
              {json0Data?.AddLess !== 0 && <p>{json0Data?.AddLess < 0 ? "Less" : "Add"}</p>}
            </div>
            <div className="cgstTotalDetailPrint1 text-end border-end  ">
              <p>{(total?.discountTotalAmount).toFixed(2)}</p>
              {taxes.length > 0 && taxes.map((e, i) => {
                return <p key={i}>{NumberWithCommas(e?.amount, 2)}</p>
              })}
              {/* {console.log(json0Data)} */}
              {json0Data?.AddLess !== 0 && <p>{json0Data?.AddLess}</p>}
            </div>
          </div>
          {/* total */}
          <div className="d-flex w-100 recordDetailPrint1 lightGrey">
            <div className="designDetalPrint1Total border-end  border-bottom border-start d-table">
              <p className='fw-bold text-center d-table-cell align-middle'>Total</p>
            </div>
            <div className="diamondDetailPrint1 border-end  position-relative border-bottom d-flex flex-column justify-content-center">
              <div className='d-flex'>
                <div className=' col-3'><p className=''></p></div>
                <div className=' col-2'><p className=''></p></div>
                <div className=' col-2 text-end fw-bold'><p className=''>{NumberWithCommas(total?.diamondPcs, 0)}</p></div>
                <div className=' col-2 text-end'><p className='fw-bold'>{fixedValues(total?.diamondWt, 3)}</p></div>
                <div className=' col-1 text-end'><p className=''></p></div>
                <div className=' col-2 text-end'><p className='fw-bold'>{NumberWithCommas(total?.diamondAmount, 2)}</p></div>
              </div>
            </div>
            <div className="metalTotalDetailPrint1 border-end  position-relative border-bottom d-flex flex-column justify-content-center">
              <div className='d-flex'>
                <div className='col-3'><p className=''></p></div>
                <div className='col-2'><p className='fw-bold'>{fixedValues(total?.metalWt, 3)}</p></div>
                <div className='col-2 text-end'><p className='fw-bold'>{fixedValues(total?.netWt, 3)}</p></div>
                <div className='col-2 text-end'><p className=''></p></div>
                <div className='col-3 text-end'><p className='fw-bold'>{NumberWithCommas(total?.metalAmount, 2)}</p></div>
              </div>
            </div>
            <div className="stoneDetailsPrint1 border-end  position-relative border-bottom d-flex flex-column justify-content-center">
              <div className='d-flex'>
                <div className='col-2'><p className=''></p></div>
                <div className='col-2'><p className=''></p></div>
                <div className='col-2 text-end d-flex justify-content-end align-items-center h-100 '><p className='fw-bold'>{NumberWithCommas(total?.colorStonePcs, 0)}</p></div>
                <div className='col-2 text-end d-flex justify-content-end align-items-center h-100 '><p className='fw-bold'>{fixedValues(total?.colorStoneWt, 3)}</p></div>
                <div className='col-2 text-end d-flex justify-content-end align-items-center h-100 '><p className='fw-bold'></p></div>
                <div className='col-2 text-end d-flex justify-content-end align-items-center h-100 '><p className='fw-bold'>{NumberWithCommas(total?.colorStoneAmount, 2)}</p></div>
              </div>
            </div>
            <div className="otherAmountDetailPrint1 border-end  border-bottom d-table">
              <p className='p-1 d-flex align-items-center justify-content-end d-table-cell align-middle fw-bold'>{NumberWithCommas(summary?.otherCharges, 2)}</p>
            </div>
            <div className="labourAmountDetailPrint1 border-end  border-bottom">
              <div className="d-grid h-100">
                <div className='d-flex justify-content-end'>
                  <div className="d-table"><p className='d-table-cell align-middle text-end h-100 text-end fw-bold'>{NumberWithCommas(total?.labourAmount, 2)}</p></div>
                </div>
              </div>
            </div>
            <div className="totalAmountDetailPrint1 border-end  border-bottom ">
              <p className='d-flex justify-content-end align-items-center h-100 text-end fw-bold'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{(total?.withDiscountTaxAmount).toFixed(2)}</p>
            </div>
          </div>
          {/* summary */}
          <div className="d-flex w-100 pt-1 recordDetailPrint1">
            <div className="col-4 pe-1">
              <p className='border-start  fw-bold text-center border-bottom  w-100 border-end border-top lightGrey'>SUMMARY</p>
              <div className="d-flex border-end ">
                <div className="border-start col-6 border-end  position-relative summaryPadBotDetailPrint1 d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>GOLD IN 24KT</p>
                    <p className='p-1'> {fixedValues(summary?.gold24Kt, 3)} gm</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>GROSS WT</p>
                    <p className='p-1'> {fixedValues(summary?.grossWt, 3)} gm</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>*(G+D) WT</p>
                    {/* <p className='p-1'> {fixedValues(summary?.gDWt, 3)} gm</p> */}
                    <p className='p-1'> {fixedValues(summary?.gDWt, 3)} gm</p>


                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>NET WT</p>
                    <p className='p-1'> {fixedValues(summary?.netWt, 3)} gm</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>DIAMOND WT</p>
                    <p className='p-1'> {NumberWithCommas(summary?.diamondpcs, 0)} / {fixedValues(summary?.diamondWt, 3)} cts</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>STONE WT</p>
                    <p className='p-1'> {NumberWithCommas(summary?.stonePcs, 0)} / {fixedValues(summary?.stoneWt, 3)} cts</p>
                  </div>
                  <div className="d-flex justify-content-between border-top  position-absolute w-100 border-bottom bottom-0 totalLineDetailPrint1 lightGrey">
                    <p className='fw-bold p-1'></p>
                    <p className='p-1'></p>
                  </div>
                </div>
                <div className="col-6 position-relative summaryPadBotDetailPrint1  d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>GOLD</p>
                    <p className='p-1'> {NumberWithCommas(summary?.metalAmount, 2)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>DIAMOND</p>
                    <p className='p-1'> {NumberWithCommas(summary?.diamondAmount, 2)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>CST</p>
                    <p className='p-1'>{NumberWithCommas(summary?.colorStoneAmount, 2)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>MAKING</p>
                    <p className='p-1'> {NumberWithCommas(summary?.makingAmount, 2)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>OTHER</p>
                    <p className='p-1'> {NumberWithCommas(summary?.otherCharges, 2)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className='fw-bold p-1'>LESS</p>
                    <p className='p-1'> {NumberWithCommas(summary?.addLess, 2)}</p>
                  </div>
                  <div className="d-flex justify-content-between border-top  position-absolute w-100 border-bottom  bottom-0 totalLineDetailPrint1 lightGrey">
                    <p className='fw-bold p-1'>TOTAL</p>
                    <p className='p-1 fw-bold'>{NumberWithCommas(total?.withDiscountTaxAmount, 2)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-2  summaryPadBotDetailPrint1 pe-1">
              <div className='border-end  border-start border-top'>
                <p className='fw-bold text-center border-bottom  w-100 lightGrey'>Diamond Detail</p>
                {calculatedData?.length > 0 && calculatedData?.map((e, i) => {
                  return (
                    <React.Fragment key={i}>
                      {
                        (e?.ShapeName === "OTHER" && e?.totalPcs === 0 && e?.totalWt === 0) ? ''
                          :
                          <div className='d-flex justify-content-between ps-1 pe-1 align-items-center'>
                            <p className='fw-bold'>{e?.ShapeName}</p>
                            <p>{e?.totalPcs}/{e?.totalWt?.toFixed(3)}</p>
                          </div>
                      }

                    </React.Fragment>
                  )

                })}
                <div className="d-flex justify-content-between border-top  w-100 border-bottom totalLineDetailPrint1 lightGrey">
                  <p className='fw-bold p-1'></p>
                  <p className='p-1'></p>
                </div>
              </div>
            </div>
            <div className="col-2 pe-1">
              <div className="border-bottom  border-top">
                <p className='fw-bold text-center border-start border-end border-bottom  w-100 border-start lightGrey'>OTHER DETAILS</p>
                {checkBox?.brokarage &&( brokarage.length > 0 && brokarage.map((e, i) => {
                  return <div className="d-flex border-start border-end " key={i}>
                    <div className="col-6"><p className='fw-bold p-1'>{e?.label}</p></div>
                    <div className="col-6"><p className="text-end p-1">{e?.value}</p></div>
                  </div>
                }))}
                <div className="d-flex border-start border-end ">
                  <div className="col-6"><p className='fw-bold p-1'>RATE IN 24KT</p></div>
                  <div className="col-6"><p className="text-end p-1">{NumberWithCommas(json0Data?.MetalRate24K, 2)}</p></div>
                </div>
              </div>
            </div>
            <div className="col-2 pe-1">
              <div className="border  border-top">
                <p className='fw-bold text-center border-start border-bottom  w-100 border-start lightGrey'>REMARK</p>
                <p dangerouslySetInnerHTML={{ __html: json0Data?.PrintRemark }} className='pb-3 pt-1 ps-1 pe-1'></p>
              </div>
            </div>
            <div className="col-2">
              <div className="d-flex  border-start border-end border-bottom createdByDetailPrint1 border-top">
                <div className="col-6 border-end  d-flex align-items-end justify-content-center">Created By</div>
                <div className="col-6 d-flex align-items-end justify-content-center">Checked By</div>
              </div>
            </div>
          </div>
        </div> </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
  )
}

export default DetailPrint1