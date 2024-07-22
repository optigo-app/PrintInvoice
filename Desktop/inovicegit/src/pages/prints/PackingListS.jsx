import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, checkMsg, formatAmount, handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import "../../assets/css/prints/packinglists.css";
import Button from './../../GlobalFunctions/Button';

const PackingListS = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
 
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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
        //   setMsg(data?.Message);
        const err = checkMsg(data?.Message);
        console.log(data?.Message);
        setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      setResult(datas);
  }

  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  return (
    <>
    { loader ? <Loader /> : msg === '' ? <div>
        <div className='container_pcls'>
            <div className=' d-flex align-items-center justify-content-end my-5'>
                <div className='px-2'>
                    <input type="checkbox" onChange={handleImgShow} value={imgFlag} checked={imgFlag} id='imgshow' />
                    <label htmlFor="imgshow" className='user-select-none mx-1'>With Image</label>
                </div>
                <div>
                    <Button />
                </div>
            </div>
            <div className='headText_pcls'>
                 {result?.header?.PrintHeadLabel ?? 'PACKING LIST'} 
            </div>
            {/* comapny header */}
            <div className='d-flex justify-content-between align-items-center px-1'>
                <div>
                    <div className='fs_16_pcls fw-bold py-1'>{result?.header?.CompanyFullName}</div>
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyAddress2}</div>
                    <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode},{result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                    <div>T {result?.header?.CompanyTellNo}</div>
                    <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                    <div>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE} - {result?.header?.Company_CST_STATE_No} | PAN - {result?.header?.Com_pannumber}</div>
                </div>
                <div>
                    { isImageWorking && <img src={result?.header?.PrintLogo} alt="#companylogo" className='companylogo_pcls' onError={handleImageErrors} />}
                </div>
            </div>
            {/* customer header */}
            <div className='d-flex  mt-1 brall_pcls brall_pcls'>
                <div className='bright_pcls p-1' style={{width:'35%'}}>
                    <div>Bill To,</div>
                    <div className='fs_14_pcls fw-bold'>{result?.header?.customerfirmname}</div>
                    <div>{result?.header?.customerAddress2}</div>
                    <div>{result?.header?.customerAddress1}</div>
                    <div>{result?.header?.customercity1}{result?.header?.customerpincode}</div>
                    <div>{result?.header?.customeremail1}</div>
                    <div>{result?.header?.vat_cst_pan}</div>
                    <div>{result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
                </div>
                <div className='bright_pcls p-1' style={{width:'35%'}}>
                    <div>Ship To,</div>
                    <div className='fs_14_pcls fw-bold'>{result?.header?.customerfirmname}</div>
                    <div>{result?.header?.CustName}</div>
                    <div>{result?.header?.customercity}</div>
                    <div>{result?.header?.customercountry}{result?.header?.customerpincode}</div>
                    <div>Mobile No : {result?.header?.customermobileno}</div>
                </div>
                <div className='p-1' style={{width:'30%'}}>
                    <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls'>BILL NO </div><div>{result?.header?.InvoiceNo}</div></div>
                    <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls'>DATE </div><div>{result?.header?.EntryDate}</div></div>
                    <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls'>{result?.header?.HSN_No_Label} </div><div>{result?.header?.HSN_No}</div></div>
                </div>
            </div>
            <div className='mt-1 border border-black'>
                {/* table head */}
                <div className='d-flex thead_pcls bbottom_pcls'>
                    <div className='col1_pcls centerall_pcls bright_pcls'>Sr</div>
                    <div className='col2_pcls centerall_pcls bright_pcls'>Design</div>
                    <div className='col3_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Diamond</div>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls bright_pcls'>Code</div>
                            <div className='dcol2_pcls centerall_pcls bright_pcls'>Size</div>
                            <div className='dcol3_pcls centerall_pcls bright_pcls'>Pcs</div>
                            <div className='dcol4_pcls centerall_pcls bright_pcls'>Wt</div>
                            <div className='dcol5_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='dcol6_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col4_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Metal</div>
                        <div className='d-flex w-100'>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Quality</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Gwt</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>N + L</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='mcol1_pcls centerall_pcls '>Amount</div>
                        </div>
                    </div>
                    <div className='col5_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Stone & Misc</div>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls bright_pcls'>Code</div>
                            <div className='dcol2_pcls centerall_pcls bright_pcls'>Size</div>
                            <div className='dcol3_pcls centerall_pcls bright_pcls'>Pcs</div>
                            <div className='dcol4_pcls centerall_pcls bright_pcls'>Wt</div>
                            <div className='dcol5_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='dcol6_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col6_pcls bright_pcls'>
                        <div className='centerall_pcls w-100 bbottom_pcls'>Labour & Other Charges</div>
                        <div className='d-flex w-100'>
                            <div className='lcol1_pcls centerall_pcls bright_pcls'>Charges</div>
                            <div className='lcol1_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='lcol1_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col7_pcls centerall_pcls'>Total Amount</div>
                </div>
                {/* table rows */}
                {
                    result?.resultArray?.map((e, i) => {
                        return (
                            <div className='d-flex tbody_pcls bbottom_pcls'>
                                <div className='col1_pcls centerall_pcls bright_pcls'>{i+1}</div>
                                <div className='col2_pcls centerall_pcls flex-column bright_pcls'>
                                    <div className='d-flex flex-wrap justify-content-between align-items-center w-100 text-break'>
                                        <div>{e?.designno}</div>
                                        <div>{e?.SrJobno}</div>
                                    </div>
                                    <div className='d-flex flex-wrap justify-content-end w-100 text-break'>{e?.MetalColor}</div>
                                    <div>
                                        <img src={e?.DesignImage} alt="#desimg" className='designimg_pcls' onError={handleImageError} />
                                    </div>
                                    { e?.CertificateNo !== '' && <div className='centerall_pcls text-break w-100'>Certificate# : {e?.CertificateNo}</div>}
                                    { e?.HUID !== '' && <div className='centerall_pcls w-100 text-break'>HUID : <span className='fw-bold'>{e?.HUID}</span></div>}
                                    { e?.PO !== '' && <div className='centerall_pcls w-100 fw-bold text-break'>PO : {e?.PO}</div>}
                                    { e?.lineid !== '' && <div className='centerall_pcls w-100 text-break'>{e?.lineid}</div>}
                                    { e?.Tunch !== '' && <div className='centerall_pcls w-100 text-break'>Tunch : <span className='fw-bold'>{e?.Tunch?.toFixed(3)}</span></div>}
                                    { e?.grosswt !== '' && <div className='centerall_pcls w-100 text-break'><span className='fw-bold'>{e?.grosswt?.toFixed(3) + "gm"}</span> Gross</div>}
                                    { e?.Size !== '' && <div className='centerall_pcls w-100 text-break'><span className='fw-bold'>Size : {e?.Size}</span></div>}
                                </div>

                                <div className='col3_pcls d-flex flex-column justify-content-between bright_pcls'>
                                    <div>
                                    {
                                        e?.diamonds?.map((el, ind) => {
                                            return (
                                                <div className='d-flex w-100' key={ind}>
                                                    <div className='dcol1_pcls centerall_pcls'>{el?.ShapeName}</div>
                                                    <div className='dcol2_pcls centerall_pcls'>{el?.SizeName}</div>
                                                    <div className='dcol3_pcls centerall_pcls'>{el?.Pcs}</div>
                                                    <div className='dcol4_pcls centerall_pcls'>{el?.Wt?.toFixed(3)}</div>
                                                    <div className='dcol5_pcls centerall_pcls'>{el?.Rate}</div>
                                                    <div className='dcol6_pcls centerall_pcls'>{formatAmount(el?.Amount)}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                                <div className='d-flex w-100'>
                                                    <div className='dcol1_pcls centerall_pcls'></div>
                                                    <div className='dcol2_pcls centerall_pcls'></div>
                                                    <div className='dcol3_pcls centerall_pcls'>{e?.totals?.diamonds?.Pcs}</div>
                                                    <div className='dcol4_pcls centerall_pcls'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                                    <div className='dcol5_pcls centerall_pcls'></div>
                                                    <div className='dcol6_pcls centerall_pcls'>{formatAmount(e?.totals?.diamonds?.Amount)}</div>
                                                </div>
                                </div>

                                <div className='col4_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                  <div>
                                  {
                                    e?.metal?.map((el, ind) => {
                                        return (
                                            <div className='d-flex w-100' key={ind}>
                                                <div className='mcol1_pcls centerall_pcls'>{el?.QualityName}</div>
                                                <div className='mcol1_pcls centerall_pcls'>{e?.grosswt?.toFixed(3)}</div>
                                                <div className='mcol1_pcls centerall_pcls'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                                <div className='mcol1_pcls centerall_pcls'>{el?.Rate}</div>
                                                <div className='mcol1_pcls centerall_pcls'>{formatAmount(el?.Amount)}</div>
                                            </div>
                                        )
                                    })
                                   }
                                  </div>
                                            <div className='d-flex w-100'>
                                                <div className='mcol1_pcls centerall_pcls'></div>
                                                <div className='mcol1_pcls centerall_pcls'>{e?.grosswt?.toFixed(3)}</div>
                                                <div className='mcol1_pcls centerall_pcls'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                                <div className='mcol1_pcls centerall_pcls'></div>
                                                <div className='mcol1_pcls centerall_pcls'>{formatAmount(e?.totals?.metal?.Amount)}</div>
                                            </div>
                                </div>

                                <div className='col5_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                   <div>
                                   {
                                        e?.colorstone?.map((el, ind) => {
                                            return (
                                                <div className='d-flex w-100' key={ind}>
                                                    <div className='dcol1_pcls centerall_pcls'>{el?.ShapeName}</div>
                                                    <div className='dcol2_pcls centerall_pcls'>{el?.SizeName}</div>
                                                    <div className='dcol3_pcls centerall_pcls'>{el?.Pcs}</div>
                                                    <div className='dcol4_pcls centerall_pcls'>{el?.Wt?.toFixed(3)}</div>
                                                    <div className='dcol5_pcls centerall_pcls'>{el?.Rate}</div>
                                                    <div className='dcol6_pcls centerall_pcls'>{formatAmount(el?.Amount)}</div>
                                                </div>
                                            )
                                        })
                                    }
                                   </div>
                                                <div className='d-flex w-100'>
                                                    <div className='dcol1_pcls centerall_pcls'></div>
                                                    <div className='dcol2_pcls centerall_pcls'></div>
                                                    <div className='dcol3_pcls centerall_pcls'>{e?.totals?.colorstone?.Pcs}</div>
                                                    <div className='dcol4_pcls centerall_pcls'>{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                                                    <div className='dcol5_pcls centerall_pcls'></div>
                                                    <div className='dcol6_pcls centerall_pcls'>{formatAmount( e?.totals?.colorstone?.Amount)}</div>
                                                </div>
                                </div>

                                <div className='col6_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                    <div>
                                        <div className='d-flex w-100'>
                                            <div className='lcol1_pcls centerall_pcls'>Charges</div>
                                            <div className='lcol1_pcls centerall_pcls'>Rate</div>
                                            <div className='lcol1_pcls centerall_pcls'>Amount</div>
                                        </div>
                                    </div>
                                        <div className='d-flex w-100'>
                                            <div className='lcol1_pcls centerall_pcls'>Charges</div>
                                            <div className='lcol1_pcls centerall_pcls'>Rate</div>
                                            <div className='lcol1_pcls centerall_pcls'>Amount</div>
                                        </div>
                                </div>

                                <div className='col7_pcls   d-flex flex-column justify-content-between'>
                                    <div className='start_pcls'>{formatAmount(e?.TotalAmount)}</div>
                                    <div className='start_pcls'>{formatAmount(e?.TotalAmount)}</div>
                                </div>
                                
                            </div>
                        )
                    })
                }
                {/* main total */}
                <div className='d-flex thead_pcls bbottom_pcls'>
                    <div className='col1_pcls centerall_pcls bright_pcls'></div>
                    <div className='col2_pcls centerall_pcls bright_pcls'></div>
                    <div className='col3_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls bright_pcls'></div>
                            <div className='dcol2_pcls centerall_pcls bright_pcls'></div>
                            <div className='dcol3_pcls centerall_pcls bright_pcls'>Pcs</div>
                            <div className='dcol4_pcls centerall_pcls bright_pcls'>Wt</div>
                            <div className='dcol5_pcls centerall_pcls bright_pcls'></div>
                            <div className='dcol6_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col4_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'></div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Gwt</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>N + L</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'></div>
                            <div className='mcol1_pcls centerall_pcls '>Amount</div>
                        </div>
                    </div>
                    <div className='col5_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls bright_pcls'></div>
                            <div className='dcol2_pcls centerall_pcls bright_pcls'></div>
                            <div className='dcol3_pcls centerall_pcls bright_pcls'>Pcs</div>
                            <div className='dcol4_pcls centerall_pcls bright_pcls'>Wt</div>
                            <div className='dcol5_pcls centerall_pcls bright_pcls'></div>
                            <div className='dcol6_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col6_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='lcol1_pcls centerall_pcls bright_pcls'>Charges</div>
                            <div className='lcol1_pcls centerall_pcls bright_pcls'></div>
                            <div className='lcol1_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col7_pcls centerall_pcls'>Total Amount</div>
                </div>
            </div>
        </div>
    </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p> }
    </>
  )
}

export default PackingListS;