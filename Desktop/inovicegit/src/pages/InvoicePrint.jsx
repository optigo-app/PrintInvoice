import React from 'react';
import "../assets/css/invoicePrint.css";
import { handlePrint } from '../GlobalFunctions';

const InvoicePrint = () => {
  return (
    <div className='container portraitContainer inoviceprintContainer'>
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
        <div className="form-check">
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* heading */}
      <div className="bgGrey text-uppercase fs-2 fw-bold p-3 text-white mb-2">Tax Invoice</div>
      {/* address */}
      <div className="w-100 d-flex justify-content-between py-2">
        <div className='col-10'>
          <p>ORAIL SERVICE</p>
          <p>Shangai-La Plaza Mall</p>
          <p>Nagpur-605001, Maharashtra(India)</p>
          <p>T 78945612301 | TOLL FREE 1800-2568-28667</p>
          <p>darren@orail.co.in | www.optigoapps.com	Projectlogo</p>
        </div>
        <div className='col-2'>
          <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS//companylogo/projectlogo.png" alt="" className='w-100' />
        </div>
      </div>
      {/* bill no */}
      <div className="w-100 d-flex justify-content-between pb-2">
        <div className='col-9'>
        </div>
        <div className='col-3'>
          <div className="border border-2 p-2">

          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePrint;