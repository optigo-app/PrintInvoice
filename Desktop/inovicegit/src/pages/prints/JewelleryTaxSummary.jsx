import React from 'react'
import "../../assets/css/prints/jewellerytaxsummary.css";
import { ToWords } from 'to-words';
import { useState } from 'react';
import Loader from '../../components/Loader';
import Button from '../../GlobalFunctions/Button';
import { useEffect } from 'react';
import { apiCall, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';

const JewelleryTaxSummary = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  
  const toWords = new ToWords();
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
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
                <div className='mb-5 pb-5 d-flex justify-content-end align-items-center mt-5 pt-5'><Button /></div>
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
                                return <div className='d-flex w-100 brl_jts brr_jts brb_jts fs_jts' key={i}>
                                <div className='col1_jts  d-flex align-items-start justify-content-center brr_jts p-1'>{i+1}</div>
                                <div className='col2_jts start_jts p-1 brr_jts d-flex flex-column align-items-start text-break'>	
                                    <div className='text-break lh_jts'>Job: {e?.SrJobno}</div>
                                    <div className='text-break lh_jts'>Design: <span className='fw-bold'>{e?.designno}</span></div>
                                    <div className='text-break lh_jts'>{e?.Size}</div>
                                </div>
                                <div className='col3_jts d-flex align-items-start justify-content-start p-1 brr_jts text-break'>{e?.MetalTypePurity} {e?.MetalColor} | {e?.grosswt?.toFixed(3)} gms GW | 14.000 gms NW | DIA: 5.000 Cts | CS: 5.000 Cts | MISC: 2.000 gms</div>
                                <div className='col4_jts d-flex align-items-start justify-content-end p-1'><span className='pe-1' dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span>{e?.TotalAmount}</div>
                            </div>
                            })
                        }
                    </div>
                    <div className='thead_jts'>
                        <div className='col1_jts center_jts brr_jts'></div>
                        <div className='col2_jts start_jts brr_jts ps-1'>TOTAL</div>
                        <div className='col3_jts center_jts brr_jts'></div>
                        <div className='col4_jts end_jts pe-1'>AMOUNT (USD)</div>
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