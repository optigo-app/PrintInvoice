import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, formatAmount, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import { ToWords } from 'to-words';
import "../../assets/css/prints/detailprint12.css";
import { NumToWord } from './../../GlobalFunctions/NumToWord';

const DetailPrint12 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const toWords = new ToWords();
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
 
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
      datas?.resultArray?.forEach((e) => {
        let arr = [];
        arr = e?.misc?.filter((a) => a?.Amount !== 0);
        e.misc = arr;
      })

      datas?.resultArray?.forEach((e, i) => {
        let counts =
          e?.metal?.reduce( (acc, cObj) => cObj?.IsPrimaryMetal === 0 ? acc+1 : acc , 0 ) + e?.diamonds?.length + e?.colorstone?.length + e?.misc?.length;
          e.counts = counts;
      });

  

      setResult(datas);
  }

  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };

  return (
    <>
    { loader ? <Loader /> : msg === '' ? 
      <div className="containerdp12 pb-5 mb-5">
      {/* image show flag */}
      <div className="d-flex justify-content-end align-items-center my-5 fsgdp12 hidebtn">
        <input type="checkbox" checked={imgFlag} id="showImg" onChange={handleImgShow} className="mx-2" />
        <label htmlFor="showImg" className="me-2 user-select-none"> With Image </label>
        <button className="btn_white blue m-0 " onClick={(e) => handlePrint(e)} > Print </button>
      </div>
      {/* table header */}
      <div>
        {result?.header?.PrintHeadLabel  ? ( "PRODUCT DETAIL SHEET" ) : ( <div className="pheaddp12 w-100">PRODUCT DETAIL SHEET {result?.header?.PrintHeadLabel} </div> )}
        <div className="d-flex justify-content-between align-items-center p-1 ">
          <div className="w-75 fsgdp12">
            <div className="fw-bold fsgdp12_ lhdp12"> {result?.header?.CompanyFullName} </div>
            <div className="fsgdp12 lhdp12">
              {/* {result?.header?.CompanyAddress?.split(",")[0]} <br /> */}
              {result?.header?.CompanyAddress} <br />
              {/* {result?.header?.CompanyAddress2?.split(",")[0]}  */}
              {result?.header?.CompanyAddress2}
            </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.CompanyCity}-
              {result?.header?.CompanyPinCode},
              {result?.header?.CompanyState}(
              {result?.header?.CompanyCountry})
            </div>
            <div className="fsgdp12 lhdp12">
              T {result?.header?.CompanyTellNo} | TOLL FREE{" "}
              {result?.header?.CompanyTollFreeNo} | TOLL FREE{" "}
              {result?.header?.CompanyTollFreeNo}
            </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.CompanyEmail} |{" "}
              {result?.header?.CompanyWebsite}
            </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.Company_VAT_GST_No} |{" "}
              {result?.header?.Company_CST_STATE} -{" "}
              {result?.header?.Company_CST_STATE_No} | PAN- {result?.header?.Pannumber}{" "}
            </div>
          </div>
          <div className="d-flex justify-content-end w-25 fsgdp12 pe-2">
            {/* <img
              src={result?.header?.PrintLogo}
              alt="#companylogo"
              className="headimgdp12"
            /> */}
            {isImageWorking && result?.header?.PrintLogo !== "" && (
              <img src={result?.header?.PrintLogo} alt="" className="w-100 h-auto ms-auto d-block object-fit-contain headimgdp12" style={{ minHeight: "75px", maxHeight: "75px", minWidth: "115px", maxWidth: "117px", }} onError={handleImageErrors} height={120} width={150} />
            )}
          </div>
        </div>
      </div>

      {/* table sub header */}
      <div className="d-flex subheaddp12 hcompdp12 fsgdp12">
        <div className="subheaddiv1dp12">
          <div className="fsgdp12 lhdp12"> {result?.header?.lblBillTo} </div>
          <div className="_fsgdp12_ lhdp12"> <b>{result?.header?.customerfirmname}</b> </div>
          <div className="fsgdp12 lhdp12"> {result?.header?.customerAddress1} </div>
          <div className="fsgdp12 lhdp12"> {result?.header?.customerAddress2} </div>
          <div className="fsgdp12 lhdp12"> {result?.header?.customercity1}{" "} {result?.header?.customerpincode} </div>
          <div className="fsgdp12 lhdp12"> {result?.header?.customeremail1} </div>
          <div className="fsgdp12 lhdp12"> {result?.header?.vat_cst_pan} </div>
          <div className="fsgdp12 lhdp12"> {result?.header?.Cust_CST_STATE} -{" "} {result?.header?.Cust_CST_STATE_No} </div>
        </div>
        <div className="subheaddiv2dp12">
          <div className="fsgdp12 lhdp12">Ship To,</div>
          <div className="_fsgdp12_ lhdp12"> <b>{result?.header?.customerfirmname}</b> </div>
          {result?.header?.address?.map((e, i) => {
            return (
              <div className="fsgdp12 lhdp12" key={i}> {e} </div>
            );
          })}
        </div>
        <div className="subheaddiv3dp12 fsgdp12">
          <div className="fsgdp12 lhdp12 d-flex justify-content-between">
            <span className="w-50 fw-bold">INVOICE NO</span>
            <span className="w-50 d-flex justify-content-start"> {result?.header?.InvoiceNo} </span>
          </div>
          <div className="fsgdp12 lhdp12 d-flex justify-content-between">
            <span className="w-50 fw-bold">DATE</span>
            <span className="w-50 d-flex justify-content-start"> {result?.header?.EntryDate} </span>
          </div>
          <div className="fsgdp12 lhdp12 d-flex justify-content-between">
            <span className="w-50 fw-bold"> {result?.header?.HSN_No_Label} </span>
            <span className="w-50 d-flex justify-content-start"> {result?.header?.HSN_No} </span>
          </div>
          <div className="fsgdp12 lhdp12 d-flex justify-content-between">
            <span className="w-50 fw-bold">Delivery Mode</span>
            <span className="w-50 d-flex justify-content-start"> {result?.header?.Delivery_Mode} </span>
          </div>
          <div className="fsgdp12 lhdp12 d-flex justify-content-between">
            <span className="w-50 fw-bold">Sales Person</span>
            <span className="w-50 d-flex justify-content-start"> {result?.header?.SalPerName?.split(" ")[0]} </span>
          </div>
          <div>
            <div className="d-flex"> <div className="fw-bold w-50">Due Date :</div> <div className="w-50">{result?.header?.DueDate}</div> </div>
            <div className="d-flex"> <div className="fw-bold w-50">Terms :</div> <div className="w-50">{result?.header?.DueDays}</div> </div>
          </div>
        </div>
      </div>

      {/* table head */}
      <div className="tabledp12 fsgdp12">
        <div className="theaddp12 hcompdp12 bordersdp12">
          <div className="col1dp12 dp12cen">SR#</div>
          <div className="col2dp12 dp12cen">DESIGN DESCRIPTION</div>
          <div style={{width:'15%'}} className='brdp12'>
            <div className='w-50 brdp12 h-100'></div>
            <div className='w-50'></div>
          </div>
          {/* <div className="col3dp12 dp12cen"></div>
          <div className="col4dp12 dp12cen"></div> */}
          {/* <div className="col5dp12 dp12cen">NET</div> */}
          <div className="col5dp12 dp12cen p-1 text-break">METAL / MAKING RATE</div>
          {/* <div className="col6dp12 dp12cen">WASTAGE</div> */}
          <div className="col6dp12 dp12cen text-break p-1">METAL / MAKING AMOUNT</div>
          <div className="col7dp12 d-flex flex-column ">
            <div className="dp12cen brbdp12 h-50">POLKI DIAMOND STONE DESCRIPTION </div>
            <div className="d-flex subcoldp12 h-50">
              <div className="dp12cen w_subcoldp12 brdp12" style={{ width: "25%" }} > MIS TYPE </div>
              <div className="dp12cen w_subcoldp12 brdp12" style={{ width: "10%" }} > PCS </div>
              <div className="dp12cen w_subcoldp12 brdp12">WT</div>
              <div className="dp12cen w_subcoldp12 brdp12">RATE</div>
              <div className="dp12cen w_subcoldp12 brdp12" style={{ width: "25%" }} > AMOUNT </div>
            </div>
          </div>
          {/* <div className="col8dp12 dp12cen d-flex flex-column"> <span>OTHER</span> <span>CHARGES</span> </div> */}
          <div className="col9dp12 dp12cen border-end-0">TOTAL AMOUNT</div>
        </div>
        <div className="tbodydp12">
          {result?.resultArray?.map((e, i) => {
            return (
              <div className="d-flex brbdp12 hcompdp12 bordersdp12" key={i} >
                <div className="rcol1dp12 dp12cen1">{i + 1}</div>
                <div className="rcol2dp12 d-flex flex-column  justify-content-center  align-items-start p-1">
                  <div className="d-flex justify-content-between align-items-start w-100">
                    <div>{e?.designno}</div>
                    <div>{e?.SrJobno}</div>
                  </div>
                  {imgFlag ? ( <div className="w-100 d-flex justify-content-center align-items-start"> <img src={e?.DesignImage} onError={(e) => handleImageError(e)} alt="design" className="rowimgdp12" /> </div> ) : ( "" )}

                  <div className="w-100 d-flex justify-content-center align-items-start"> {e?.HUID === "" ? "" : `HUID - ${e?.HUID}`} </div>
                </div>
                {/* <div className="rcol3dp12 dp12cen1" style={{ wordBreak: "break-word" }} > {e?.MetalPurity}/{e?.MetalColor} </div> */}
                  {/* <div className='w-100'> {e?.MetalPurity}/{e?.MetalColor}</div> */}
                {/* <div className="rcol3dp12 dp12cen1 d-flex flex-column" style={{ wordBreak: "break-word" }} >
                  <div className='w-100 brbdp12'>KT/COL</div>
                  <div className='w-100 brbdp12'>GROSS</div>
                  <div className='w-100 brbdp12'>NETWT</div>
                  <div className='w-100 brbdp12 text-break'>MAKING RATE</div>
                </div>
                <div className="rcol4dp12 dp12cen1 d-flex flex-column"> 
                  <div className='w-100 brbdp12 text-break'>{e?.MetalPurity === '' ? '&nbsp;' : e?.MetalPurity}/{e?.MetalColor === '' ? '&nbsp;' : e?.MetalColor}</div>
                  <div className='w-100 brbdp12'>{ e?.grosswt === 0 ? '&nbsp;' : e?.grosswt?.toFixed(3)} </div>
                  <div className='w-100 brbdp12'>{( e?.NetWt + e?.LossWt === 0 ? '&nbsp;' : (e?.NetWt + e?.LossWt)?.toFixed(3))}</div>
                  <div className='w-100 brbdp12'>{( e?.NetWt + e?.LossWt === 0 ? '&nbsp;' : (e?.NetWt + e?.LossWt)?.toFixed(3))}</div>
                </div> */}
                <div className='rcol4dp12 d-flex flex-column justify-content-between' style={{width:'15%'}}>
                  <div>
                  <div className='d-flex brbdp12 w-100'>
                    <div className='w-50 brdp12 ps-1'>KT/COL</div>
                    <div className='w-50 pe-1 end_dp12'> {e?.MetalPurity} {e?.MetalColor} </div>
                  </div>
                  <div className='d-flex brbdp12 w-100'>
                    <div className='w-50 brdp12 ps-1'>GROSS</div>
                    <div className='w-50 pe-1 end_dp12'> {e?.grosswt?.toFixed(3)} </div>
                  </div>
                  <div className='d-flex brbdp12 w-100'>
                    <div className='w-50 brdp12 ps-1'>NETWT</div>
                    <div className='w-50 pe-1 end_dp12'> 
                      {((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal)?.toFixed(3)}
                      {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)}  */}
                    </div>
                  </div>
                  <div className='d-flex brbdp12 w-100'>
                    <div className='w-50 brdp12 ps-1'>MAKING RATE</div>
                    <div className='w-50 pe-1 end_dp12'> {(e?.NetWt + e?.LossWt)?.toFixed(3)} </div>
                  </div>
                  </div>
                  <div>
                  <div className='d-flex brbdp12 brtdp12 w-100 fw-bold'>
                    <div className='w-50 brdp12 ps-1'></div>
                    <div className='w-50 pe-1 end_dp12'>&nbsp;</div>
                  </div>
                  </div>
                </div>
                  {/* {e?.grosswt?.toFixed(3)}  */}
                <div className="rcol5dp12 dp12cen1 d-flex flex-column justify-content-between"> 
                    <div className='w-100'>
                    {/* {((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal)?.toFixed(3)}  */}
                    <div className='w-100 brbdp12'>&nbsp;</div>
                    <div className='w-100 brbdp12'>&nbsp;</div>
                    <div className='w-100 brbdp12 end_dp12 pe-1'>&nbsp;{e?.MetalAmount === 0 ? '' : formatAmount(((e?.MetalAmount / result?.header?.CurrencyExchRate) / (((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal) === 0 ? 1 : ((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal))))}</div>
                    <div className='w-100 brbdp12 end_dp12 pe-1'>&nbsp;{e?.MaKingCharge_Unit === 0 ? '' : formatAmount((e?.MaKingCharge_Unit))}</div>
                    </div>
                    {/* <div className='w-100 brbdp12 brtdp12 end_dp12 pe-1  fw-bold'>{e?.MaKingCharge_Unit === 0 ? '&nbsp;' : formatAmount(e?.MaKingCharge_Unit)}</div> */}
                    <div className='w-100 brbdp12 brtdp12 end_dp12 pe-1  fw-bold'>&nbsp;</div>
                </div>
                <div className="rcol6dp12 dp12cen1 d-flex flex-column justify-content-between"> 
                  {/* {e?.Wastage?.toFixed(3)}  */}
                  <div className='w-100'>
                    <div className='w-100 brbdp12'>&nbsp;</div>
                    <div className='w-100 brbdp12'>&nbsp;</div>
                    <div className='w-100 brbdp12 end_dp12 '>&nbsp;{e?.MetalAmount === 0 ? '' : formatAmount((e?.MetalAmount / result?.header?.CurrencyExchRate))}</div>
                    <div className='w-100 brbdp12 end_dp12 '>&nbsp;{e?.MakingAmount === 0 ? '' : formatAmount((e?.MakingAmount / result?.header?.CurrencyExchRate))}</div>
                  </div>
                  <div className='w-100 brbdp12 brtdp12 end_dp12 pe-1 fw-bold'>&nbsp;{e?.MakingAmount === 0 ? '' : formatAmount((e?.MakingAmount + e?.MetalAmount))}</div>
                </div>
                <div style={{ width: "" }} className=" col7dp12 d-flex flex-column justify-content-between">
                  {/* <div className="d-grid h-100"> */}
                  <div className="d-grid h-100">
                    {e?.metal?.length > 0 &&
                      e?.metal?.map((el, ind) => {
                        return (
                          
                            el?.IsPrimaryMetal === 0 &&  <React.Fragment key={ind}>
                            
                              <div className="d-flex brtdp12" key={ind} >
                                <div className="w_subcoldp12 dp12cen1 brdp12" style={{ width: "25%" }} >
                                  {el?.ShapeName}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12" style={{ width: "10%" }} >
                                  {/* {el?.dcm_pcs} */}
                                  {el?.Pcs}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12">
                                  {el?.Wt?.toFixed(3)}
                                  {/* {el?.ShapeName ===
                              "Certification_NM award"
                                ? e?.certificateWtDia?.toFixed(3)
                                : el?.dcm_wt?.toFixed(3)} */}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12">
                                  {/* {formatAmount(el?.Rate)} */}
                                  {/* {el?.ShapeName === "Certification_NM award" ? (formatAmount(((el?.dcm_amt)/(e?.certificateWtDia === 0 ? 1 : e?.certificateWtDia))))
                                : (formatAmount((el?.dcm_amt)/(el?.dcm_wt)))} */}
                                </div>
                                <div className="w_subcoldp12 dp12cen2" style={{ width: "25%" }} >
                                  {/* {el?.dcm_amt?.toFixed(2)} */}
                                  {/* {formatAmount(el?.Amount)} */}
                                </div>
                              </div>
                            
                          </React.Fragment>
                          
                        );
                      })}
                    {e?.diamonds?.length > 0 &&
                      e?.diamonds?.map((el, ind) => {
                        return (
                          <div className="d-flex brtdp12" key={ind}>
                            <div className="w_subcoldp12 dp12cen1 brdp12" style={{ width: "25%" }} > { el?.MaterialTypeName === '' ? el?.ShapeName : el?.MaterialTypeName} </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12" style={{ width: "10%" }} > {/* {el?.dcm_pcs} */} {el?.Pcs} </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {el?.Wt?.toFixed(3)}
                              {/* {el?.ShapeName ===
                            "Certification_NM award"
                              ? e?.certificateWtDia?.toFixed(3)
                              : el?.dcm_wt?.toFixed(3)} */}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {formatAmount(el?.Rate)}
                              {/* {el?.ShapeName === "Certification_NM award" ? (formatAmount(((el?.dcm_amt)/(e?.certificateWtDia === 0 ? 1 : e?.certificateWtDia))))
                              : (formatAmount((el?.dcm_amt)/(el?.dcm_wt)))} */}
                            </div>
                            <div className="w_subcoldp12 dp12cen2" style={{ width: "25%" }} >
                              {/* {el?.dcm_amt?.toFixed(2)} */}
                              {formatAmount( el?.Amount / result?.header?.CurrencyExchRate )}
                            </div>
                          </div>
                        );
                      })}
                    {e?.colorstone?.length > 0 &&
                      e?.colorstone?.map((el, ind) => {
                        return (
                          <div className="d-flex brtdp12" key={ind}>
                            <div className="w_subcoldp12 dp12cen1 brdp12" style={{ width: "25%" }} >
                              { el?.MaterialTypeName === '' ? el?.ShapeName : el?.MaterialTypeName}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12" style={{ width: "10%" }} >
                              {/* {el?.dcm_pcs} */}
                              {el?.Pcs}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {el?.Wt?.toFixed(3)}
                              {/* {el?.ShapeName ===
                            "Certification_NM award"
                              ? e?.certificateWtDia?.toFixed(3)
                              : el?.dcm_wt?.toFixed(3)} */}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {formatAmount(el?.Rate)}
                              {/* {el?.ShapeName === "Certification_NM award" ? (formatAmount(((el?.dcm_amt)/(e?.certificateWtDia === 0 ? 1 : e?.certificateWtDia))))
                              : (formatAmount((el?.dcm_amt)/(el?.dcm_wt)))} */}
                            </div>
                            <div className="w_subcoldp12 dp12cen2" style={{ width: "25%" }} >
                              {/* {el?.dcm_amt?.toFixed(2)} */}
                              {formatAmount( el?.Amount / result?.header?.CurrencyExchRate )}
                            </div>
                          </div>
                        );
                      })}
                    {e?.misc?.length > 0 &&
                      e?.misc?.map((el, ind) => {
                        return (
                          <div className="d-flex brtdp12" key={ind}>
                            <div className="w_subcoldp12 dp12cen1 brdp12" style={{ wordBreak: "break-word", width: "25%", }} >
                              {el?.ShapeName}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12" style={{ width: "10%" }} >
                              {/* {el?.dcm_pcs} */}
                              {el?.Pcs}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {el?.IsHSCOE === 0 ? el?.Wt?.toFixed(3) : el?.ServWt?.toFixed(3)} {/* {el?.Wt?.toFixed(3)} */}
                              {/* {el?.ShapeName ===
                            "Certification_NM award"
                              ? e?.certificateWtDia?.toFixed(3)
                              : el?.dcm_wt?.toFixed(3)} */}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {formatAmount(el?.Rate)}
                              {/* {el?.ShapeName === "Certification_NM award" ? (formatAmount(((el?.dcm_amt)/(e?.certificateWtDia === 0 ? 1 : e?.certificateWtDia))))
                              : (formatAmount((el?.dcm_amt)/(el?.dcm_wt)))} */}
                            </div>
                            <div className="w_subcoldp12 dp12cen2" style={{ width: "25%" }} >
                              {/* {el?.dcm_amt?.toFixed(2)} */}
                              {formatAmount( el?.Amount / result?.header?.CurrencyExchRate )}
                            </div>
                          </div>
                        );
                      })}
                      {e?.counts === 0 &&   <div className="d-flex brtdp12" >
                            <div className="w_subcoldp12 dp12cen1 brdp12" style={{ wordBreak: "break-word", width: "25%", }} > </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12" style={{ width: "10%" }} > </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12"> </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12"> </div>
                            <div className="w_subcoldp12 dp12cen2" style={{ width: "25%" }} > </div>
                          </div>}

                         
                  </div>
                  {
                    ((e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt + e?.totals?.misc?.Wt + e?.totals?.metal?.WithOutPrimaryMetal === 0 ) && (e?.totals?.diamonds?.Amount + e?.totals?.colorstone?.Amount + e?.totals?.misc?.Amount === 0)) ? '' :
                    <div className="d-flex brtdp12  fw-bold" >
                      <div className="w_subcoldp12 dp12cen1 brdp12" style={{ wordBreak: "break-word", width: "25%" }} > </div>
                      <div className="w_subcoldp12 dp12cen2 brdp12 pe-1" style={{ width: "10%" }} ></div>
                      <div className="w_subcoldp12 dp12cen2 brdp12 pe-1">{(e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt + e?.totals?.misc?.Wt + e?.totals?.metal?.WithOutPrimaryMetal)?.toFixed(3)}</div>
                      <div className="w_subcoldp12 dp12cen2 brdp12"></div>
                      <div className="w_subcoldp12 dp12cen2 pe-1" style={{ width: "25%" }}>{formatAmount(e?.totals?.diamonds?.Amount + e?.totals?.colorstone?.Amount + e?.totals?.misc?.Amount)}</div>
                  </div>
                  }
                  
                </div>
                {/* <div className="rcol12dp12 dp12cen2 bldp12">
                  {formatAmount( (e?.OtherCharges + e?.TotalDiamondHandling) / result?.header?.CurrencyExchRate )}
                </div> */}
                <div className="rcol13dp12 dp12cen2 border-end-0">{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
              </div>
            );
          })}
        </div>
      </div>
{console.log(result)}
      {/* table all row total */}
      <div className="totaldp12 w-100 brtdp12 border-top-0 border-start border-end fsgdp12">
        <div className="totcol1dp12"></div>
        <div className="totcol2dp12 dp12cen2" style={{width:'15%'}}>
          {/* <div>{result?.mainTotal?.grosswt !== 0 && result?.mainTotal?.grosswt?.toFixed(3)} </div> */}
        </div>
        {/* <div className="totcol3dp12 dp12cen2"> {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} </div> */}
        <div className="totcol3dp12 dp12cen2"> </div>
        <div className="totcol3dp12 dp12cen2"> {formatAmount((result?.mainTotal?.total_Making_Amount / result?.header?.CurrencyExchRate) + (result?.mainTotal?.metal?.Amount / result?.header?.CurrencyExchRate))} </div>
        <div className="totcol3dp12 dp12cen2"> </div>
        {/* <div className="totcol3dp12 dp12cen2"> {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)} </div> */}
        <div className="totcol4dp12">
          <div className='brdp12 end_dp12 pe-1' style={{width:'60%'}}>{(result?.mainTotal?.diamonds?.Wt + result?.mainTotal?.colorstone?.Wt + result?.mainTotal?.misc?.Wt + result?.mainTotal?.metal?.withOutPrimaryMetal)?.toFixed(3)}</div>
          <div style={{width:'40%'}}></div>
        </div>
        <div className="totcol5dp12 dp12cen2"> {result?.mainTotal?.total_diamond_colorstone_misc_amount !== 0 && formatAmount( result?.mainTotal?.total_diamond_colorstone_misc_amount / result?.header?.CurrencyExchRate )} </div>
        {/* <div className="totcol6dp12 dp12cen2"> {formatAmount( ((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling + result?.mainTotal?.misc?.isHSCODE123_amt ) / result?.header?.CurrencyExchRate) )} </div> */}
        <div className="totcol7dp12 dp12cen2"> {formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))} </div>
      </div>

      {/* table total */}
      <div className="w-100 brtdp12 dp12cen2 bradp12 fsgdp12">
        {result?.mainTotal?.total_amount !== 0 && formatAmount( result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate )}
      </div>

      {/* Courier info and Charges */}
      <div className="w-100 d-flex border border-top-0 fsgdp12">
        <div style={{ width: "69.9%" }}></div>
        <div style={{ width: "30.1%" }} className="d-flex">
          <div style={{ width: "63%" }} className="border-end border-start px-1  dp12cen2  " > {result?.header?.ModeOfDel} :{" "} </div>
          <div style={{ width: "37%" }} className="px-1  dp12cen2  "> {" "} {formatAmount( result?.header?.FreightCharges / result?.header?.CurrencyExchRate )} </div>
        </div>
      </div>

      {/* taxes */}
      {result?.allTaxes?.map((e, i) => {
        return (
          <div className="w-100 bradp12 border-bottom-0 border-top-0 taxdp12 fsgdp12" key={i} >
            <div className="taxdp12d1">{e?.amountInWords}</div>
            <div className="taxdp12d2 dp12cen2"> {e?.name} @ {e?.per} </div>
            <div className="taxdp12d3 dp12cen2"> {formatAmount(e?.amount)} </div>
          </div>
        );
      })}
      <div className="w-100 bradp12 border-top-0 taxdp12 fsgdp12">
        <div className="taxdp12d4"></div>
        <div className="taxdp12d2 dp12cen2 bldp12"> Sales Rounded Off </div>
        <div className="taxdp12d3 dp12cen2"> {formatAmount( result?.header?.AddLess / result?.header?.CurrencyExchRate )} </div>
      </div>

      {/* grand total */}
      <div className="w-100 bradp12 border-top-0 taxdp12 finalAmt_h_dp12 fsgdp12">
        <div className="taxdp12d1 fw-bold ps-1 h-100 dp12cen1" style={{ width: "70.5%" }} >
          Total
        </div>
        <div className="taxdp12d2 dp12cen2 bldp12 h-100 border-0 " style={{ width: "19%" }} ></div>
        <div className="taxdp12d3 dp12cen2 fw-bold pe-2 h-100 border-end-0 bldp12" style={{ width: "11.2%" }} >
          <div dangerouslySetInnerHTML={{ __html: result?.header?.Currencysymbol, }} ></div>
          <div className="ps-1">
            {result?.finalAmount + result?.header?.FreightCharges !== 0 &&
              formatAmount(
                result?.mainTotal?.total_amount /
                  result?.header?.CurrencyExchRate +
                  result?.allTaxesTotal +
                  result?.header?.FreightCharges /
                    result?.header?.CurrencyExchRate +
                  result?.header?.AddLess /
                    result?.header?.CurrencyExchRate
              )}
          </div>
        </div>
      </div>
      <div className="w-100 d-flex brbdp12 brdp12 bldp12 fsgdp12">
        <div className="brdp12 fw-bold ps-1" style={{ width: "3%" }} dangerouslySetInnerHTML={{ __html: result?.header?.Currencysymbol, }} ></div>
        <div className="ps-2 fw-bold" style={{ width: "97%" }}>
          { result?.finalAmount !== 0 && NumToWord((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate + (result?.header?.FreightCharges / result?.header?.CurrencyExchRate + result?.allTaxesTotal + result?.header?.AddLess / result?.header?.CurrencyExchRate))) }
        </div>
      </div>

      {/* summary */}
      {/* <div className="summary_container_dp7 hcompdp7 fsgdp7"> */}
        {/* <div className="summary_container_dp7_product_table hcompdp7">
          <div className="summary_container_dp7_product_title">
            PRODUCT SUMMARY
          </div>
          <div className="summary_container_dp7_product_head">
            <div className="sum_prod_head_col_1 dp7cen">CATEGORY</div>
            <div className="sum_prod_head_col_2 dp7cen">PIECES</div>
            <div className="sum_prod_head_col_3 dp7cen">GORSS WT</div>
            <div className="sum_prod_head_col_4 dp7cen">NET WT</div>
            <div className="sum_prod_head_col_5 dp7cen">WASTAGE</div>
            <div className="sum_prod_head_col_6 dp7cen">FINE</div>
          </div>
          {categoryWise?.length > 0 &&
            categoryWise?.map((e, i) => {
              return (
                <div
                  className="summary_container_dp7_product_body fsgdp7"
                  key={i}
                >
                  <div className="sum_prod_head_col_1 dp7cen1">
                    {e?.Categoryname}
                  </div>
                  <div className="sum_prod_head_col_2 dp7cen2">
                    {e?.cg_quantity}
                  </div>
                  <div className="sum_prod_head_col_3 dp7cen2">
                    {e?.cg_grosswt?.toFixed(3)}
                  </div>
                  <div className="sum_prod_head_col_4 dp7cen2">
                    {e?.cg_netwt?.toFixed(3)}
                  </div>
                  <div className="sum_prod_head_col_5 dp7cen2">
                    {e?.Wastage?.toFixed(3)}
                  </div>
                  <div className="sum_prod_head_col_6 dp7cen2">
                    
                    {e?.cg_finewt?.toFixed(3)}
              
                  </div>
                </div>
              );
            })}
          <div className="summary_container_dp7_product_total fw-bold fsgdp7">
            <div className="sum_prod_head_col_1 dp7cen1">Total</div>
            <div className="sum_prod_head_col_2 dp7cen2">
              {result?.mainTotal?.total_Quantity !== 0 &&
                result?.mainTotal?.total_Quantity}
            </div>
            <div className="sum_prod_head_col_3 dp7cen2">
              {result?.mainTotal?.grosswt !== 0 &&
                result?.mainTotal?.grosswt?.toFixed(3)}
            </div>
            <div className="sum_prod_head_col_4 dp7cen2">
              {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
            </div>
            <div className="sum_prod_head_col_5 dp7cen2"></div>
            <div className="sum_prod_head_col_6 dp7cen2">
              {fineWtTotal === 0 ? 0 : fineWtTotal?.toFixed(3)}
            </div>
          </div>
        </div> */}
        {/* <div style={{ height: "16px" }}></div> */}
        {/* <div className="summary_container_dp7_misc_table hcompdp7 fsgdp7">
          <div className="summary_container_dp7_misc_title">
            MISC SUMMARY
          </div>

          <div className="summary_container_dp7_misc_head w-100 fw-bold fsgdp7">
            <div className="summary_container_dp7_misc_head_col_1 dp7cen">
              TYPE
            </div>
            <div className="summary_container_dp7_misc_head_col_2 dp7cen">
              PIECES
            </div>
            <div className="summary_container_dp7_misc_head_col_3 dp7cen">
              RATE
            </div>
            <div className="summary_container_dp7_misc_head_col_4 dp7cen">
              WT
            </div>
            <div className="summary_container_dp7_misc_head_col_5 dp7cen border-end-0">
              AMOUNT
            </div>
          </div>
          {miscWise?.length > 0 &&
            miscWise?.map((e, i) => {
              return (
                <div className="summary_container_dp7_misc_body fsgdp7" key={i} >
                  <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                    {e?.ShapeName}
                  </div>
                  <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
                    {e?.pcPcs}
                  </div>
                  <div className="summary_container_dp7_misc_head_col_3 dp7cen2">
                    {e?.Rate?.toFixed(2)}
                  </div>
                  <div className="summary_container_dp7_misc_head_col_4 dp7cen2">
                    {e?.MasterManagement_DiamondStoneTypeid === 2
                      ? `${e?.wtWeight?.toFixed(3)} Ctw`
                      : `${e?.wtWeight?.toFixed(3)} gm`}
                  </div>
                  <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                    {formatAmount(e?.AmtAmount)}
                  </div>
                </div>
              );
            })}

          {otherAMountTotal === 0 ? (
            ""
          ) : (
            <div className="summary_container_dp7_misc_total fsgdp7">
              <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                Other Charges
              </div>
              <div className="summary_container_dp7_misc_head_col_2 dp7cen2"></div>
              <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
              <div className="summary_container_dp7_misc_head_col_4 dp7cen2 d-flex flex-column">
                <div className="w-100 dp7cen2"></div>
                <div className="w-100 dp7cen2"></div>
              </div>
              <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0"> {formatAmount( otherAMountTotal / result?.header?.CurrencyExchRate )} </div>
            </div>
          )}

          <div className="summary_container_dp7_misc_total fw-bold">
            <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
              Total
            </div>
            <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
              {miscWise_total?.pcPcs}
            </div>
            <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
            <div className="summary_container_dp7_misc_head_col_4 dp7cen2 d-flex flex-column">
              {miscWise_total?.wtWeight_Ctw === 0 ? ( "" ) : (
                <div className="w-100 dp7cen2">
                  {miscWise_total?.wtWeight_Ctw?.toFixed(3)} Ctw
                </div>
              )}
              {miscWise_total?.wtWeight_gm === 0 ? ( "" ) : (
                <div className="w-100 dp7cen2"> {" "} {miscWise_total?.wtWeight_gm?.toFixed(3)} Gm </div>
              )}
            </div>
            <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0"> {formatAmount( miscWise_total?.AmtAmount + otherAMountTotal / result?.header?.CurrencyExchRate )}
            </div>
          </div>
        </div> */}
      {/* </div> */}

      {/* footer */}
      <div className="mt-1 bradp12 p-1 hcompdp7 fsgdp12" dangerouslySetInnerHTML={{ __html: result?.header?.Declaration }} >
        {}
      </div>
      <div className="border-top-0 bradp12 border-bottom-0 ps-1 fsgdp12">
        <b>REMARKS</b> : {result?.header?.PrintRemark}
      </div>
      <div className="d-flex footer_bank_dp12 hcompdp12_dp12 fsgdp12">
        <div className="subheaddiv_1_dp12">
          <div className="fw-bold">Bank Detail</div>
          <div>Bank Name: {result?.header?.bankname}</div>
          <div>Branch: {result?.header?.bankaddress}</div>
          <div>Account Name: {result?.header?.accountname}</div>
          <div>Account No. : {result?.header?.accountnumber}</div>
          <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
          <div>Enquiry No. (E & OE)</div>
        </div>
        <div className="subheaddiv_1_dp12 d-flex flex-column justify-content-between align-items-start">
          <div>Signature</div>
          <div className="fw-bold mb-2">
            {result?.header?.customerfirmname}
          </div>
        </div>
        <div className="subheaddiv_1_dp12 d-flex flex-column justify-content-between align-items-start border-end-0">
          <div>Signature</div>
          <div className="fw-bold mb-2">
            {result?.header?.CompanyFullName}
          </div>
        </div>
      </div>
    </div>
    : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p> }
    </>
  )
}

export default DetailPrint12