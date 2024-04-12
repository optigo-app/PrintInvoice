import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ToWords } from 'to-words';
import { NumberWithCommas, apiCall, formatAmount, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import "../../assets/css/prints/RetailTaxInvoice.css";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import cloneDeep from 'lodash/cloneDeep';
const RetailTaxInvoice = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {

    const toWords = new ToWords();
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [result, setResult] = useState(null);
    const [othInfo, setOthInfo] = useState([]);
    const [metwise, setMetwise] = useState([]);
    const [diawise, setDiawise] = useState([]);
    const [clrwise, setClrwise] = useState([]);
    const [miscwise, setMiscwise] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const loadData = (data) => {
      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      
      let met = [];
      let dia = [];
      let clr = [];
      let miscc = [];
      let oth = [];

      datas?.resultArray?.forEach((e) => {
        e?.metal?.forEach((el) => {
          let obj = cloneDeep(el);
          if(obj?.IsPrimaryMetal === 1){

            let findrec = met?.findIndex((a) => a?.IsPrimaryMetal === 1 && a?.QualityName === obj?.QualityName && a?.Rate === obj?.Rate)
            if(findrec === -1){
              met.push(obj);
            }else{
              met[findrec].Wt += obj?.Wt;
              met[findrec].Amount += obj?.Amount;
            }
          }
        })
        // e.metal = met;


        e?.diamonds?.forEach((el) => {
          let obj = cloneDeep(el);
          let findrec = dia?.findIndex((a) => a?.MaterialTypeName === obj?.MaterialTypeName && a?.ShapeName === obj?.ShapeName && a?.QualityName === obj?.QualityName && a?.Colorname === obj?.Colorname)
          if(findrec === -1){
            dia.push(obj);
          }else{
            dia[findrec].Wt += obj?.Wt;
            dia[findrec].Amount += obj?.Amount;
          }
        })
        // e.diamonds = dia;

        e?.colorstone?.forEach((el) => {
          let obj = cloneDeep(el);
          let findrec = clr?.findIndex((a) => a?.MaterialTypeName === obj?.MaterialTypeName && a?.ShapeName === obj?.ShapeName && a?.QualityName === obj?.QualityName && a?.Colorname === obj?.Colorname && a?.isRateOnPcs === obj?.isRateOnPcs)
          if(findrec === -1){
            clr.push(obj);
          }else{
            clr[findrec].Wt += obj?.Wt;
            clr[findrec].Amount += obj?.Amount;
            clr[findrec].Pcs += obj?.Pcs;
          }
        })
        // e.colorstone = clr;

        e?.misc?.forEach((el) => {
          let obj = cloneDeep(el);
          if(obj?.IsHSCOE !== 0){

            let findrec = miscc?.findIndex((a) => a?.ShapeName === obj?.ShapeName)
            if(findrec === -1){
              miscc.push(obj);
            }else{
              miscc[findrec].Wt += obj?.Wt;
              miscc[findrec].Amount += obj?.Amount;
            }
          }
          })
          // e.misc = miscc;
        
        e?.other_details?.forEach((a) => {
          let obj = cloneDeep(a);
          let findrec = oth?.findIndex((el) => el?.label === obj?.label)
          if(findrec === -1){
            let obj1 = {...obj};
            obj1.value = +(obj?.value)
            oth.push(obj1);
          }else{
            oth[findrec].value += +(obj?.value);
          }
        })          
        e.other_details = oth;
      })
      let totamt = 0;
      met?.forEach((e) => {
         totamt += e?.Amount;
      })
      dia?.forEach((e) => {
         totamt += e?.Amount;
      })
      clr?.forEach((e) => {
         totamt += e?.Amount;
      })
      oth?.forEach((e) => {
         totamt += e?.Amount;
      })
      setTotalAmount(totamt)
      setMetwise(met);
      setDiawise(dia);
      setClrwise(clr);
      setMiscwise(miscc);
      setOthInfo(oth);
      setResult(datas);

    }

    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
      setIsImageWorking(false);
    };

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
                if (data?.Status === '200') {
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
        }
        sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(result);
    return (
        <>  {loader ? <Loader /> : msg === "" ? 
        <div className=''>
            {/* print button */}
            
          <div className='containerrti'>
              <div className="d-flex w-100 justify-content-end align-items-baseline print_sec_sum4 no_break pb-4 d_none_rti">
                <div className="printBtn_sec text-end ">
                    <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
              </div>
              <div className='headlinerti'>{result?.header?.PrintHeadLabel}</div>
              <div className='headrti border-bottom'>
              <div>
                  <div className='cmpnamerti'>{result?.header?.CompanyFullName}</div>
                  <div>{result?.header?.CompanyAddress?.split(",")[0]}</div>
                  <div>{result?.header?.CompanyCity} - {result?.header?.CompanyPinCode}, {result?.header?.CompanyState} ({result?.header?.CompanyCountry})</div>
                  <div>T {result?.header?.CompanyTellNo} | TOLL FREE {result?.header?.CompanyTollFreeNo}</div>
                  <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
              </div>
              <div className='pe-4'>  {isImageWorking && (result?.header?.PrintLogo !== "" && 
                      <img src={result?.header?.PrintLogo} alt="" 
                      className='w-100 h-auto my-0 mx-auto d-block object-fit-contain'
                      style={{minHeight:'75px', minWidth:'115px', maxWidth:'117px', maxHeight:'75px'}}
                      onError={handleImageErrors} height={120} width={150} />)}</div>
              </div>
              <div className='subheadrti pt-3 fsrti'>
              <div className='subheadrti1 fsrti'>
                <div className='d-flex'><div className='w-50 fw-bold'>BILL NO</div><div className='w-50'>{result?.header?.InvoiceNo}</div></div>
                <div className='d-flex'><div className='w-50 fw-bold'>DATE</div><div className='w-50'>{result?.header?.EntryDate}</div></div>
                <div className='d-flex'><div className='w-50 fw-bold'>{result?.header?.HSN_No_Label}</div><div className='w-50'>{result?.header?.HSN_No}</div></div>
              </div>
              </div>
              {/* sub header part2 */}
              <div className='subheadertri2 fsrti'>
                  <div className='subheadertri2_1'>
                    <div className='fw-bold pe-2  custnamefsrti'>To, </div>
                    <div>
                      <div className='custnamefsrti'>{result?.header?.customerfirmname}</div>
                      <div>{result?.header?.customerstreet}</div>
                      <div>{result?.header?.customerregion}</div>
                      <div>{result?.header?.customercity}{result?.header?.customerpincode}</div>
                      <div>STATE NAME : {result?.header?.customerstate}</div>
                    </div>
                  </div>
                  <div className='subheadertri2_2'>
                    <div className='d-flex'><div className='w-50 fw-bold'>GSTIN:</div><div>{result?.header?.CustGstNo}</div></div>
                    <div className='d-flex'><div className='w-50 fw-bold'>{result?.header?.Cust_CST_STATE}:</div><div>{result?.header?.Cust_CST_STATE_No}</div></div>
                    <div className='d-flex'><div className='w-50 fw-bold'>PAN NO:</div><div>{result?.header?.CustPanno}</div></div>
                  </div>
              </div>
              {/* table part */}
              <div className='tablecontainerrti fsrti'>
                  <div className='tableheadrti'>
                    <div className='col1_rti centerrti'>DESCRIPTION</div>
                    <div className='col2_rti ps-2 d-flex align-items-center'>DETAIL</div>
                    <div className='col3_rti d-flex align-items-center end_rti pe-1'>WEIGHT</div>
                    <div className='col4_rti d-flex align-items-center end_rti pe-1'>RATE</div>
                    <div className='col5_rti d-flex align-items-center end_rti pe-1'>AMOUNT</div>
                  </div>
                  <div className='d-flex brbottomrti'>
                    <div className='col1_rti brleftti d-flex justify-content-center pt-3' style={{width:'36%'}}>DIAMOND STUDDED JEWELLERY</div>
                     <div className='d-flex flex-column tbodyrti' style={{width:'66.8%'}}>
                     {
                      // result?.resultArray?.map((e, i) => (
                        <React.Fragment>
                          {metwise?.map((el, j) => { 
                            return <div className='d-flex pbiarti' key={j}>
                              <div className='tcol1rti ps-2'>{el?.ShapeName} {el?.QualityName}</div>
                              <div className='tcol2rti end_rti pe-1'>{(el?.Wt)?.toFixed(3)}</div>
                              <div className='tcol3rti end_rti pe-1'>{formatAmount(el?.Rate)}</div>
                              <div className='tcol4rti brrightrti end_rti pe-1'>{formatAmount(el?.Amount)}</div>
                            </div>
                          })}
                        </React.Fragment>
                      // ))
                    }
                    {
                      // result?.resultArray?.map((e, i) => (
                        <React.Fragment>
                          {diawise?.map((el, k) => {
                            return  <div className='d-flex pbiarti' key={k}>
                              <div className='tcol1rti ps-2'>{el?.MasterManagement_DiamondStoneTypeName} </div>
                              <div className='tcol2rti end_rti pe-1'>{(el?.Wt)?.toFixed(3)}</div>
                              <div className='tcol3rti end_rti pe-1'>{formatAmount(el?.Rate)}</div>
                              <div className='tcol4rti brrightrti end_rti pe-1'>{formatAmount(el?.Amount)}</div>
                            </div>
                          })}
                        </React.Fragment>
                      // ))
                    }
                    {
                      // result?.resultArray?.map((e, i) => (
                        <React.Fragment>
                          {clrwise?.map((el, k) => {
                            return  <div className='d-flex pbiarti' key={k}>
                              <div className='tcol1rti ps-2'>{el?.MasterManagement_DiamondStoneTypeName}</div>
                              <div className='tcol2rti end_rti pe-1'>{(el?.Wt)?.toFixed(3)}</div>
                              <div className='tcol3rti end_rti pe-1'>{formatAmount((el?.Amount / (el?.isRateOnPcs === 1 ? (el?.Pcs === 0 ? 1 : el?.Pcs) : (el?.Wt === 0 ? 1 : el?.Wt))))}</div>
                              {/* <div className='tcol3rti end_rti pe-1'>{el?.Rate}</div> */}
                              <div className='tcol4rti brrightrti end_rti pe-1'>{formatAmount(el?.Amount)}</div>
                            </div>
                          })}
                        </React.Fragment>
                      // ))
                    }
                            <div className='d-flex'>
                              <div className='tcol1rti ps-2'>LABOUR </div>
                              <div className='tcol2rti end_rti pe-1'></div>
                              <div className='tcol3rti end_rti pe-1'>{formatAmount((result?.mainTotal?.total_Making_Amount / ((result?.mainTotal?.netwt + result?.mainTotal?.lossWt))))}</div>
                              <div className='tcol4rti brrightrti end_rti pe-1'>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount + result?.mainTotal?.misc?.Amount + result?.mainTotal?.total_diamondHandling))}</div>
                            </div>  
                    {
                      // result?.resultArray?.map((e, i) => (
                        <React.Fragment>
                          {miscwise?.map((el, k) => {
                            return  <div className='d-flex' key={k}>
                              <div className='tcol1rti ps-2'>{(el?.ShapeName)}</div>
                              <div className='tcol2rti end_rti pe-1'>{(el?.Wt)?.toFixed(3)}</div>
                              <div className='tcol3rti end_rti pe-1'></div>
                              <div className='tcol4rti brrightrti end_rti pe-1'>{formatAmount(el?.Amount)}</div>
                            </div>
                          })}
                        </React.Fragment>
                      // ))
                    }
                    {
                      // result?.resultArray?.map((e, i) => (
                        <React.Fragment >
                          {othInfo?.map((el, k) => {
                            // console.log(el, e?.other_details);
                            return  <div className='d-flex' key={k}>
                              <div className='tcol1rti ps-2'>{el?.label} </div>
                              <div className='tcol2rti end_rti pe-1'></div>
                              <div className='tcol3rti end_rti pe-1'></div>
                              <div className='tcol4rti brrightrti end_rti pe-1'>{formatAmount(el?.value)}</div>
                            </div>
                          })}
                        </React.Fragment>
                      // ))
                    }
                              </div> 
                  </div>
              </div>
              {/* all table total */}
              <div className='tableheadrti fsrti pbiarti'>
                  <div className='col1_rti centerrti'></div>
                  <div className='col2_rti ps-2 d-flex align-items-center'>Total</div>
                  <div className='col3_rti d-flex align-items-center'></div>
                  <div className='col4_rti d-flex align-items-center'></div>
                  <div className='col5_rti d-flex align-items-center end_rti pe-1'>{formatAmount(result?.mainTotal?.total_unitcost)}</div>
                  {/* <div className='col5_rti d-flex align-items-center end_rti pe-1'>{totalAmount}</div> */}
              </div>
              {/* tax total */}
              <div className='w-100 d-flex pt-2 fsrti pbiarti'>
                <div className='w-25'></div>
                <div className='w-25'>{result?.header?.PrintRemark}</div>
                <div className='w-50 d-flex justify-content-end'>
                  <div className='grandtotalrti'>
                    <div className='d-flex'><div className='w-50 ps-2'>Discount</div><div className='w-50 end_rti pe-1'>{formatAmount(result?.mainTotal?.total_discount_amount)}</div></div>
                    <div className='d-flex'><div className='w-50 ps-2 fw-bold'>Total Amount</div><div className='w-50 end_rti pe-1 fw-bold'>{formatAmount(result?.mainTotal?.total_amount)}</div></div>
                    {
                      result?.allTaxes?.map((e, i) => {
                        return <div className='d-flex'><div className='w-50 ps-2'>{e?.name} @ {e?.per}</div><div className='w-50 end_rti pe-1'>{formatAmount(e?.amount)}</div></div>
                      })
                    }
                    <div className='d-flex'><div className='w-50 ps-2'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div><div className='w-50 end_rti pe-1'>{formatAmount(result?.header?.AddLess)}</div></div>
                    <div className='d-flex brtoprti mt-2'><div className='w-50 ps-2 fw-bold'>Grand Total</div><div className='w-50 end_rti pe-1 fw-bold'>{formatAmount((result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess))}</div></div>
                  </div>
                </div>
              </div>
              {/* amount in words */}
              <div className='amtinwrdrti fw-bold ps-2 pe-2 fsrti pbiarti'>Rs. {toWords?.convert(+(result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess)?.toFixed(2))} </div>
              <div className='mt-2 amtinwrdrti fsrti pbiarti'>
                    <div className='p-1 fw-bold'>NOTE :</div>
                    <div className='decrti p-1 fsrti' dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
              </div>
              {/* footer comapny details */}
              <div className='footer_rti p-1 fsrti pbiarti'>
                <div className='fw-bold'>COMPANY DETAILS :</div>
                <div>GSTIN : {result?.header?.Company_VAT_GST_No?.split("-")[1]}</div>
                <div>{result?.header?.Company_CST_STATE} : {result?.header?.Company_CST_STATE_No}</div>
                <div>PAN NO. : {result?.header?.Com_pannumber}</div>
                <div>Kindly make your payment by the name of  "<b className='fsrti'>{result?.header?.accountname}</b>"</div>
                <div>Payable at Surat (GJ) by cheque or DD</div>
                <div>Bank Detail: Bank Account No {result?.header?.accountnumber}</div>
                <div>Bank Name : {result?.header?.bankname}, {result?.header?.bankaddress}</div>
                <div>RTGS/NEFT IFSC : {result?.header?.rtgs_neft_ifsc}</div>
              </div>
              <div className='mt-2 d-flex w-100 frti fw-bold pbiarti fsrti'>
                <div className='w-50 me-2 brfrti frti d-flex justify-content-center frti'>AUTHORISED, {result?.header?.customerfirmname}</div>
                <div className='w-50 ms-2 brfrti frti d-flex justify-content-center frti'>AUTHORISED, {result?.header?.CompanyFullName}</div>
              </div>
            
      
          </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default RetailTaxInvoice