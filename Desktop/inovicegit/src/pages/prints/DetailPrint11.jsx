import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/detailPrint11.css";
import { apiCall, handleImageError, handlePrint } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const DetailPrint11 = ({ urls, token, invoiceNo, printName }) => {

  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);

  const loadData = (data) => {
    setJson0Data(data.BillPrint_Json[0]);
    console.log(data?.BillPrint_Json2, data?.BillPrint_Json1);
    let resultAr = [];
    data?.BillPrint_Json1.forEach((e, i) => {
      let elementsArr = [];
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          let findrecordind = elementsArr.findIndex((element, ind) => (ele?.ShapeName === element?.ShapeName) && (ele?.Size === element?.Size || ele?.SettingName === element?.SettingName));
          if (findrecordind !== -1) {
            elementsArr[findrecordind].Pcs += ele?.Pcs;
            elementsArr[findrecordind].Wt += ele?.Wt;
          } else {
            if (ele?.ShapeName !== "GOLD") {
              elementsArr.push(ele);
            }else{
              console.log(ele);
            }
          }
        }
      });
      let obj = {...e};
      obj.materials = elementsArr;
      resultAr.push(obj);
    });
    setJson1Data(resultAr);
    setLoader(false);
  }

  const handleChange = (e) => {

  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls);
        loadData(data);
        setLoader(false);
      } catch (error) {
        console.error(error);
      }
    }
    sendData();
  }, []);

  return (
    loader ? <Loader /> : <div className='container containerDetailP11 mt-5'>
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4">
        <div className="form-check pe-3">
          {/* <input className="form-check-input border-dark" type="checkbox" checked={header} onChange={e => handleChange(e, "header")} /> */}
          <label className="form-check-label pt-1">
            With Header
          </label>
        </div>
        <div className="form-check pe-3">
          {/* <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => handleChange(e, "image")} /> */}
          <label className="form-check-label pt-1">
            With Image
          </label>
        </div>
        <div className="form-check">
          {/* <input className="form-check-input border-dark" type="checkbox" checked={summary} onChange={e => handleChange(e, "summary")} /> */}
          <label className="form-check-label pt-1">
            With Summary
          </label>
        </div>
        <div className="form-check ps-3">
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* company with logo detail  */}
      <div className="headerDetailp11 border d-flex justify-content-between align-items-center">
        <div className='px-1 py-2'>
          <p>{json0Data?.CompanyFullName}</p>
          <p>{json0Data?.CompanyAddress}</p>
          <p>{json0Data?.CompanyAddress2}</p>
          <p>{json0Data?.CompanyCity} {json0Data?.CompanyPinCode} {json0Data?.CompanyState} {json0Data?.CompanyCountry}</p>
          <p>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
          <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-EDJHF236D</p>

        </div>
        <div className='px-1 py-2'>
          <img src={json0Data?.PrintLogo} alt="" className='w-25 h-auto ms-auto d-block' onError={handleImageError} />
        </div>
      </div>
      {/* address */}
      <div className="border-start border-end border-bottom px-1 py-2 d-flex justify-content-between border-2">
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
          <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}{json0Data?.Company_CST_STATE} </p>
          <p>Terms: 100 Days</p>
          <p>Due Date: 26 Nov 2023</p>
        </div>
      </div>
      {/* table heading */}
      <div className="d-flex w-100 border-top border-bottom mt-1 border-start border-end border-2">
        <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center"><p>Sr.No.</p></div>
        <div className="designDetailPrint11 border-end d-flex align-items-center justify-content-center"><p className='p-1'>Design Detail</p></div>
        <div className="diamondStoneDetailPrint11 d-grid">
          <div className='border-bottom border-end d-flex justify-content-center align-items-center'>
            <p className='p-1 text-center'>Diamond & Stone Detail</p>
          </div>
          <div className='d-flex'>
            <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Shape</p></div>
            <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Size(mm)</p></div>
            <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Pcs</p></div>
            <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>DIA WT.</p></div>
            <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'>Price / cts </p>
              <p>( Currency)</p></div>
            <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'>Dia Amount</p></div>
            <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>"Setting </p><p>Type"</p></div>
            <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>Setting Price (Currency) </p></div>
            <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>Total Amount (Currency)</p></div>
          </div>
        </div>
        <div className="goldDetailPrint11 border-end d-grid">
          <div className="border-bottom d-flex">
            <p className='p-1 d-flex justify-content-center align-items-center w-100'>Gold</p>
          </div>
          <div className='d-flex'>
            <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Quality</p></div>
            <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>18KWG</p></div>
          </div>
        </div>
        <div className="labourDetailPrint11 border-end d-grid">
          <div className="border-bottom d-flex">
            <p className='p-1 d-flex justify-content-center align-items-center w-100'>Labour</p>
          </div>
          <div className='d-flex'>
            <div className='col-6 border-end d-flex align-items-center justify-content-center p-1'><p className='text-center'>Other Charges (Currency )</p></div>
            <div className='col-6 d-flex align-items-center justify-content-center p-1'>
              <p className='text-center'>Labour Amount (Currency )</p>
            </div>
          </div></div>
        <div className="totalAmountJewelleryDetailPrint11 d-flex align-items-center justify-content-center"><p className='p-1 text-center'>Total Jewellery Amount (Currency )</p></div>
      </div>
      {/* data */}
      {json1Data.length > 0 && json1Data.map((e, i) => {
        return <div className="d-flex w-100 border-bottom border-start border-end border-2" key={i}>
          <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center"><p>1</p></div>
          <div className="designDetailPrint11 border-end">
            <div className="d-flex justify-content-between p-1">
              <div><p>{e?.designno}</p></div>
              <div> <p>{e?.SrJobno}</p> <p>{e?.MetalColor}</p> </div>
            </div>
            <img src={e?.DesignImage} alt="" className='w-100 p-1' onError={handleImageError} />
            <p className='text-center fw-bold'>Tunch: {e?.Tunch}</p>
            <p className='text-center fw-bold'>{e?.grosswt}gm Gross</p>
            <p className='text-center pb-1'>Size Push And Pull {e?.Size}</p>
          </div>
          <div className="diamondStoneDetailPrint11 d-grid">
            {/* <div className='d-flex'>
              <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>S/C</p></div>
              <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>0.8</p></div>
              <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>130</p></div>
              <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>0.335</p></div>
              <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'>250.000</p>
                <p>( Currency)</p></div>
              <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'>83.750</p></div>
              <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>Micro</p></div>
              <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>3.00</p></div>
              <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>390.00</p></div>
            </div> */}
            {e?.materials.length > 0 && e?.materials.map((ele, ind) => {
              return  <div className='d-flex' key={ind}>
              <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>{ele?.ShapeName}</p></div>
              <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>{ele?.SizeName}</p></div>
              <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>{ele?.Pcs}</p></div>
              <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1'>{(ele?.Wt)?.toFixed(2)}</p></div>
              <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1'>250.000</p>
                <p>( Currency)</p></div>
              <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'>83.750</p></div>
              <div className='settingTypeDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>{ele?.SettingName}</p></div>
              <div className='settingPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>3.00</p></div>
              <div className='totalAmountDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>390.00</p></div>
            </div>
            })}
          </div>
          <div className="goldDetailPrint11 border-end d-grid">
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Gross Weight (Grams)</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>2.524 G</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Net Weight</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>2.491 G</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Gold Loss</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>10%</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Pure Gold weight with Loss</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>2.07 G</p></div>
            </div>
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Gold Price (Currency / Grams)</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>63</p></div>
            </div>
            <div className='d-flex'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Alloy ( Curreny)</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>2.4</p></div>
            </div>
          </div>
          <div className="labourDetailPrint11 border-end d-grid pad_bt_20DetailPrint11 position-relative">
            <div className='d-flex border-bottom'>
              <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p>{e?.OtherCharges}</p></div>
              <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                <p>{e?.MakingAmount}</p>
              </div>
            </div>
            <div className='d-flex position-absolute bottom-0 w-100 min_height_20DetailPrint11'>
              <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p>12</p></div>
              <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                <p>123</p>
              </div>
            </div>
          </div>
          <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-end p-1"><p>{e?.TotalAmount}</p></div>
        </div>
      })}
      {/* total */}
      <div className="d-flex w-100 border-bottom border-start border-end border-2">
        <div className="totalDesignDetailPrint11 border-end d-flex align-items-center justify-content-center">
          <p className='text-center fw-bold'>Total</p>
        </div>
        <div className="diamondStoneDetailPrint11 d-grid">
          <div className='d-flex'>
            <div className='shapeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>No of Pieces</p></div>
            <div className='sizeDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>206</p></div>
            <div className='pcsDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>0.678</p></div>
            <div className='diaDetailPrint11 border-end d-flex align-items-center justify-content-center'><p className='p-1 fw-bold'>0.335</p></div>
            <div className='priceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column'><p className='p-1 fw-bold text-start'>Diamond total (Currency)</p>
            </div>
            <div className='diaAmtDetailPrint11 border-end d-flex align-items-center justify-content-center p-1 flex-column'><p className='text-center'>159.21</p></div>
            <div className='settingTypeTotalDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1 '><p className='text-center'>Setting Total (Currency)	</p></div>
            <div className='settingTotalPriceDetailPrint11 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center'>732</p></div>
          </div>
        </div>
        <div className="goldDetailPrint11 border-end d-grid">
          <div className='d-flex'>
            <div className='col-6 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Total Gold (Currency)</p></div>
            <div className='col-6 d-flex align-items-center justify-content-center'><p className='p-1'>2.524 G</p></div>
          </div>
        </div>
        <div className="labourDetailPrint11 border-end d-flex">
          <div className='col-6 border-end d-flex align-items-center p-1'><p>Total Labour (Currency)</p></div>
          <div className='col-6 d-flex align-items-center justify-content-end p-1'>
            <p>135</p>
          </div>
        </div>
        <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-end p-1"><p>1254545.204</p></div>
      </div>
      {/* remark */}
      <div className="d-flex w-100 border-bottom border-start border-end border-2">
        <div className="remarkDetailPrint11 border-end">
          <p className='p-1 fw-bold'>Remark :</p>
          <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className='p-1'></div>
        </div>
        <div className="blankSpaceDetailPrint11 border-end">
        </div>
        <div className="goldDetailsPrints11 border-end">
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>GOLD 14K :</p></div>
            <div><p>6.026 gm</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>GOLD 18K: </p></div>
            <div><p>28.403 gm</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>Diamond Wt:</p></div>
            <div><p>19.722 cts</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>Stone Wt:</p></div>
            <div><p>13.084 cts</p></div>
          </div>
          <div className="d-flex w-100 justify-content-between p-1">
            <div><p>Gross Wt:</p></div>
            <div><p>74.192 gm</p></div>
          </div>
        </div>
        <div className="totalLessDetailPrint11 border-end">
          <div className="d-flex justify-content-between w-100 p-1">
            <p>Total</p>
            <p></p>
          </div>
          <div className="d-flex justify-content-between w-100 p-1">
            <p>Less</p>
            <p></p>
          </div>
        </div>
        <div className="totaljewAmountDetailPrint11 p-1">
          <p className='text-end p-1'>$5,63,708.90</p>
          <p className='text-end p-1'>$-0.17</p>
        </div>
      </div>
      {/* Grand total*/}
      <div className="d-flex border-bottom border-start border-end border-2">
        <div className="grandTotalDetailprint11 border-end border-end p-1">
          <p className='fw-bold text-end'>Grand Total </p>
        </div>
        <div className="grandTotalNumberDetailPrint11 border-end p-1">
          <p className="fw-bold text-end">$5,63.708.73</p>
        </div>
      </div>
      {/* Bank Detail */}
      <div className="d-flex border-bottom border-start border-end border-2">
        <div className="col-6 border-end">
          <p className='p-1'>Bank Detail</p>
          <p className='p-1'>Bank Name: {json0Data?.bankname}</p>
          <p className='p-1'>Branch: {json0Data?.bankaddress}</p>
          <p className='p-1'>Account Name: {json0Data?.accountname} </p>
          <p className='p-1'>Account No. : {json0Data?.accountnumber}</p>
          <p className='p-1'>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
        </div>
        <div className="col-3 border-end d-flex flex-column justify-content-between">
          <p className='p-1'>"Kayara Creation</p>
          <p className='p-1'>Signature</p>
        </div>
        <div className="col-3 d-flex flex-column justify-content-between">
          <p className='p-1'>Tanisq</p>
          <p className='p-1'>Signature</p>
        </div>
      </div>
    </div>
  )
}

export default DetailPrint11