import React, { useEffect, useState } from 'react'
import "../../assets/css/prints/detailprint6.css";
import { ToWords } from "to-words";
import { apiCall, formatAmount, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep, toLower } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
const DetailPrint6 = ({ token, invoiceNo, printName, urls, evn }) => {

  const toWords = new ToWords();
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [alltotal, setAllTotal] = useState(0);
  const [mcompany, setMcompany] = useState({
    m_Pcs: 0,
    m_Wt:0,
  })
  const [imgFlag, setImgFlag] = useState(true);

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === "200") {
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
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    const copydata = cloneDeep(data);

    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );
    setResult(datas);
    let TOT = 0;
    datas?.resultArray?.forEach((e) => {
      e?.metal?.forEach((e) => {
        TOT += e?.Amount;
      })
      e?.diamond_colorstone_misc?.forEach((e) => {
        TOT += e?.Amount;
      })
    })
    let obj = {
      m_Pcs:0,
      m_Wt:0
    }
    datas?.json2?.forEach((e) => {
      if(e?.MasterManagement_DiamondStoneTypeid === 3){
        if(e?.ShapeName === "Hallmark" || e?.ShapeName === "Stamping") return ''
        else{
          if(e?.Supplier === "Company"){
            if(e?.ShapeName?.includes("Certification") && e?.Wt === 0) return ''
            else{
              obj.m_Pcs += e?.Pcs;
              obj.m_Wt += e?.Wt;
            }
          }
        }
      }
    })
    setMcompany(obj);
    setAllTotal(TOT);
  }
  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };

  return (
      <>
      {
        loader ? <Loader /> : <>
        {
          msg === '' ? <div>
          <div className='container_dp6'>
            <div className='d-flex justify-content-end align-items-center mt-5 mb-5 px-2 d_none_dp6'>
            <input
                    type="checkbox"
                    checked={imgFlag}
                    id="showImg"
                    onChange={handleImgShow}
                    className="mx-2"
                  />
                  <label htmlFor="showImg" className="me-2 user-select-none">
                    With Image
                  </label>
                  <button
                    className="btn_white blue m-0 "
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button>
            </div>
            <div>
              <div className='headlabel_dp6'>{result?.header?.PrintHeadLabel}</div>
              <div className='d-flex flex-column justify-content-center align-items-center p-1 fs_dp6'>
                <div><img src={result?.header?.PrintLogo} alt="#companylogo" className='printlogo_dp6' /></div>
                <div className='fw-bold'>{result?.header?.CompanyFullName}</div>
                <div>{result?.header?.CompanyAddress}</div>
                <div>{result?.header?.CompanyAddress2}</div>
                <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}, {result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                <div>T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo}</div>
                <div>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Com_pannumber}</div>
                <div>CIN: {result?.header?.CINNO} | MSME: {result?.header?.MSME}</div>
                <div className='fw-bold'>Tax Invoice for Supply of Goods Issued u/section 31(1) of CGST ACT ,2017</div>
              </div>
            </div>
            <div className='d-flex border fs_dp6'>
              <div className='p-1 w-25 border-end'>    
                  <div>To,</div>
                  <div className='fw-bold'>{result?.header?.customerfirmname}</div>
                  <div>{result?.header?.customerAddress1}</div>
                  <div>{result?.header?.customerAddress2}</div>
                  <div>{result?.header?.customercity}{result?.header?.customerpincode}</div>
                  <div>{result?.header?.customeremail1}</div>
                  <div>{result?.header?.vat_cst_pan}</div>
                  <div>{result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
              </div>
              <div className='p-1 w-25 border-end'>             	
                  <div>Ship To,</div>
                  <div className='fw-bold'>{result?.header?.customerfirmname}</div>
                  <div>{result?.header?.CustName}</div>
                  <div>{result?.header?.customercity}, {result?.header?.customerstate}</div>
                  <div>{result?.header?.customercountry}{result?.header?.customerpincode}</div>
                  <div>Mobile No : {result?.header?.customermobileno}</div>
              </div>
              <div className='p-1 w-25 border-end'>
                  <div className='d-flex justify-content-between pe-3'><div className='fw-bold'>INVOICE NO</div><div>{result?.header?.InvoiceNo}</div></div>
                  <div className='d-flex justify-content-between pe-3'><div className='fw-bold'>DATE</div><div>{result?.header?.EntryDate}</div></div>
                  <div className='fw-bold'>Delivery Mode</div>
              </div>
              <div className='p-1 w-25'>
                  <div>E Way Bill No:	</div>
                  <div className='w-100 d-flex'><div className='w-50'>PAN:</div>	<div className='w-50'>{result?.header?.CustPanno}</div></div>
                  <div>Advance Receipt No:	</div>
                  <div>Name of Trasporter:	</div>
                  <div>Vehical No:	</div>
                  <div>freight terms:	</div>
                  <div>E reference No:	</div>
                  <div>Credit Days:	</div>
                  <div>Output Types:	</div>
                  <div>Product Types:	</div>
                  <div className='w-100 d-flex'><div className='w-50'>{result?.header?.HSN_No_Label}:</div>	<div className='w-50'>{result?.header?.HSN_No}</div></div>
              </div>
            </div>
            <div className='fs_dp6'>
              <div className='fw-bold d-flex mt-2 border'>
                <div className='col1_dp6 d-flex justify-content-center align-items-center border-end'>Sr#</div>
                <div className='col2_dp6 d-flex justify-content-center align-items-center border-end'>Design</div>
                <div className='col3_dp6 d-flex flex-column justify-content-center align-items-center border-end'>
                  <div className='border-bottom d-flex justify-content-center align-items-center w-100 p-1'>Material Description</div>
                  <div className='d-flex w-100'>
                    <div className='col3_dp6_1 d-flex justify-content-center align-items-center border-end p-1'>Material</div>
                    <div className='col3_dp6_2 d-flex justify-content-center align-items-center border-end p-1'>Shape</div>
                    <div className='col3_dp6_3 d-flex justify-content-center align-items-center border-end p-1'>Qlty</div>	
                    <div className='col3_dp6_4 d-flex justify-content-center align-items-center border-end p-1'>Color</div>	
                    <div className='col3_dp6_5 d-flex justify-content-center align-items-center border-end p-1'>Size</div>	
                    <div className='col3_dp6_6 d-flex justify-content-center align-items-center border-end p-1'>Pcs</div>
                    <div className='col3_dp6_7 d-flex justify-content-center align-items-center border-end p-1'>Wt./Ctw.</div>
                    <div className='col3_dp6_8 d-flex justify-content-center align-items-center border-end p-1'>Rate</div>
                    <div className='col3_dp6_9 d-flex justify-content-center align-items-center p-1'>Amount</div>
                  </div>
                </div>
                <div className='col4_dp6 d-flex justify-content-center align-items-center border-end'>Qty</div>
                <div className='col5_dp6 d-flex justify-content-center align-items-center border-end'>Other</div>
                <div className='col6_dp6 d-flex flex-column justify-content-center align-items-center border-end'><div className='d-flex justify-content-center align-items-center border-bottom w-100 h-50'>Labour</div>
                <div className='d-flex w-100 h-50'><div className='w-50 border-end d-flex justify-content-center align-items-center'>Rate</div><div className='w-50 d-flex justify-content-center align-items-center'>Amt</div></div>
                </div>
                <div className='col7_dp6 d-flex justify-content-center align-items-center'>Amount</div>
              </div>
              <div>

                {
                  result?.resultArray?.map((e, i) => {
                    return(
                      <div className='d-flex border border-top-0 pbia_dp6' key={i}>
                      <div className='col1_dp6_tb d-flex justify-content-center align-items-center  border-end'>{i+1}</div>
                      <div className='col2_dp6_tb border-end'>
                        <div className='d-flex w-100 '>
                          <div className='w-50 center_dp6'>{e?.designno}</div>
                          <div className='w-50 center_dp6'>{e?.SrJobno}</div>
                        </div>
                        { imgFlag ? <div className='d-flex justify-content-center align-items-center'><img src={e?.DesignImage} alt="#designimg" className='design_img_dp6' onError={(e) => handleImageError(e)} /></div> : '' } 
                        <div className='d-flex justify-content-center align-items-center fs_dp6'>PO: <b className='fs_dp6'>{e?.PO}</b></div>
                        { e?.HUID === '' ? '' : <div className='d-flex justify-content-center align-items-center'>HUID: {e?.HUID}</div> } 
                        <div className='d-flex justify-content-center align-items-center fw-bold'>{e?.grosswt?.toFixed(3)} Gross</div>
                      </div>
                      <div className='col3_dp6_tb border-end w-50 d-grid'>
                              <div className='d-flex border-bottom w-100'>
                                <div className='border-end col3_dp6_1 pad_st_dp6' >{e?.MetalType}</div>
                                <div className='border-end col3_dp6_2' ></div>
                                <div className='border-end col3_dp6_3 pad_st_dp6' >{e?.MetalPurity}</div>
                                <div className='border-end col3_dp6_4 pad_st_dp6' >{e?.MetalColor}</div>
                                <div className='border-end col3_dp6_5' ></div>
                                <div className='border-end col3_dp6_6' ></div>
                                <div className='border-end col3_dp6_7 end_dp6' >{e?.MetalDiaWt?.toFixed(3)}</div>
                                <div className='border-end col3_dp6_8' >
                                  {
                                    e?.metal?.map((el, ind) => {
                                      return(
                                        <div className='end_dp6 pad_end_dp6 h-100' key={ind}>{formatAmount(el?.Rate)}</div>
                                      )
                                    })
                                  }
                                </div>
                                <div className='col3_dp6_9' >
                                {
                                    e?.metal?.map((el, ind) => {
                                      return(
                                        <div className='end_dp6 pad_end_dp6 h-100' key={ind}>{formatAmount(el?.Amount)}</div>
                                      )
                                    })
                                  }
                                </div>
                              </div>
                        {
                          e?.diamond_colorstone_misc?.map((el, i) => {
                            return(
                              <div className='d-flex border-bottom w-100' key={i}>
                                <div className='border-end col3_dp6_1 pad_st_dp6' >{el?.MasterManagement_DiamondStoneTypeName}</div>
                                <div className='border-end col3_dp6_2 pad_st_dp6' >{el?.ShapeName}</div>
                                <div className='border-end col3_dp6_3 pad_st_dp6' >{el?.QualityName}</div>
                                <div className='border-end col3_dp6_4 pad_st_dp6' >{el?.Colorname}</div>
                                <div className='border-end col3_dp6_5 pad_st_dp6' >{el?.SizeName}</div>
                                <div className='border-end col3_dp6_6 end_dp6 pad_end_dp6' >{el?.Pcs}</div>
                                <div className='border-end col3_dp6_7 end_dp6 pad_end_dp6' >{el?.Wt?.toFixed(3)}</div>
                                <div className='border-end col3_dp6_8 end_dp6 pad_end_dp6' >{formatAmount(el?.Rate)}</div>
                                <div className='col3_dp6_9 end_dp6 pad_end_dp6' >{formatAmount(el?.Amount)}</div>
                              </div>
                            )
                          })
                        }
                        
                      </div>
                      <div className='col12_dp6_tb border-end end_dp6 pad_end_dp6'>{e?.Quantity}</div>
                      <div className='col13_dp6_tb border-end end_dp6 pad_end_dp6'>{formatAmount((e?.TotalDiamondHandling + e?.OtherCharges)) }</div>
                      <div className='col14_dp6_tb border-end end_dp6 pad_end_dp6'>{formatAmount(e?.MaKingCharge_Unit)}</div>
                      <div className='col15_dp6_tb border-end end_dp6 pad_end_dp6'>{formatAmount((e?.MakingAmount + e?.TotalDiaSetcost))}</div>
                      <div className='col16_dp6_tb end_dp6 pad_end_dp6'>{formatAmount(e?.TotalAmount)}</div>
                      </div>
                    )
                  })
                }
                
              </div>
              <div className='d-flex justify-content-end pad_end_dp6 border-start border-end p-1 pbia_dp6'>{formatAmount(result?.mainTotal?.total_amount)}</div>
              <div className='d-flex justify-content-end border'>
                  <div className='w-25 d-flex border-start pbia_dp6'>
                    <div className='w-50 end_dp6 pad_end_dp6 border-end p-1'>Freight Chagres</div>
                    <div className='w-50 end_dp6 pad_end_dp6 p-1'>{formatAmount(result?.header?.FreightCharges)}</div>
                  </div>
              </div>
              <div className='d-flex border border-top-0 pbia_dp6'>
                <div className='w-75'>
                      {
                        result?.allTaxes?.map((e,i) => {
                          return(
                            <div className='d-flex pad_st_dp6' key={i}>{e?.amountInWords}</div>
                          )
                        })
                      }
                </div>
                <div className='w-25 border-start pbia_dp6'>
                  {
                    result?.allTaxes?.map((e,i) => {
                      return(
                          <div className='d-flex' key={i}>
                            <div className='w-50 end_dp6 pad_end_dp6 border-end'>{e?.name}</div>
                            <div className='w-50 end_dp6 pad_end_dp6'>{e?.amount}</div>
                          </div>
                          )
                        })
                      }
                      <div className='d-flex'>
                            <div className='w-50 end_dp6 pad_end_dp6 border-end'>Sales Rounded Off</div>
                            <div className='w-50 end_dp6 pad_end_dp6'>{formatAmount(result?.header?.AddLess)}</div>
                          </div>
                  </div>
              </div>
              <div className='d-flex border-start border-end border-bottom pbia_dp6'>
                <div className='border-end col1_dp6 '>Total</div>
                <div className='border-end col2_dp6' style={{width:'34%'}}></div>
                <div className='border-end p-1' style={{width:'21%'}}>
                      <div>Qty: {result?.mainTotal?.total_Quantity}</div>
                      <div>D: Company : {result?.mainTotal?.diamonds?.Pcs}/{result?.mainTotal?.diamonds?.Wt?.toFixed(3)} Ctw</div>
                      <div>C: Company : {result?.mainTotal?.colorstone?.Pcs}/{result?.mainTotal?.colorstone?.Wt?.toFixed(3)} Ctw</div>
                      <div>M: Company : {mcompany?.m_Pcs}/{mcompany?.m_Wt?.toFixed(3)} Wt</div>
                      <div>Wt: {result?.mainTotal?.netwtWithLossWt?.toFixed(3)}</div>
                      <div>Ctw: { (result?.mainTotal?.diamonds?.Wt + result?.mainTotal?.colorstone?.Wt)?.toFixed(3) }</div>
                </div>
                <div className='border-end fw-bold center_dp6 p-1' style={{width:'8%'}}>{formatAmount(alltotal)}</div>
                <div className='border-end fw-bold center_dp6 p-1' style={{width:'8%'}}>{result?.mainTotal?.total_Quantity}</div>
                <div className='border-end fw-bold center_dp6 p-1' style={{width:'8%'}}>{formatAmount((result?.mainTotal?.total_diamondHandling + result?.mainTotal?.total_other_charges))}</div>
                <div className='border-end fw-bold center_dp6 p-1' style={{width:'8%'}}>{formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}</div>
                <div className='fw-bold center_dp6 p-1' style={{width:'10%'}}>₹ {formatAmount((result?.finalAmount + result?.header?.FreightCharges))}</div>
              </div>
              <div className='d-flex border border-top-0 pbia_dp6'>
                <div className='border-end col1_dp6 center_dp6' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></div>
                <div className='fw-bold p-1'>{toWords?.convert((result?.finalAmount + result?.header?.FreightCharges))}</div>
              </div>
              <div className='p-1 border border-top-0 pbia_dp6 fs_dp6' dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
              <div className='border p-1 border-top-0 pbia_dp6'><b className='fs_dp6'>REMARKS:</b>&nbsp; {result?.header?.PrintRemark}</div>
              <div className='d-flex border border-top-0 pbia_dp6'>
                <div className='w_dp6_f border-end p-1'>
                  <div className='fw-bold'>Bank Detail</div>
                  <div>Bank Name: {result?.header?.bankname}</div>
                  <div>Branch: {result?.header?.bankaddress}</div>
                  <div>Account Name: {result?.header?.accountname}</div>
                  <div>Account No. : {result?.header?.accountnumber}</div>
                  <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
                  <div>Enquiry No. (E & OE)</div>
                </div>
                <div className='w_dp6_f d-flex flex-column justify-content-between border-end p-1 '>
                  <div>Signature</div>
                  <div className='fw-bold'>{result?.header?.customerfirmname}</div>
                </div>
                <div className='w_dp6_f d-flex flex-column justify-content-between p-1'>
                  <div>Signature</div>
                  <div className='fw-bold'>{result?.header?.CompanyFullName}</div>
                </div>
              </div>
            </div>
          </div>
        </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
        }
        </>
      }
      </>
  )
}

export default DetailPrint6
