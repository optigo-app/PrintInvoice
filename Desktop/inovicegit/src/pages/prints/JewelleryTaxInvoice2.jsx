import React from 'react'
import "../../assets/css/prints/jewellerytaxinvoice2.css"
import { useState } from 'react';
import { useEffect } from 'react';
import { apiCall, formatAmount, handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import Button from '../../GlobalFunctions/Button';
const JewelleryTaxInvoice2 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const [purityWise, setPurityWise] = useState([]);
      
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

            
    let invpaydet = [];

    let abc = datas?.header?.InvPayDet?.split("@-@");
    let newarr = [];
    abc?.forEach((item) => {
        let val = item?.toLowerCase();
        let obj = {};
        let doc_no;
        if(val?.includes("cash") && val?.includes("-##-")){
            let amtby = val?.split("-##-")[0];
            let name = amtby?.split("#")[0];
            obj.name = name;
            let amtby1 = val?.split("-##-")[1];
            let cashamt = amtby1?.split("#")[1];
            obj.amount = Number(cashamt);
            obj.docno = '';
            invpaydet.push(obj);
        }
        if(val?.includes("discount") && val?.includes("-##-")){
            let amtby = val?.split("-##-")[0];
            let name = amtby?.split("#")[0];
            obj.name = name;
            let amtby1 = val?.split("-##-")[1];
            let cashamt = amtby1?.split("#")[1];
            obj.amount = Number(cashamt);
            obj.docno = '';
            invpaydet.push(obj);
        }
        if(val?.includes("cheque") && val?.includes("#-#")){
            let name = val?.split("#-#")[0];
            let docno = val?.split("#-#")[1];
            let amt = val?.split("#-#")[2];
            obj.name = name;
            obj.docno = docno;
            obj.amount = amt;
            doc_no = docno;
            invpaydet.push(obj);
        }
        if(val?.includes("discount")){
            if(val?.includes("-##-")){
                return
            }else{
                newarr.push(val)
            }
        }
        
    })
    let disarr = [];
    newarr?.forEach((e) => {
        let val = e?.toLowerCase();
        let obj = {};
        if(val?.includes("#-#")){
            let name = e?.split("#-#")[0];
            let docno = e?.split("#-#")[1];
            let amount = e?.split("#-#")[2];
            obj.name = name;
            obj.docno = docno;
            obj.amount = amount;
            disarr.push(obj);
        }
    })
    
    let mainarr = [...invpaydet, ...disarr];
    datas.header.mainarr = mainarr;

    let totalAmt = 0;

    mainarr?.forEach((e) => {
        totalAmt += (+e?.amount);
    })

    datas.header.maindistotal = totalAmt;

          setResult(datas);
  
          let pwise = [];
  
          datas?.resultArray?.forEach((el) => {
              let findRec = pwise?.findIndex((a) => a?.MetalTypePurity === el?.MetalTypePurity)
              if(findRec === -1){
                  pwise.push(el);
              }else{
                  pwise[findRec].grosswt += el?.grosswt;
                  pwise[findRec].NetWt += el?.NetWt;
                  pwise[findRec].LossWt += el?.LossWt;
              }
          })
          setPurityWise(pwise);
      }
  
      const handleImageErrors = () => {
        setIsImageWorking(false);
      };
  
      console.log(result);
  return (
    <>
        {
            loader ? <Loader /> : <>
            {
                msg === '' ? <>
                <div className='container_jti2'>
                    <div className='mb-5 pb-5 d-flex justify-content-end align-items-center mt-5 pt-5 d_none_jti2'><Button /></div>
                    <div className='text-center text-decoration-underline fs_head_jti2 text-break'>{result?.header?.PrintHeadLabel}</div>
                    <div className='border p-2 d-flex justify-content-between align-items-center pbia_jti2'>
                        <div className='fs_jti2 text-break'>
                        <div>To,</div>
                        <div className='fs2_jti2 fw-bold'>{result?.header?.customerfirmname}</div>
                        <div>{result?.header?.customerstreet}</div>
                        <div>{result?.header?.customerregion}</div>
                        <div>{result?.header?.customercity} {result?.header?.customerpincode}</div>
                        <div>Tel : {result?.header?.customermobileno}</div>
                        <div>{result?.header?.customeremail1}</div>
                        </div>
                        <div className='fs_jti2 pe-5 text-break'>
                        <div>Invoice#: <span className='fw-bold'>{result?.header?.InvoiceNo}</span> Dated <span className='fw-bold text-break'>{result?.header?.EntryDate}</span></div>
                        {/* <div>{result?.header?.HSN_No_Label}: <span className='fw-bold'>{result?.header?.HSN_No}</span></div> */}
                        <div>PAN#: <span className='fw-bold'>{result?.header?.CustPanno}</span></div>
                        <div>VAT <span className='fw-bold text-break'>{result?.header?.Cust_VAT_GST_No}</span>| {result?.header?.Cust_CST_STATE} <span className='fw-bold'>{result?.header?.Cust_CST_STATE_No}</span></div>
                        <div>Due Date: <span className='fw-bold'>{result?.header?.DueDate}</span></div>
                        <div><div>Salesrep:</div><div></div></div>
                        </div>
                    </div>
                    <div>
                        <div className='d-flex thead_jti2'>
                            <div className='col1_jti2 center_jti2 brr_jti2'>SR NO</div>
                            <div className='col2_jti2 center_jti2 brr_jti2'>ITEMCODE</div>
                            <div className='col3_jti2 center_jti2 brr_jti2'>DESCRIPTION</div>
                            <div className='col4_jti2 center_jti2 brr_jti2'>IMAGE</div>
                            <div className='col5_jti2 center_jti2'>AMOUNT (USD)</div>
                        </div>
                        <div>
                            {
                                result?.resultArray?.map((a, i) => {
                                    return <div className='d-flex brr_jti2 brl_jti2 brb_jti2 fs_jti2 pbia_jti2 text-break' key={i}>
                                    <div className='col1_jti2 center_jti2 align-items-start brr_jti2'>{i+1}</div>
                                    <div className='col2_jti2 center_jti2 brr_jti2 d-flex flex-column p-1 justify-content-start align-items-start ps-1'>
                                        <div className='text-break'>Job: {a?.SrJobno}</div>
                                        <div className='text-break'>Design: <span className='fw-bold fs_jti2 text-break'>{a?.designno}</span></div>
                                        <div className='text-break'>{a?.Size}</div>
                                    </div>
                                    <div className='col3_jti2 start_jti2 align-items-start flex-column  brr_jti2 text-break'>
                                        <div className='p-1 text-break'>
                                            {a?.MetalTypePurity} {a?.MetalColor} | {a?.grosswt?.toFixed(3)} gms GW | {a?.NetWt?.toFixed(3)} gms NW 
                                            {
                                                `${a?.totals?.diamonds?.Wt === 0 ? '' : (' | ' + a?.totals?.diamonds?.Wt?.toFixed(3) + " cts ") } `
                                            }
                                            {
                                                `${a?.totals?.colorstone?.Wt === 0 ? '' : (' | ' + a?.totals?.colorstone?.Wt?.toFixed(3)) + " cts "} `
                                            }
                                            {
                                                `${a?.totals?.misc?.Wt === 0 ? '' : (' | ' + a?.totals?.misc?.Wt?.toFixed(3)) + " gms "} `
                                            }
                                            </div>
                                        { a?.JobRemark !== '' && <div className='d-flex align-items-center'><div className='fs_jti2 pe-1 text-decoration-underline fw-bold'>REMARKS:</div><div>{a?.JobRemark}</div></div>}
                                    </div>
                                    <div className='col4_jti2 center_jti2 brr_jti2'><img src={a?.DesignImage} alt="#designimg" className='desimg_jti2' onError={(e) => handleImageError(e)} /></div>
                                    <div className='col5_jti2 end_jti2 align-items-start pt-1'><span dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span><span className='ps-1 pe-1'>{formatAmount((a?.TotalAmount / result?.header?.CurrencyExchRate))}</span></div>
                                </div>
                                })
                            }
                       
                        </div>
                    </div>
                    <div className='d-flex thead_jti2 brall_jti2 mt-1 pbia_jti2'>
                        <div className='col1_jti2 center_jti2 brr_jti2'></div>
                        <div className='col2_jti2 start_jti2 ps-1 brr_jti2 text-break'>TOTAL</div>
                        <div className='col3_jti2 center_jti2 brr_jti2'></div>
                        <div className='col4_jti2 center_jti2 brr_jti2'></div>
                        <div className='col5_jti2 end_jti2 pe-1 text-break'><span dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}} className='pe-1'></span>{formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div>
                    </div>
                    <div className='brall_jts d-flex pbia_jts brall_jti2 mt-1 fs_jti2 pbia_jti2'>
                        <div className='w33_jts p-1 fs_jts brr_jti2 text-break'>
                        <div className='fw-bold'>Payment Details</div>
                        <div>
                            {
                                result?.header?.mainarr?.map((e, i) => {
                                    return <div>{e?.name}({e?.docno}) : <span className='fw-bold'>{formatAmount(e?.amount)}</span></div>
                                })
                            }
                        </div>
                        <div>Balance : {formatAmount(result?.header?.LedgerBal)}</div>
                        <div className='fw-bold text-decoration-underline'>REMARKS:</div><div>{result?.header?.PrintRemark}</div>
                        </div>
                        <div className='w33_jts p-1 fs_jts brr_jti2 text-break'>
                        {/* {
                            purityWise?.map((e, i) => {
                                return <div className='w-100 d-flex' key={i}><div className='w-50'>{e?.MetalTypePurity} : </div><div className='w-50'>{e?.grosswt?.toFixed(3)} gm</div></div>
                            })
                        } */}
                        {/* <div className='w-100 d-flex'><div className='w-50'>Diamond Wt : </div><div className='w-50'>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts</div></div> */}
                        {/* <div className='w-100 d-flex'><div className='w-50'>Stone Wt : </div><div className='w-50'>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts</div></div> */}
                        {/* <div className='w-100 d-flex'><div className='w-50'>Gross Wt : </div><div className='w-50'>{result?.mainTotal?.grosswt?.toFixed(3)} gm</div></div> */}
                        </div>
                        <div className='w33_jts  fs_jts d-flex text-break'>
                            <div className='brr_jti2 w1_jts'>
                            {
                                result?.allTaxes?.map((e, i) => <div className='start_jti2 ps-1 pt-1' key={i}>{e?.name} @ {e?.per}</div>)
                            }
                            {/* <div className='start_jti2 ps-1'>Total</div> */}
                            <div className='start_jti2 ps-1 pt-1'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                            <div className='start_jti2 ps-1 pt-1'>Delivery Charges</div>
                            </div>
                            <div className='w2_jts fw-bold'>
                            {
                                result?.allTaxes?.map((e, i) => <div className='end_jti2 pe-1' key={i}><span className='pe-1 pt-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount(e?.amount)}</div>)
                            }
                            {/* <div className='end_jti2 pe-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div> */}
                            <div className='end_jti2 pe-1 pt-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((result?.header?.AddLess / result?.header?.CurrencyExchRate))}</div>
                            <div className='end_jti2 pe-1 pt-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((result?.header?.FreightCharges / result?.header?.CurrencyExchRate))}</div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex thead_jti2 brall_jti2 mt-1 fs_jti2 pbia_jti2 text-break'>
                        <div className='col1_jti2 center_jti2 brr_jti2'></div>
                        <div className='col2_jti2 start_jti2 pe-1 brr_jti2'></div>
                        <div className='col3_jti2 end_jti2 brr_jti2' style={{width:'67%', paddingRight:'12.5%'}}>GRAND TOTAL</div>
                        {/* <div className='col4_jti2 center_jti2 brr_jti2'></div> */}
                        <div className='col5_jti2 end_jti2 pe-1 '><span dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}} className='pe-1'></span>{formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div>
                    </div>
                    <div className='static_jti2  py-2 text-break'>**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
                    <div className='mt-1 brall_jti2 dec_jti2 p-2 pbia_jti2 text-break'><div dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div></div>
                    <div className='mt-1 d-flex justify-content-between align-items-center p-1 pbia_jti2 text-break'>
                        <div className='fs_jti2 minh_jti2 d-flex justify-content-between flex-column'>
                            <div>Signature</div>
                            <div className='fw-bold'>kirti pvt ltd</div>
                        </div>
                        <div className='fs_jti2 minh_jti2 d-flex justify-content-between flex-column'>
                            <div>Signature</div>
                            <div className='fw-bold'>Optigo</div>
                        </div>
                    </div>
                </div>
                </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
                {msg}
              </p>
            }
            </>
        }
    </>
  )
}

export default JewelleryTaxInvoice2