import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, formatAmount, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import "../../assets/css/prints/invoiceprintk.css";
import { NumToWord } from './../../GlobalFunctions/NumToWord';
import { cloneDeep } from 'lodash';
import Button from './../../GlobalFunctions/Button';

const InvoicePrintK = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);

 
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

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

        let mergedArr = [];
      datas?.resultArray?.forEach((e) => {
        let b = cloneDeep(e);
        console.log(b);
        let findrec = mergedArr?.findIndex((a) => a?.MetalPurity === b?.MetalPurity);
        if(findrec === -1){
            mergedArr.push(b);
        }else{
            mergedArr[findrec].NetWt += b?.NetWt;
            mergedArr[findrec].LossWt += b?.LossWt;
            mergedArr[findrec].grosswt += b?.grosswt;
            mergedArr[findrec].Quantity += b?.Quantity;
            mergedArr[findrec].TotalAmount += b?.TotalAmount;
            mergedArr[findrec].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
            mergedArr[findrec].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;

        }
      })
      datas.resultArray = mergedArr;
      setResult(datas);
  }



  console.log(result);

  return (
    <>
    { loader ? <Loader /> : msg === '' ? <>
    <div className='container_invk'>
        <div className='mt-5 mb-5 d_none_invk'><Button /></div>
        <div className='w-100 text-end pe-3'>{result?.header?.PrintHeadLabel === '' ? 'TAX INVOICE' : result?.header?.PrintHeadLabel }</div>
        <div className='d-flex justify-content-between align-items-center w-100 border border-black'>
            <div className='w-50 '>
                <div className='fw-bold px-1'>{result?.header?.CompanyFullName}</div>
                <div className='px-1'>{result?.header?.CompanyAddress}</div>
                <div className='px-1'>{result?.header?.CompanyAddress2}</div>
                <div className='px-1'>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}, {result?.header?.CompanyState}  ({result?.header?.CompanyCountry})</div>
                <div className='px-1'>TOLL FREE {result?.header?.CompanyTollFreeNo}</div>
            </div>
            <div className='w-50 d-flex justify-content-between align-items-center '>
                <div className='w-50 border-black border-start  p-1 pb-0'>
                    <div style={{color:'grey'}} className='ps-1'>ORIGINAL FOR RECEPIENT</div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>Invoice No : {result?.header?.InvoiceNo}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>Invoice Date : {result?.header?.EntryDate}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>Financial Year : 2023-2024</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>{result?.header?.Company_VAT_GST_No}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>CIN NO : {result?.header?.CINNO}</div>
                    </div>
                </div>
                <div className='w-50'>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>PAN No : {result?.header?.Com_pannumber}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>State : {result?.header?.State}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>{result?.header?.Company_CST_STATE} : {result?.header?.Company_CST_STATE_No}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>Terms : {result?.header?.DueDays}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className='d-flex justify-content-between align-items-center w-100  border border-black border-top-0'>
            <div className='w-50 border-black border-end '>
                <div style={{color:'grey'}} className='px-1'>Details of Buyer</div>
                <div className='fw-bold px-1'>{result?.header?.customerfirmname}</div>
                <div className='text-break px-1'>{result?.header?.customerstreet}</div>
                <div className='px-1'>{result?.header?.customercity}, {result?.header?.customerstate}{result?.header?.customerpincode}</div>
                <div className='px-1'>GSTIN - {result?.header?.Cust_VAT_GST_No}, N : {result?.header?.CustPanno}</div>
                <div className='px-1'>State : {result?.header?.customerstate}, {result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
            </div>
            <div className='w-50 d-flex justify-content-between align-items-center'>
                <div className='w-100  p-1 pb-0'>
                    <div style={{color:'grey'}} className='px-1'>Bank Details :</div>
                    <div className='d-flex justify-content-between align-items-center px-1 fw-bold'>
                        {result?.header?.bankname}
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1 text-break'>
                        Branch : {result?.header?.bankaddress}
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>Account No : {result?.header?.accountnumber}</div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center px-1'>
                        <div>{result?.header?.rtgs_neft_ifsc}</div>
                    </div>
                    
                </div>
                
            </div>
        </div>
        <div className='w-100'>
            <div className='thead_invk d-flex fw-bold brall_invk border-bottom-0 w-100 mt-1'>
                <div className='col1_invk brright_invk p-1'>Sr#</div>
                <div className='col2_invk brright_invk p-1'>Product Description</div>
                <div className='col3_invk brright_invk p-1'>KT</div>
                <div className='col4_invk brright_invk p-1 text-end'>QTY</div>
                <div className='col5_invk brright_invk p-1 text-end'>Gross Wt(gm)</div>
                <div className='col8_invk brright_invk p-1 text-end'>Net Wt(gm)</div>
                <div className='col6_invk brright_invk p-1 text-end'>Dia Wt(ctw)</div>
                <div className='col7_invk brright_invk p-1 text-end'>Stone Wt(ctw)</div>
                <div className='col9_invk p-1 text-end'>Product Value</div>
            </div>
            {
                result?.resultArray?.map((e, i) => {
                    return <div className='tbody_invk' key={i}>
                    <div className='d-flex brall_invk border-bottom-0'>
                    <div className='col1_invk brright_invk p-1 text-center'>{i+1}</div>
                    <div className='col2_invk brright_invk p-1 text-break'>Diamond Studded Gold Jewellery</div>
                    <div className='col3_invk brright_invk p-1'>{e?.MetalPurity}</div>
                    <div className='col4_invk brright_invk p-1 text-end'>{e?.Quantity}</div>
                    <div className='col5_invk brright_invk p-1 text-end'>{e?.grosswt?.toFixed(3)}</div>
                    <div className='col8_invk brright_invk p-1 text-end'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                    <div className='col6_invk brright_invk p-1 text-end'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                    <div className='col7_invk brright_invk p-1 text-end'>{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                    <div className='col9_invk p-1 text-end'>{formatAmount(((e?.TotalAmount)/result?.header?.CurrencyExchRate))}</div>
                    </div>
                </div>
                })
            }
            <div className='tbody_invk border-black border-bottom'>
                <div className='d-flex brall_invk fw-bold'>
                    <div className='col1_invk brright_invk p-1'></div>
                    <div className='col2_invk brright_invk p-1'>TOTAL</div>
                    <div className='col3_invk brright_invk p-1'></div>
                    <div className='col4_invk brright_invk p-1 text-end'>{result?.mainTotal?.total_Quantity}</div>
                    <div className='col5_invk brright_invk p-1 text-end'>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                    <div className='col8_invk brright_invk p-1 text-end'>{(result?.mainTotal?.netwt + result?.mainTotal?.lossWt)?.toFixed(3)}</div>
                    <div className='col6_invk brright_invk p-1 text-end'>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                    <div className='col7_invk brright_invk p-1 text-end'>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</div>
                    <div className='col9_invk p-1 text-end'>{formatAmount(((result?.mainTotal?.total_amount)/result?.header?.CurrencyExchRate))}</div>
                </div>
            </div>

        </div>
        <div className='d-flex brleft_invk brright_invk brbottom_invk border-black'>
            <div style={{width:'87%'}} className='text-end p-1 brright_invk'>Taxable Value of Goods & Services</div>
            <div style={{width:'13%'}} className='text-end p-1'>{formatAmount((result?.mainTotal?.total_amount/ result?.header?.CurrencyExchRate))}</div>
        </div>
        <div className='d-flex brleft_invk brright_invk brbottom_invk border-black'>
            <div style={{width:'87%'}} className='text-end p-1 brright_invk'>Rate of Applicable Tax (%)</div>
            <div style={{width:'13%'}} className='text-end p-1'>Amount</div>
        </div>
        <div className='brleft_invk brright_invk brbottom_invk border-black'>

        {
            result?.allTaxes?.map((e, i) => {
                return <div className='d-flex ' key={i}>
                <div style={{width:'87%'}} className='text-end px-1 brright_invk'>{e?.name} @ {e?.per}</div>
                <div style={{width:'13%'}} className='text-end px-1'>{formatAmount(((e?.amount)/result?.header?.CurrencyExchRate))}</div>
            </div>
            })
        }
        <div className='d-flex brbottom_invk'>
            <div style={{width:'87%'}} className='text-end px-1 brright_invk'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
            <div style={{width:'13%'}} className='text-end px-1'>{formatAmount((result?.header?.AddLess)/result?.header?.CurrencyExchRate)}</div>
        </div>
        <div className='d-flex align-items-center fw-bold'>
            <div style={{width:'70%'}} className='px-1 text-break'>    IN WORDS : {NumToWord((((result?.header?.AddLess + result?.mainTotal?.total_amount + result?.allTaxesTotal)/result?.header?.CurrencyExchRate)))?.toUpperCase()}</div>
            <div style={{width:'17%'}} className='text-end p-1 brright_invk fw-bold'>Total Bill Amount (INR)</div>
            <div style={{width:'13%'}} className='text-end p-1 fw-bold'>{formatAmount(((result?.header?.AddLess + result?.mainTotal?.total_amount + result?.allTaxesTotal)/result?.header?.CurrencyExchRate))}</div>
        </div>
        
        </div>
        {/* <div className='p-1 brtop_invk  fw-bold border border-black border-top-0 p-2'>
            IN WORDS : {NumToWord(((result?.header?.AddLess + result?.mainTotal?.total_amount + result?.allTaxesTotal)))?.toUpperCase()}
        </div> */}
        <div className='p-1 text-break dec_invk'>
            <div dangerouslySetInnerHTML={{__html: result?.header?.Declaration}}></div>
        </div>
        <div className='d-flex align-items-end justify-content-between pb-5'>
            <div className=' text-break' style={{width:'40%'}}>NOTIFICATION : E WAY BILL EXEMPTION UNDER NOTIFICATION NO 27/107 - CENTRAL TAX DATED 31/08/2017 FOR GOODS MENTIONED IN ANNEXURE UNDER SERIAL NO. 150 % 151 UNDER  RULE NO. 138(14) FOR GOODS SPECIFIED UNDER CHAPTER 71.</div>
            <div className=' text-break border-top border-black' style={{width:'40%'}}>
                <div className='fw-bold w-100 text-center pt-1'>For {result?.header?.CompanyFullName}</div>
            </div>
        </div>
        <div className='pt-5 d-flex align-items-end justify-content-between'>
            <div style={{width:'40%'}} className='text-center'>Signature For Purchase</div>
            <div style={{width:'40%'}} className='text-center'>Director/Auth Sign</div>
        </div>
    </div>
    </>
     : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p> }
    </>
  )
}

export default InvoicePrintK