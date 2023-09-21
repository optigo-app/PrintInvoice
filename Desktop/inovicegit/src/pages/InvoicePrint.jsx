import React, { useEffect, useState } from 'react';
import "../assets/css/invoicePrint.css";
import { apiCall, handlePrint } from '../GlobalFunctions';

const InvoicePrint = ({ urls, token, invoiceNo, printName }) => {

  const [loader, setLoader] = useState(true);
  const [json0, setJson0] = useState({});
  const [data, setData] = useState([]);

  const findOtherName = (arr, ele) => {
    let findIndex = arr.findIndex((e, i) => e?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid && e?.Rate === ele?.Rate);
    if (findIndex === -1) {
      arr.push(ele);
    } else {
      arr[findIndex].Wt += ele?.Wt;
      arr[findIndex].Rate += ele?.Rate;
      arr[findIndex].Amount += ele?.Amount;
      arr[findIndex].Pcs += ele?.Pcs;
    }
    return arr;
  }

  const findMetalName = (arr, ele) => {
    let findIndex = arr.findIndex((e, i) => { if (e?.ShapeName === ele?.ShapeName) { if (e?.QualityName === ele?.QualityName) { if (e?.Rate === ele?.Rate) { return ele; } } } });
    if (findIndex === -1) {
      arr.push(ele);
    } else {
      arr[findIndex].Wt += ele?.Wt;
      arr[findIndex].Rate += ele?.Rate;
      arr[findIndex].Amount += ele?.Amount;
      arr[findIndex].Pcs += ele?.Pcs;
    }
    return arr;
  }

  const loadData = (data) => {
    console.log(data);
    setJson0(data?.BillPrint_Json[0]);
    let result = [];
    data?.BillPrint_Json2.map((e, i) => {
      if (result.length === 0) {
        if (e?.MasterManagement_DiamondStoneTypeid === 4) {
          let newTotal = findMetalName(result, e);
          result = newTotal;
        } else {
          result.push(e);
        }
      } else {
        if (e?.MasterManagement_DiamondStoneTypeid === 4) {
          let newTotal = findMetalName(result, e);
          result = newTotal;
        } else {
          let newTotal = findOtherName(result, e);
          result = newTotal;
        }
      }
    });
    setData(result);
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
    <div className='container portraitContainer inoviceprintContainer'>
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
        <div className="form-check">
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* heading */}
      <div className="bgGrey text-uppercase fs-4 fw-bold p-2 text-white mb-2 no_break">Tax Invoice</div>
      {/* address */}
      <div className="w-100 d-flex justify-content-between py-2 no_break">
        <div className='col-10 p-1 border border-2 border-white p-1'>
          <p>{json0?.CompanyFullName}</p>
          <p>{json0?.CompanyAddress}</p>
          <p>{json0?.CompanyAddress2}-{json0?.CompanyPinCode}, {json0?.CompanyState}({json0?.CompanyCountry})</p>
          <p>T {json0?.CompanyTellNo} | TOLL FREE {json0?.CompanyTollFreeNo}</p>
          <p>{json0?.CompanyEmail} | {json0?.CompanyWebsite}</p>
        </div>
        <div className='col-2'>
          <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS//companylogo/projectlogo.png" alt="" className='w-100' />
        </div>
      </div>
      {/* bill no */}
      <div className="w-100 d-flex justify-content-between pb-2 no_break">
        <div className='col-9'>
        </div>
        <div className='col-3'>
          <div className="border border-2 p-2 border-black">
            <div className="d-flex">
              <p className='fw-bold'>BILL NO</p>
              <p className='ps-2'>{json0?.InvoiceNo}</p>
            </div>
            <div className="d-flex">
              <p className='fw-bold'>DATE</p>
              <p className='ps-2'>{json0?.EntryDate}</p>
            </div>
            <div className="d-flex">
              <p className='fw-bold'>HSN</p>
              <p className='ps-2'>{json0?.HSN_No}</p>
            </div>
          </div>
        </div>
      </div>
      {/* customer address */}
      <div className="pb-2 no_break">
        <div className="d-flex border-2 border border-black p-1">
          <div className="col-6">
            <p className='fs-6 fw-bold'> To,	{json0?.customerfirmname}</p>
            <p className="ps-4">{json0?.customerAddress2}</p>
            <p className="ps-4">{json0?.customercity}{json0?.customerpincode}</p>
            <p className="ps-4">STATE NAME : {json0?.State}</p>
          </div>
          <div className="col-2"></div>
          <div className="col-4 d-flex justify-content-center align-items-start flex-column">
            <p><span className='fw-bold'>GSTIN: </span><span className='ps-2'>{json0?.Company_VAT_GST_No}</span></p>
            <p><span className='fw-bold'>STATE CODE: </span><span className='ps-2'>{json0?.Cust_CST_STATE_No}</span></p>
          </div>
        </div>
      </div>
      {/* discription */}
      <div className="pb-2 no_break">
        <div className="d-flex border border-2 border-black">
          <div className="col-3 border-end border-2 border-black">
            <p className="fw-bold p-1 text-center border-bottom border-2 border-black">DESCRIPTION</p>
            <div className="minHieght150InvoicePrint d-flex justify-content-center align-items-center">
              <p>GOLD JEWELLERY</p>
            </div>
            <div className="minHieght28InvoicePrint border-top border-2 border-black"></div>
          </div>
          <div className="col-9">
            <div className="d-flex border-bottom border-black border-2 p-1">
              <div className="col-6">
                <p className="fw-bold">DETAIL	</p>
              </div>
              <div className="col-3">
                <p className="fw-bold">WEIGHT	</p>
              </div>
              <div className="col-2">
                <p className="fw-bold">
                  RATE
                </p>
              </div>
              <div className="col-2">
                <p className="fw-bold">
                  AMOUNT
                </p>
              </div>
            </div>
            <div className="minHieght150InvoicePrint">
              {data.length > 0 && data.map((e, i) => {
                return <div className="d-flex px-1" key={i}>{console.log(e)}
                  <div className="col-6">
                    <p className="fw-bold">{e?.MasterManagement_DiamondStoneTypeid === 4 ? (e?.ShapeName+" "+e?.QualityName) : e?.MasterManagement_DiamondStoneTypeName}</p>
                  </div>
                  <div className="col-3">
                    <p className="fw-bold">{(e?.Wt).toFixed(3)}</p>
                  </div>
                  <div className="col-2">
                    <p className="fw-bold">
                    {(e?.Rate).toFixed(3)}
                    </p>
                  </div>
                  <div className="col-2">
                    <p className="fw-bold">
                    {(e?.Amount).toFixed(3)}
                    </p>
                  </div>
                </div>
              })}
            </div>
            <div className="minHieght28InvoicePrint d-flex justify-content-between align-items-center p-1 border-top border-black border-2">
              <p className='fw-bold'>Total</p>
              <p>0.00</p>
            </div>
          </div>
        </div>
      </div>
      {/* cgst */}
      <div className="pb-2 d-flex justify-content-end no_break">
        <div className="col-12 border-2 border-black border">
          <div className="d-flex p-1 justify-content-between p-1 minHeight100InvoicePrint">
            <p>IGST </p>
            <p>@ 0.00%	0</p>
          </div>
          <div className="d-flex justify-content-between p-1 border-top border-2 border-black">
            <p className='fw-bold'>Grand Total </p>
            <p>0.00</p>
          </div>
        </div>
      </div>
      {/* total price in text */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className="fw-bold">Rs.Zero Only.</p>
        </div>
      </div>
      {/* note */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className='fw-bold'>NOTE :</p>
          <p dangerouslySetInnerHTML={{ __html: json0?.Declaration }}></p>
        </div>
      </div>
      {/* company details */}
      <div className="pb-2 no_break">
        <div className="border border-2 border-black p-1">
          <p className="fw-bold">COMPANY DETAILS :</p>
          <p>GSTIN. : {json0?.Cust_CST_STATE_No}</p>
          <p>{json0?.Cust_CST_STATE} : {json0?.Cust_CST_STATE_No}</p>
          <p>PAN NO. : EDJHF236D</p>
          <p>Kindly make your payment by the name of "Orail"</p>
          <p>Payable at ST (GJ) by cheque or DD</p>
          <p>Bank Detail : Bank Account No -</p>
          <p>{json0?.bankname} {json0?.bankaddress}</p>
          <p>RTGS/NEFT IFSC : -{json0?.rtgs_neft_ifsc}</p>
        </div>
      </div>
      {/* authorised amigos */}
      <div className="pb-2 d-flex justify-content-between no_break">
        <div className="w-50 pe-1">
          <div className="border border-2 border-black d-flex justify-content-center minHieght138InvoicePrint">
            <p className='fw-bold'> AUTHORISED, Amigos</p>
          </div>
        </div>
        <div className="w-50 ps-1">
          <div className="border border-2 border-black d-flex justify-content-center minHieght138InvoicePrint">
            <p className='fw-bold'>AUTHORISED, ORAIL SERVICE</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePrint;