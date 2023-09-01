import React, { useEffect, useState } from 'react';
import "../assets/css/detailPrint11.css";
import { apiCall, handleImageError } from '../GlobalFunctions';

const DetailPrint11 = ({ urls, token, invoiceNo, printName }) => {

  const [loader, setLoader] = useState(true);

  const loadData = (data) => {
    console.log(data);
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
    <div className='container containerDetailP11 mt-5'>
      {/* company with logo detail  */}
      <div className="headerDetailp11 border d-flex justify-content-between align-items-center">
        <div className='px-1 py-2'>
          <p>Nic Company Pvt ltd</p>
          <p>102, Red Port Arcade</p>
          <p>Plaza Street</p>
          <p>Surat-605001.Gujarat(India)</p>
          <p>Darren@orail.in |www.optigoapps.com</p>
          <p>GSTIN-245DERTGYHUU | SATE CODE -29 | PAN-CCSED4585R</p>
        </div>
        <div className='px-1 py-2'>
          <img src="https://logos.textgiraffe.com/logos/logo-name/Uday-designstyle-boots-m.png" alt="" className='w-25 h-auto ms-auto d-block' />
        </div>
      </div>
      {/* address */}
      <div className="border-start border-end border-bottom px-1 py-2 d-flex justify-content-between">
        <div className="w-50">
          <p>To,</p>
          <p>Tanisq</p>
          <p>Udhana Darwaja,</p>
          <p>Udhana teen rasta</p>
          <p>Surat</p>
          <p>Gujarat,india-96525</p>
          <p>Tel:998-858-5214</p>
          <p>vishal@co.in</p>
        </div>
        <div className="w-50 text-end">   
          <p>invoice#:JS/4933/22-23</p>
          <p>GSTINGST0000130 | STATE CODE GS</p>
          <p>Terms: 100 Days</p>
          <p>Due Date: 26 Nov 2023</p>
        </div>
      </div>
      {/* table heading */}
      <div className="d-flex w-100 border-top border-bottom mt-1 border-start border-end">
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
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Quality</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>18KWG</p></div>
          </div>
        </div>
        <div className="labourDetailPrint11 border-end">
          <div className="border-bottom d-flex">
            <p className='p-1 d-flex justify-content-center align-items-center w-100'>Labour</p>
          </div>
          <div className='d-flex'>
            <div className='col-8 border-end d-flex align-items-center justify-content-center p-1'><p className='text-center'>Other Charges (Currency )</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center p-1'>
              <p className='text-center'>Labour Amount (Currency )</p>
            </div>
          </div></div>
        <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-center"><p className='p-1 text-center'>Total Jewellery Amount (Currency )</p></div>
      </div>
      {/* data */}
      <div className="d-flex w-100 border-bottom border-start border-end">
        <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center"><p>1</p></div>
        <div className="designDetailPrint11 border-end">
          <div className="d-flex justify-content-between p-1">
            <div><p>E E EM 1541</p></div>
            <div> <p>1/27284</p> <p>WHITE GOLD</p> </div>
          </div>
          <img src="https://m.media-amazon.com/images/I/91orO83ClZL.jpg" alt="" className='w-100 p-1' onError={handleImageError}/>
          <p className='text-center fw-bold'>Tunch: 83.160</p>
          <p className='text-center fw-bold'>2.810gm Gross</p>
          <p className='text-center pb-1'>Size Push And Pull</p>
        </div>
        <div className="diamondStoneDetailPrint11 d-grid">
          <div className='d-flex'>
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
          </div>
        </div>
        <div className="goldDetailPrint11 border-end d-grid">
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Gross Weight (Grams)</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>2.524 G</p></div>
          </div>
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Net Weight</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>2.491 G</p></div>
          </div>
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Gold Loss</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>10%</p></div>
          </div>
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Pure Gold weight with Loss</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>2.07 G</p></div>
          </div>
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Gold Price (Currency / Grams)</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>63</p></div>
          </div>
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-center'><p className='p-1'>Alloy ( Curreny)</p></div>
            <div className='col-4 d-flex align-items-center justify-content-center'><p className='p-1'>2.4</p></div>
          </div>
        </div>
        <div className="labourDetailPrint11 border-end d-grid pad_bt_20DetailPrint11 position-relative">
          <div className='d-flex border-bottom'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-end p-1'><p>12</p></div>
            <div className='col-4 d-flex align-items-center justify-content-end p-1'>
              <p>123</p>
            </div> 
          </div>
          <div className='d-flex position-absolute bottom-0 w-100'>	
            <div className='col-8 border-end d-flex align-items-center justify-content-end p-1'><p>12</p></div>
            <div className='col-4 d-flex align-items-center justify-content-end p-1'>
              <p>123</p> 
            </div>
          </div>
          </div>
        <div className="totalAmountDetailPrint11 d-flex align-items-center justify-content-end p-1"><p>123</p></div>
      </div>
    </div>
  )
}

export default DetailPrint11