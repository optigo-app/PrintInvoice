import React from 'react'
import "../../assets/css/prints/jewellerytaxsummary.css";
import { ToWords } from 'to-words';
import { useState } from 'react';
import Loader from '../../components/Loader';
import Button from '../../GlobalFunctions/Button';
import { useEffect } from 'react';
import { apiCall, formatAmount, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const JewelleryTaxSummary = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  
  const toWords = new ToWords();
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
            msg === '' ? 
            <>
            <div className='container_jts'>
                <div className='mb-5 pb-5 d-flex justify-content-end align-items-center mt-5 pt-5 d_none_jts'><Button /></div>
                <div className='d-flex justify-content-between align-items-center p-1'>
                    <div className='fs_jts'>                        
                        <div className='fs2_jts fw-bold py-2'>{result?.header?.CompanyFullName}</div>
                        <div>{result?.header?.CompanyAddress}</div>
                        <div>{result?.header?.CompanyAddress2}</div>
                        <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}, {result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                        <div>T {result?.header?.CompanyTellNo}</div>
                        <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                        <div>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Com_pannumber}</div>
                    </div>
                    <div className='pe-5'>
                        { isImageWorking && (result?.header?.PrintLogo !== "" && 
                            <img src={result?.header?.PrintLogo} alt="" 
                            className='w-100 h-auto my-0 mx-auto d-block object-fit-contain'
                            style={{minHeight:'75px', minWidth:'115px', maxWidth:'117px', maxHeight:'75px'}}
                            onError={handleImageErrors} height={120} width={150} />) }
                    </div>
                </div>
                <div className='border p-2 d-flex justify-content-between align-items-center'>
                    <div className='fs_jts'>
                        <div>To,</div>
                        <div className='fs2_jts fw-bold'>{result?.header?.customerfirmname}</div>
                        <div>{result?.header?.customerstreet}</div>
                        <div>{result?.header?.customerregion}</div>
                        <div>{result?.header?.customercity} {result?.header?.customerpincode}</div>
                        <div>Tel : {result?.header?.customermobileno}</div>
                        <div>{result?.header?.customeremail1}</div>
                    </div>
                    <div className='fs_jts pe-5'>
                        <div>Invoice#: <span className='fw-bold'>{result?.header?.InvoiceNo}</span> Dated <span className='fw-bold'>{result?.header?.EntryDate}</span></div>
                        <div>{result?.header?.HSN_No_Label}: <span className='fw-bold'>{result?.header?.HSN_No}</span></div>
                        <div>PAN#: <span className='fw-bold'>{result?.header?.CustPanno}</span></div>
                        <div>VAT <span className='fw-bold'>{result?.header?.Cust_VAT_GST_No}</span>| {result?.header?.Cust_CST_STATE} <span className='fw-bold'>{result?.header?.Cust_CST_STATE_No}</span></div>
                        <div>Due Date: <span className='fw-bold'>{result?.header?.DueDate}</span></div>
                    </div>
                </div>
                <div className='table_jts'>
                    <div className='thead_jts'>
                        <div className='col1_jts center_jts brr_jts'>SR NO</div>
                        <div className='col2_jts center_jts brr_jts'>ITEM CODE</div>
                        <div className='col3_jts center_jts brr_jts'>DESCRIPTION</div>
                        <div className='col4_jts center_jts'>AMOUNT (USD)</div>
                    </div>
                    <div className='tbody_jts'>      
                        {
                            result?.resultArray?.map((e, i) => {
                                return <div className='d-flex w-100 brl_jts brr_jts brb_jts fs_jts pbia_jts' key={i}>
                                <div className='col1_jts  d-flex align-items-start justify-content-center brr_jts p-1'>{i+1}</div>
                                <div className='col2_jts start_jts p-1 brr_jts d-flex flex-column align-items-start text-break'>	
                                    <div className='text-break lh_jts'>Job: {e?.SrJobno}</div>
                                    <div className='text-break lh_jts'>Design: <span className='fw-bold'>{e?.designno}</span></div>
                                    <div className='text-break lh_jts'>{e?.Size}</div>
                                </div>
                                <div className='col3_jts d-flex align-items-start justify-content-start p-1 brr_jts text-break'>{e?.MetalTypePurity} {e?.MetalColor} | {e?.grosswt?.toFixed(3)} gms GW | {e?.NetWt?.toFixed(3)} gms NW | DIA: {e?.totals?.diamonds?.Wt?.toFixed(3)} Cts | CS: {e?.totals?.colorstone?.Wt?.toFixed(3)} Cts | MISC: {e?.totals?.misc?.Wt?.toFixed(3)} gms</div>
                                <div className='col4_jts d-flex align-items-start justify-content-end p-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                            </div>
                            })
                        }
                    </div>
                    <div className='thead_jts'>
                        <div className='col1_jts center_jts brr_jts'></div>
                        <div className='col2_jts start_jts brr_jts ps-1'>TOTAL</div>
                        <div className='col3_jts center_jts brr_jts'></div>
                        <div className='col4_jts end_jts pe-1'><span dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span> {formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div>
                    </div>
                </div>
                <div className='brall_jts border-top-0 d-flex pbia_jts'>
                    <div className='w33_jts p-1 fs_jts brr_jts'><div className='fw-bold text-decoration-underline'>REMARKS:</div><div>{result?.header?.PrintRemark}</div></div>
                    <div className='w33_jts p-1 fs_jts brr_jts'>
                        {
                            purityWise?.map((e, i) => {
                                return <div className='w-100 d-flex' key={i}><div className='w-50'>{e?.MetalTypePurity} : </div><div className='w-50'>{e?.grosswt?.toFixed(3)} gm</div></div>
                            })
                        }
                        <div className='w-100 d-flex'><div className='w-50'>Diamond Wt : </div><div className='w-50'>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts</div></div>
                        <div className='w-100 d-flex'><div className='w-50'>Stone Wt : </div><div className='w-50'>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts</div></div>
                        <div className='w-100 d-flex'><div className='w-50'>Gross Wt : </div><div className='w-50'>{result?.mainTotal?.grosswt?.toFixed(3)} gm</div></div>
                    </div>
                    <div className='w33_jts  fs_jts d-flex'>
                        <div className='brr_jts w1_jts'>
                            {
                                result?.allTaxes?.map((e, i) => <div className='start_jts ps-1' key={i}>{e?.name} @ {e?.per}</div>)
                            }
                            <div className='start_jts ps-1'>Total</div>
                            <div className='start_jts ps-1'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                            <div className='start_jts ps-1'>Delivery Charges</div>
                        </div>
                        <div className='w2_jts fw-bold'>
                            {
                                result?.allTaxes?.map((e, i) => <div className='end_jts pe-1' key={i}><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount(e?.amount)}</div>)
                            }
                            <div className='end_jts pe-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div>
                            <div className='end_jts pe-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((result?.header?.AddLess / result?.header?.CurrencyExchRate))}</div>
                            <div className='end_jts pe-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{formatAmount((result?.header?.FreightCharges / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                </div>
                <div className='thead_jts pbia_jts'>
                    <div className='col1_jts center_jts brr_jts'></div>
                    <div className='col2_jts start_jts brr_jts ps-1'></div>
                    <div className='col3_jts end_jts brr_jts' style={{paddingRight:'12.5%'}}>GRAND TOTAL</div>
                    <div className='col4_jts end_jts pe-1'><span dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span> {formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div>
                </div>
                <div className='static_jts py-2'>**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
                <div className='brall_jts dec_jts p-2 pbia_jts'>
                    <div dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
                </div>
                <div className='d-flex fs_jts brall_jts border-top-0 pbia_jts'>
                    <div className='w33_jts p-1 brr_jts'>
                        <div className='fw-bold'>Bank Detail </div>
                        <div>Bank Name: {result?.header?.bankname}</div>
                        <div>Branch: {result?.header?.bankaddress}</div>
                        <div>Account Name: {result?.header?.accountname}</div>
                        <div>Account No. : {result?.header?.accountnumber}</div>
                        <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
                    </div>
                    <div className='w33_jts p-1 brr_jts d-flex flex-column justify-content-between'>
                        <div>Signature</div>
                        <div className='fw-bold'>{result?.header?.customerfirmname}</div>
                    </div>
                    <div className='w33_jts p-1 brr_jts d-flex flex-column justify-content-between'>
                        <div>Signature</div>
                        <div className='fw-bold'>{result?.header?.CompanyFullName}</div>
                    </div>
                </div>
            </div>
            </>
             : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
          </p>
        }
        </>
    }
    </>
  )
}

export default JewelleryTaxSummary