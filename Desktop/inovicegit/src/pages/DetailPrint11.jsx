import React, { useEffect, useState } from 'react';
import "../assets/css/detailPrint11.css";
import { apiCall } from '../GlobalFunctions';

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
      <div className="d-flex w-100 border-top border-bottom mt-1">
        <div className="srNoDetailPrint11 border-end"><p>Sr. No.</p></div>
        <div className="designDetailPrint11 border-end"><p>Design Detail</p></div>
        <div className="diamondStoneDetailPrint11 border-end">
          <div className='border-bottom'>
            <p>Diamond & Stone Detail</p>
          </div>
          <div className='d-flex'>
            <div className='shapeDetailPrint11'><p>Shape</p></div>
            <div className='sizeDetailPrint11'><p>Size(mm)</p></div>
            <div className='pcsDetailPrint11'><p>Pcs</p></div>
            <div className='diaDetailPrint11'><p>DIA WT.</p></div>
            <div className='priceDetailPrint11'><p>Price / cts ( Currency)</p></div>
            <div className='diaAmtDetailPrint11'><p>Dia Amount (Currency)</p></div>
            <div className='settingTypeDetailPrint11'><p>"Setting Type"</p></div>
            <div className='settingPriceDetailPrint11'><p>Setting Price (Currency)</p></div>
            <div className='totalAmountDetailPrint11'><p>Total Amount (Currency)</p></div>
          </div>
        </div>
        <div className="goldDetailPrint11 border-end"><p>Gold</p></div>
        <div className="labourDetailPrint11 border-end"><p>Labour</p></div>
        <div className="totalAmountDetailPrint11 border-end"><p>Total Amount</p></div>
      </div>
    </div>
  )
}

export default DetailPrint11