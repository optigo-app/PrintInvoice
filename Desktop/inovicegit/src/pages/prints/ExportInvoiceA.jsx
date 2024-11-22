import React from 'react'
import "../../assets/css/prints/exportinvoicea.css";
import { handlePrint } from '../../GlobalFunctions';
const ExportInvoiceA = () => {
  const headerData = {};
  return (
    <div className='export_print_a_container '>
        <div className='my-2 d_none_eia w-100 d-flex justify-content-end'>           
            <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      <div className='first_page_eia'>
      <div className="d-flex border border-black">
                        <div className='p-2 col-6 border-end border-black'>
                            <div className="d-flex justify-content-between">
                                <p className="text-decoration-underline fw-semibold"> Exporter </p>
                                {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
                            </div>
                            <p className='fs-5 fw-bold py-1'>{headerData?.CompanyFullName}</p>
                            <p className='fw-semibold'>{headerData?.CompanyAddress}</p>
                            <p className='fw-semibold'>{headerData?.CompanyAddress2}</p>
                            <p className='fw-semibold'>{headerData?.CompanyCity}, {headerData?.CompanyCountry}</p>
                            <p className='fw-semibold'>Telephone No :{headerData?.CompanyTellNo}</p>
                            <p className='fw-semibold'>Email Id :{headerData?.CompanyEmail}</p>
                        </div>
                        <div className='col-6'>
                            <div className='d-flex border-bottom border-black'>
                                <div className="col-6 border-end border-black p-2">
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Invoice No :</p>
                                        <p className='fw-bold'>{headerData?.InvoiceNo}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Invoice Dt :</p>
                                        <p className='fw-bold'>{headerData?.EntryDate}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>EDF No. :</p>
                                        <p className='fw-bold'></p>
                                    </div>
                                </div>
                                <div className="col-6 d-flex flex-column justify-content-between align-items-center p-2">
                                    <p className='text-uppercase fw-semibold'>Exporter's reference</p>
                                    <p className='text-uppercase fw-semibold'>under Chapter 4</p>
                                </div>
                            </div>
                            <div className='p-1 d-flex'>
                                <p className="fw-bold">Buyer's Order No. & Date</p>
                            </div>
                            <div className='p-1 border-top border-black'>
                                <p className="fw-bold">Other Reference</p>
                                <p className="fw-semibold">EDF No. </p>
                            </div>
                        </div>
      </div>
      <div className="d-flex border border-top-0 border-black ">
                        <div className='p-2 col-6 border-end border-black'>
                            <div className="d-flex justify-content-between">
                                <p className="text-decoration-underline fw-semibold"> Consignee </p>
                                {/* <p className="text-decoration-underline fw-semibold"> Ref. Person Details </p> */}
                            </div>
                            {/* <p className='fs-5 fw-bold py-1'>{headerData?.customerfirmname}</p>
                            <p className='fw-semibold'>{headerData?.customerAddress1}</p>
                            <p className='fw-semibold'>{headerData?.customerAddress2}</p>
                            <p className='fw-semibold'>{headerData?.customerAddress3} {headerData?.customercity}, {headerData?.customercountry}</p>
                            <p className='fw-semibold'>Telephone No : {headerData?.customermobileno}</p>
                            <p className='fw-semibold'>Email Id :{headerData?.customeremail1}</p> */}
                        </div>
                        <div className='col-6 minHeight_eia'>
                            <div className='p-2'>
                                <p className="fw-bold">Buyer (if other than consignee)</p>
                            </div>
                        </div>
                        <div></div>
      </div>
      <div className="d-flex border border-top-0 border-black overflow-hidden ">
                        <div className='col-6 border-end border-black'>
                            <div className="d-flex border-bottom border-black">
                                <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                    <p className="fw-semibold">Pre-Carriage By </p>
                                </div>
                                <div className="col-6 pt-1 px-1 pb-4">
                                    <p className="fw-semibold">Place of Receipt by Pre-carrier N.A. </p>
                                </div>
                            </div>
                            <div className="d-flex border-bottom border-black">
                                <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                    <p className="fw-semibold">Vessel/Flight No.</p>
                                    <p className="">{headerData?.Flight_NO}</p>
                                </div>
                                <div className="col-6 pt-1 px-1 pb-4">
                                    <p className="fw-semibold">Port of Loading</p>
                                    <p className="">{headerData?.portofloading}</p>
                                </div>
                            </div>
                            <div className="d-flex ">
                                <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                    <p className="fw-semibold">Port of Discharge</p>
                                    <p className="">{headerData?.portofdischarge}</p>
                                </div>
                                <div className="col-6 pt-1 px-1 pb-4">
                                    <p className="fw-semibold">Final Destination</p>
                                </div>
                            </div>
                            {/* <div className={`d-flex  h-100`}>
                                <div className="col-4 border-end border-black p-1 text-center">
                                    <p className="fw-semibold">Marks & Nos. AS ADDRESS</p>
                                </div>
                                <div className="col-4 border-end border-black p-1 text-center">
                                    <p className="fw-semibold">No & KIND OF PKGS</p>
                                </div>
                                <div className="col-4 p-1 text-center">
                                    <p className="fw-semibold">QUANTITY 2</p>
                                </div>
                            </div> */}
                        </div>
                        <div className='col-6'>
                            <div className="d-flex border-black border-bottom">
                                <div className="col-6 p-2 border-black border-end d-flex">
                                    <p className="fw-semibold text-center">Country of Origin of Goods : </p>
                                    <p className="fw-bold text-center pt-1">&nbsp;{headerData?.customercountry}</p>
                                </div>
                                <div className="col-6 py-2">
                                    <p className="fw-semibold text-center">Country of Final Destination : UNITED KINGDOM</p>
                                </div>
                            </div>
                            <div className="d-flex border-black border-bottom">
                                <div className="col-6 p-2">
                                    <p className="fw-semibold"> Terms of Delivery and payment : 0 Days</p>
                                    {/* <p className="fw-semibold"> Bank Name : {headerData?.bankname} </p>
                                    <p className={`fw-semibold `}> Bank Add : {headerData?.bankaddress}</p> */}
                                </div>
                                <div className="col-6 p-2">
                                    {/* <div className="d-flex">
                                        <div className="col-6">
                                            <p className="fw-semibold text-end"> Payment Terms : </p>
                                            <p className="fw-semibold text-end"> A/C No. : </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="fw-semibold ps-2" style={{ minHeight: '15.36px' }}> </p>
                                            <p className="fw-semibold ps-2"> {headerData?.accountnumber}</p>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div className="">
                                <p className="px-2 pt-1  fw-semibold"> Description of Goods </p>
                                <p className="px-2    fw-semibold">{headerData?.HSN_No}</p>
                            </div> */}
                        </div>
      </div>
      <div className={` w-100  h-100`}>
                                <div className=" border border-top-0 border-black p-1 text-start">
                                    <p className="fw-semibold"><span className='fw-bold'>Marks & Nos. Container </span> No & KIND OF PKGS : 1 (ONE) TIN BOX</p>
                                </div>
                                <div className=" border border-top-0 border-black p-1 text-start">
                                    <p className="fw-semibold"><span className='fw-bold'>AS ADD </span> 09KT Branded Gold & 925 Silver Plain Jewellery</p>
                                </div>
                                {/* <div className=" p-1 text-center">
                                    <p className="fw-semibold">QUANTITY 2</p>
                                </div> */}
      </div>
      <div>
        <div className='d-flex fw-bold border border-black mt-1'>
          <div className='col_1_eia fw-normal p-1'>SR No</div>
          <div className='col_2_eia p-1'>Product</div>
          <div className='col_3_eia p-1'>HSV Code</div>
          <div className='col_4_eia p-1'>Dia Wt <br /> (Cts)</div>
          <div className='col_5_eia p-1'>CS Wt <br /> (Cts)</div>
          <div className='col_6_eia border-end border-black p-1'>Gross Wt <br /> (Gms)</div>
          <div className='col_7_eia border-end border-black p-1'>Quantity <br /> PCS/PRS</div>
          <div className='col_8_eia border-end border-black p-1'>Rate</div>
          <div className='col_9_eia p-1'>Amount <br /> USS</div>
        </div>
        {
          [1,2,3,4,5]?.map((e, i) => {
            return (
              <div className='d-flex fw-normal border border-top-0 border-black ' key={i}>
                <div className='col_1_eia fw-normal p-1'>SR No</div>
                <div className='col_2_eia p-1'>Product</div>
                <div className='col_3_eia p-1'>HSV Code</div>
                <div className='col_4_eia p-1'>Dia Wt</div>
                <div className='col_5_eia p-1'>CS Wt </div>
                <div className='col_6_eia border-end border-black p-1'>Gross Wt </div>
                <div className='col_7_eia border-end border-black p-1'>Quantity </div>
                <div className='col_8_eia border-end border-black p-1'>Rate</div>
                <div className='col_9_eia p-1'>Amount </div>
              </div>
            )
          })
        }
      </div>
      <div className='d-flex border border-black border-top-0 minHeight_sign_eia'>
        <div className='w-75 d-flex flex-column align-items-start ps-2 justify-content-center border-end border-black'>
          <div>Declaration : </div>
          <div>We Declare that</div>
        </div>
        <div  className='w-25 d-flex  align-items-end ps-2 fw-bolder justify-content-start '>Authorized Signatory</div>
      </div>
      </div>
      <div className='fw-bold ps-1 mt-1'>INVOICE</div>
      <div className="d-flex border border-black">
                        <div className='p-2 col-6 border-end border-black'>
                            <div className="d-flex justify-content-between">
                                <p className="text-decoration-underline fw-semibold"> Exporter </p>
                                {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
                            </div>
                            <p className='fs-5 fw-bold py-1'>{headerData?.CompanyFullName}</p>
                            <p className='fw-semibold'>{headerData?.CompanyAddress}</p>
                            <p className='fw-semibold'>{headerData?.CompanyAddress2}</p>
                            <p className='fw-semibold'>{headerData?.CompanyCity}, {headerData?.CompanyCountry}</p>
                            <p className='fw-semibold'>Telephone No :{headerData?.CompanyTellNo}</p>
                            <p className='fw-semibold'>Email Id :{headerData?.CompanyEmail}</p>
                        </div>
                        <div className='col-6'>
                            <div className='d-flex border-bottom border-black'>
                                <div className="col-6 border-end border-black p-2">
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Invoice No :</p>
                                        <p className='fw-bold'>{headerData?.InvoiceNo}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Invoice Dt :</p>
                                        <p className='fw-bold'>{headerData?.EntryDate}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>EDF No. :</p>
                                        <p className='fw-bold'></p>
                                    </div>
                                </div>
                                <div className="col-6 d-flex flex-column justify-content-between align-items-center p-2">
                                    <p className='text-uppercase fw-semibold'>Exporter's reference</p>
                                    <p className='text-uppercase fw-semibold'>under Chapter 4</p>
                                </div>
                            </div>
                            <div className='p-1 d-flex'>
                                <p className="fw-bold">Buyer's Order No. & Date</p>
                            </div>
                            <div className='p-1 border-top border-black'>
                                <p className="fw-bold">Other Reference</p>
                                <p className="fw-semibold">EDF No. </p>
                            </div>
                        </div>
      </div>
      <div className={` w-100  h-100 mt-1`}>
                                <div className=" border border-top border-black p-1 text-start">
                                    <p className="fw-semibold"><span className='fw-bold'>Marks & Nos. Container </span> No & KIND OF PKGS : 1 (ONE) TIN BOX</p>
                                </div>
                                <div className=" border border-top-0 border-black p-1 text-start">
                                    <p className="fw-semibold"><span className='fw-bold'>AS ADD </span> 09KT Branded Gold & 925 Silver Plain Jewellery</p>
                                </div>
                                {/* <div className=" p-1 text-center">
                                    <p className="fw-semibold">QUANTITY 2</p>
                                </div> */}
      </div>
      <div className='mt-1'>
          <div className='d-flex border border-black fw-bold'>
              <div className='col_t2_1_eia p-1 border-end border-black'>RM KT</div>
              <div className='col_t2_2_eia p-1 border-end border-black'>Loss %</div>
              <div className='col_t2_3_eia p-1 border-end border-black'>Met Wt</div>
              <div className='col_t2_4_eia p-1 border-end border-black'>Pure MetWt</div>
              <div className='col_t2_5_eia p-1 border-end border-black'>LossWt</div>
              <div className='col_t2_6_eia p-1 border-end border-black'>PureLossWt</div>
              <div className='col_t2_7_eia p-1 border-end border-black'>TotWt</div>
              <div className='col_t2_8_eia p-1'>PureTotWt</div>
          </div>
          {
            [1,2,3,4,5]?.map((e, i) => {
              return (
                <>
                { e % i === 0 ? <div className='d-flex border-start border-black border-bottom border-end' key={i}>
                  <div className='col_t2_1_eia p-1 border-end border-black'>Gold</div>
                  <div className='col_t2_2_eia p-1 border-end border-black'></div>
                  <div className='col_t2_3_eia p-1 border-end border-black'></div>
                  <div className='col_t2_4_eia p-1 border-end border-black'></div>
                  <div className='col_t2_5_eia p-1 border-end border-black'></div>
                  <div className='col_t2_6_eia p-1 border-end border-black'></div>
                  <div className='col_t2_7_eia p-1 border-end border-black'></div>
                  <div className='col_t2_8_eia p-1'></div>
              </div> :
                <div className='d-flex border-start border-black border-end border-bottom' key={i}>
                  <div className='col_t2_1_eia p-1 border-end border-black'>RM KT</div>
                  <div className='col_t2_2_eia p-1 border-end border-black'>Loss %</div>
                  <div className='col_t2_3_eia p-1 border-end border-black'>Met Wt</div>
                  <div className='col_t2_4_eia p-1 border-end border-black'>Pure MetWt</div>
                  <div className='col_t2_5_eia p-1 border-end border-black'>LossWt</div>
                  <div className='col_t2_6_eia p-1 border-end border-black'>PureLossWt</div>
                  <div className='col_t2_7_eia p-1 border-end border-black'>TotWt</div>
                  <div className='col_t2_8_eia p-1'>PureTotWt</div>
              </div>}
              </>
              )
            })
          }
      </div>
      <div>
        <div className='border border-black mt-1 px-1'>Note: Insurance By :- FUTURE GENERALI INSURANCE</div>
        <div className='d-flex border border-top-0  border-black'>
          <div className='col_t3_1_eia'></div>
          <div className='col_t3_2_eia fw-bold'>31699.33</div>
          <div className='col_t3_3_eia'>
            <div>PCS</div>
            <div>PRS</div>
          </div>
          <div className='col_t3_4_eia'>
            <div>7.000</div>
            <div>4.000</div>
          </div>
          <div className='col_t3_5_eia'>FOB</div>
          <div className='col_t3_6_eia'>381.46</div>
        </div>
        <div className='d-flex border border-top-0  border-black'>
          <div className='col_t3_1_eia'></div>
          <div className='col_t3_2_eia fw-bold'>31699.33</div>
          <div className='col_t3_3_eia'>
            {/* <div>PCS</div>
            <div>PRS</div> */}
          </div>
          <div className='col_t3_4_eia'>
            {/* <div>7.000</div>
            <div>4.000</div> */}
          </div>
          <div className='col_t3_5_eia'>FOB</div>
          <div className='col_t3_6_eia'>381.46</div>
        </div>
        <div className='d-flex border border-top-0  border-black'>
          <div className='col_t3_1_eia'></div>
          <div className='col_t3_2_eia fw-bold'>31699.33</div>
          <div className='col_t3_3_eia'>
            {/* <div>PCS</div>
            <div>PRS</div> */}
          </div>
          <div className='col_t3_4_eia'>
            {/* <div>7.000</div>
            <div>4.000</div> */}
          </div>
          <div className='col_t3_5_eia'>FOB</div>
          <div className='col_t3_6_eia'>381.46</div>
        </div>
        <div className='d-flex border border-top-0  border-black'>
          <div className='col_t3_1_eia'></div>
          <div className='col_t3_2_eia fw-bold'>31699.33</div>
          <div className='col_t3_3_eia'>
            {/* <div>PCS</div>
            <div>PRS</div> */}
          </div>
          <div className='col_t3_4_eia'>
            {/* <div>7.000</div>
            <div>4.000</div> */}
          </div>
          <div className='col_t3_5_eia'>FOB</div>
          <div className='col_t3_6_eia'>381.46</div>
        </div>
      </div>
      <div className='border border-black mt-1 p-1 text-break'>
        Amount Chargeable Total Net Realisation US Dollars : Five Hundred dollars and Zero cents (In Words)
      </div>
      <div>Declaration</div>
      <div>
        <div>Declaration : </div>
        <div>We declare that</div>
      </div>
      <div className='d-flex minHeight_sign_eia border border-black'>
        <div className='w-75 border-end border-black'></div>
        <div className='w-25 ps-2 d-flex justify-content-start align-items-end'>Authorized Signatory</div>
      </div>
    </div>
  )
}

export default ExportInvoiceA