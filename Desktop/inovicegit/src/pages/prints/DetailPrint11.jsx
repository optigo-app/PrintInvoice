import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/detailPrint11.css";
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const DetailPrint11 = ({ urls, token, invoiceNo, printName, evn }) => {

  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [diamondSize, setDiamondSize] = useState(true);
  const [image, setImage] = useState(true);
  const [setting, setSetting] = useState(true);
  const [tunch, setTunch] = useState(true);
  const [msg, setMsg] = useState("");
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
    setJson0Data(data.BillPrint_Json[0]);
    let resultAr = [];
    let totals = { ...total };
    let summaries = { ...summary };
    data?.BillPrint_Json1.forEach((e, i) => {
      let elementsArr = [];
      let obj = { ...e };
      obj.alloy = 0;
      obj.totalGold = 0;
      obj.puregoldWeightWithLoss = obj?.NetWt + obj?.LossWt;
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          obj.puregoldWeightWithLoss += ele?.FineWt;
          if (ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2) {
            elementsArr.push(ele);
            totals.pcs += ele?.Pcs;
            totals.diaWt += ele?.Wt;
            totals.diaAmount += ele?.Amount;
            totals.totalAmount += ele?.SettingAmount;
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              summaries.diamondWt += ele?.Wt;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              summaries.stoneWt += ele?.Wt;
            }
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            obj.alloy += ele?.Amount;
            obj.totalGold += ele?.Amount;
            totals.totalGold += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            obj.totalGold += ele?.Amount;
            totals.totalGold += ele?.Amount;
            if (ele?.QualityName === "14K") {
              summaries.gold14k += ele?.Wt;
            } else if (ele?.QualityName === "18K") {
              summaries.gold18k += ele?.Wt;
            }
          }
        }
      });
      summaries.grossWt += e?.grosswt
      totals.totalLabour += e?.MakingAmount;
      totals.totalJewelleryAmount += e?.TotalAmount;
      obj.materials = elementsArr;
      resultAr.push(obj);
    });
    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.totalJewelleryAmount);
    taxValue.length > 0 && taxValue.forEach((e, i) => {
      totals.grandTotal += +e?.amount;
    });
    totals.grandTotal += data?.BillPrint_Json[0]?.AddLess + totals?.totalJewelleryAmount;
    setTaxes(taxValue);
    setSummary(summaries);
    setTotal(totals);
    setJson1Data(resultAr);
    setLoader(false);
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
  // const handleChange = (e, name) => {

  // }

  return (
    loader ? <Loader /> : msg === "" ? <div className='container containerDetailP11 mt-5'>
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4">
        <div className="form-check pe-3">
          <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => setImage(!image)} />
          <label className="form-check-label pt-1">
            With Image
          </label>
        </div>
        <div className="form-check pe-3">
          <input className="form-check-input border-dark" type="checkbox" checked={diamondSize} onChange={e => setDiamondSize(!diamondSize)} />
          <label className="form-check-label pt-1">
            Diamond Size
          </label>
        </div>
        <div className="form-check pe-3">
          <input className="form-check-input border-dark" type="checkbox" checked={setting} onChange={e => setSetting(!setting)} />
          <label className="form-check-label pt-1">
            Setting Label and Price
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input border-dark" type="checkbox" checked={tunch} onChange={e => setTunch(!tunch)} />
          <label className="form-check-label pt-1">
            Tunch
          </label>
        </div>
        <div className="form-check ps-3">
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* company with logo detail  */}
      <div className="headerDetailp11 border-start border-end border-top d-flex justify-content-between align-items-center">
        <div className='px-1 py-2'>
          <p>{json0Data?.CompanyFullName}</p>
          <p>{json0Data?.CompanyAddress}</p>
          <p>{json0Data?.CompanyAddress2}</p>
          <p>{json0Data?.CompanyCity} {json0Data?.CompanyPinCode} {json0Data?.CompanyState} {json0Data?.CompanyCountry}</p>
          <p>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
          <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>

        </div>
        <div className='px-1 py-2'>
          <img src={json0Data?.PrintLogo} alt="" className='w-25 h-auto ms-auto d-block' onError={handleImageError} />
        </div>
      </div>
      {/* address */}
      <div className="border px-1 py-2 d-flex justify-content-between border-2">
        <div className="w-50">
          <p className='pt-4'> {json0Data?.lblBillTo}</p>
          <p> {json0Data?.customerfirmname}</p>
          <p> {json0Data?.customerAddress1}</p>
          <p> {json0Data?.customerAddress2}</p>
          <p> {json0Data?.customerAddress3}</p>
          <p> {json0Data?.customercity}, {json0Data?.State}-{json0Data?.PinCode}</p>
          <p> Tel: {json0Data?.customermobileno}</p>
          <p> {json0Data?.customeremail1}</p>

        </div>
        <div className="w-50 text-end">
          <p>invoice#:{json0Data?.InvoiceNo}</p>
          <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}: {json0Data?.Company_CST_STATE_No} </p>
          <p>Terms: 100 Days</p>
          <p>Due Date: 26 Nov 2023</p>
        </div>
      </div>
      {/* table heading */}
      <div className="d-flex w-100 border-top border-bottom mt-1 border-start border-end border-2">
        <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center flex-column"><p>Sr.</p><p>No.</p></div>
        <div className="designDetailPrint11 border-end d-flex align-items-center justify-content-center"><p className='p-1'>Design Detail</p></div>
        <div className="diamondStoneDetailPrint11 d-grid">
          <div className='border-bottom border-end d-flex justify-content-center align-items-center'> <p className='p-1 text-center fw-bold'>Diamond & Stone Detail</p> </div>
          <div className='d-flex'>
            <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Shape</p></div>
            <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Size(mm)</p></div>
            <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Pcs</p></div>
            <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'>DIA</p><p className="p-1"> WT.</p></div>
            <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'>Price  </p><p>/ cts</p></div>
            <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'>Dia</p><p className="text-center"> Amount</p></div>
            <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>"Setting </p><p>Type"</p></div>
            <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>Setting </p><p className="text-center">Price</p></div>
            <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>Total</p><p className="text-center"> Amount</p></div>
          </div>
        </div>
        <div className="goldDetailPrint11 border-end d-grid">
          <div className="border-bottom d-flex">
            <p className='p-1 d-flex justify-content-center align-items-center w-100 fw-bold'>Gold</p>
          </div>
          <div className='d-flex'>
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Quality</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>18KWG</p></div>
          </div>
        </div>
        <div className="labourDetailPrint11 border-end d-grid">
          <div className="border-bottom d-flex">
            <p className='p-1 d-flex justify-content-center align-items-center w-100 fw-bold'>Labour</p>
          </div>
          <div className='d-flex'>
            <div className='col-6 border-end d-flex align-items-center justify-content-center p-1'><p className='text-center'>Other Charges</p></div>
            <div className='col-6 d-flex align-items-center justify-content-center p-1'>
              <p className='text-center'>Labour Amount</p>
            </div>
          </div></div>
        <div className="totalAmountJewelleryDetailPrint11 d-flex align-items-center justify-content-center totalAmountDetailPrint11Jewellery p-1 flex-column"><p className='text-center pb-1'>Total </p><p className="text-center pb-1">Jewellery</p><p className="text-center">Amount</p></div>
      </div>
      {/* data */}
      {json1Data.length > 0 && json1Data.map((e, i) => {
        return <div className="d-flex w-100 border-bottom border-start border-end border-2 no_break" key={i}>
          <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center"><p>{e?.SrNo}</p></div>
          <div className="designDetailPrint11 border-end">
            <div className="d-flex justify-content-between p-1">
              <div><p>{e?.designno}</p></div>
              <div> <p>{e?.SrJobno}</p> <p>{e?.MetalColor}</p> </div>
            </div>
            {image && <img src={e?.DesignImage} alt="" className='w-100 p-1' onError={handleImageError} />}
            {tunch && <p className='text-center fw-bold'>Tunch: {NumberWithCommas(e?.Tunch, 3)}</p>}
            <p className='text-center fw-bold'>{fixedValues(e?.grosswt, 3)}gm Gross</p>
            <p className='text-center pb-1'>Size {e?.Size}</p>
          </div>
          <div className="diamondStoneDetailPrint11 d-grid pad_bt_20semiTotalDetailPrint11 position-relative">
            {e?.materials.length > 0 ? e?.materials.map((ele, ind) => {
              return <div className='d-flex border-bottom' key={ind}>
                <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{ele?.ShapeName}</p></div>
                <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{diamondSize && ele?.SizeName}</p></div>
                <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{fixedValues(ele?.Wt, 3)}</p></div>
                <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center fw-bold'>{setting && ele?.SettingName}</p></div>
                <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center fw-bold'>{setting && NumberWithCommas(ele?.SettingRate, 2)}</p></div>
                <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>{NumberWithCommas(ele?.SettingAmount, 2)}</p></div>
              </div>
            }) : <div className='d-flex border-bottom'>
              <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'></p></div>
              <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'></p></div>
              <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'></p></div>
              <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'></p></div>
              <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'></p></div>
              <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'></p></div>
              <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'></p></div>
              <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'></p></div>
              <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'></p></div>
            </div>
            }
            <div className='d-flex position-absolute w-100 bottom-0 totalHeightDetailPrint11 semiTotalDetailPrint11'>
              <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>Total</p></div>
              <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>No. Of Pieces</p></div>
              <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>20</p></div>
              <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>0.678</p></div>
              <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1 fw-bold'>Diamond Total</p></div>
              <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center fw-bold'>159.21</p></div>
              <div className='settingTypeTotalDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>Setting Total</p></div>
              <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>732</p></div>
            </div>
          </div>
          <div className="goldDetailPrint11 border-end d-grid">
            <div className='d-flex border-bottom'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Gross Weight (Grams)</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>{fixedValues(e?.grosswt, 3)} G</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Net Weight</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>{fixedValues(e?.NetWt, 3)} G</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Gold Loss</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>{fixedValues(e?.LossPer, 0)}%</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Pure Gold weight with Loss</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>{fixedValues(e?.puregoldWeightWithLoss, 3)} G</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Gold Price</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>63</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Alloy</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>{NumberWithCommas(e?.alloy, 2)}</p></div>
            </div>
            <div className='d-flex'>
              <div className='col-8 border-end d-flex align-items-center justify-content-center fw-bold'><p className='p-1'>Total Gold</p></div>
              <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>{NumberWithCommas(e?.totalGold, 2)}</p></div>
            </div>
          </div>
          <div className="labourDetailPrint11 border-end d-grid pad_bt_20DetailPrint11 position-relative">
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
              <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                <p>{e?.MakingAmount}</p>
              </div>
            </div>
            <div className='d-flex position-absolute bottom-0 w-100 min_height_20DetailPrint11'>
              <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p className='fw-bold'>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
              <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                <p className='fw-bold'>{e?.MakingAmount}</p>
              </div>
            </div>
          </div>
          <div className="d-grid pad_bt_20DetailPrint11 position-relative">
            <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery border-bottom"><p>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
            <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery position-absolute bottom-0 w-100 min_height_20DetailPrint11"><p className='fw-bold'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
          </div>
        </div>
      })}
      {/* total */}
      <div className="d-flex w-100 border-bottom border-start border-end border-2  no_break">
        <div className="totalDesignDetailPrint11 border-end d-flex align-items-center justify-content-center">
          <p className='text-center fw-bold'>Total</p>
        </div>
        <div className="diamondStoneDetailPrint11 d-grid diamondStoneDetailPrint11Total">
          <div className='d-flex'>
            <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center shapeDetailPrint11Total'><p className='p-1 fw-bold'>No of Pieces</p></div>
            <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{NumberWithCommas(total?.pcs, 0)}</p></div>
            <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{fixedValues(total?.diaWt, 3)}</p></div>
            <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='pb-1 fw-bold text-start'>Diamond </p><p className="fw-bold text-start">total</p>
            </div>
            <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center fw-bold'>{NumberWithCommas(total?.diaWt)}</p></div>
            <div className='settingTypeTotalDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1 '><p className='text-center fw-bold'>Setting Total</p></div>
            <div className='settingTotalPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center fw-bold'>{NumberWithCommas(total?.totalAmount, 2)}</p></div>
          </div>
        </div>
        <div className="goldDetailPrint11 border-end d-grid detailgoldDertailprint11">
          <div className='d-flex'>
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>Total Gold</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>{fixedValues(total?.totalGold, 3)} G</p></div>
          </div>
        </div>
        <div className="labourDetailPrint11 border-end d-flex">
          <div className='col-6 border-end d-flex align-items-center p-1 flex-column'><p>Total </p><p>Labour</p></div>
          <div className='col-6 d-flex align-items-center justify-content-end p-1'>
            <p>{NumberWithCommas(total?.totalLabour, 2)}</p>
          </div>
        </div>
        <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery"><p>
          <span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.totalJewelleryAmount, 2)}</p></div>
      </div>
      {/* remark */}
      <div className="d-flex w-100 border-bottom border-start border-end border-2 no_break">
        <div className="remarkDetailPrint11 border-end">
          <p className='p-1 fw-bold fs-6'>Remark :</p>
          <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className='p-1'></div>
        </div>
        <div className="blankSpaceDetailPrint11 border-end">
        </div>
        <div className="goldDetailsPrints11 border-end">
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>GOLD 14K :</p></div>
            <div><p>{fixedValues(summary?.gold14k, 3)} gm</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>GOLD 18K: </p></div>
            <div><p>{fixedValues(summary?.gold18k, 3)} gm</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>Diamond Wt:</p></div>
            <div><p>{fixedValues(summary?.diamondWt, 3)} cts</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>Stone Wt:</p></div>
            <div><p>{fixedValues(summary?.stoneWt, 3)} cts</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>Gross Wt:</p></div>
            <div><p>{fixedValues(summary?.grossWt, 3)} gm</p></div>
          </div>
        </div>
        <div className="totalLessDetailPrint11 border-end">
          <div className="d-flex justify-content-between w-100 p-1">
            <p>Total</p>
          </div>
          {taxes.length > 0 && taxes.map((e, i) => {
            return <div className="d-flex justify-content-between w-100 p-1" key={i}>
              <p>{e?.name} per {e?.per}</p>
            </div>
          })}
          <div className="d-flex justify-content-between w-100 p-1">
            <p>Less</p>
          </div>
        </div>
        <div className="totaljewAmountDetailPrint11 p-1">
          <p className='text-end p-1 fw-bold'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.totalJewelleryAmount, 2)}</p>
          {taxes.length > 0 && taxes.map((e, i) => {
            return <p className='text-end p-1 fw-bold' key={i}><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{e?.amount}</p>
          })}
          <p className='text-end p-1 fw-bold'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{json0Data?.AddLess}</p>
        </div>
      </div>
      {/* Grand total*/}
      <div className="d-flex border-bottom border-start border-end border-2 no_break">
        <div className="grandTotalDetailprint11 border-end border-end p-1">
          <p className='fw-bold text-end'>Grand Total </p>
        </div>
        <div className="grandTotalNumberDetailPrint11 p-1">
          <p className="fw-bold text-end"><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.grandTotal, 2)}</p>
        </div>
      </div>
      {/* Bank Detail */}
      <div className="d-flex border-bottom border-start border-end border-2 no_break">
        <div className="col-6 border-end">
          <p className='p-1'>Bank Detail</p>
          <p className='p-1'>Bank Name: {json0Data?.bankname}</p>
          <p className='p-1'>Branch: {json0Data?.bankaddress}</p>
          <p className='p-1'>Account Name: {json0Data?.accountname} </p>
          <p className='p-1'>Account No. : {json0Data?.accountnumber}</p>
          <p className='p-1'>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
        </div>
        <div className="col-3 border-end d-flex flex-column justify-content-between">
          <p className='p-1'>"Kayara Creation"</p>
          <p className='p-1 fw-bold'>Signature</p>
        </div>
        <div className="col-3 d-flex flex-column justify-content-between">
          <p className='p-1'>Tanisq</p>
          <p className='p-1 fw-bold'>Signature</p>
        </div>
      </div>
    </div > : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default DetailPrint11