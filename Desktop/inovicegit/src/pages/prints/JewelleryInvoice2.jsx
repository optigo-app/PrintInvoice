import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import { apiCall, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import "../../assets/css/prints/jewelleryinvoice2.css";
import { formatAmount } from "./../../GlobalFunctions";
import { ToWords } from "to-words";
const JewelleryInvoice2 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [metWise, setMetWise] = useState([]);
  const [totobj, setTotObj] = useState();
  const toWords = new ToWords();

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
    // console.log(datas);
    setResult(datas);

    let metwise = [];

    let finalArr = [];
    datas?.resultArray?.forEach((e, i) => {
      let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      let obj = cloneDeep(e);
      if (findGold !== undefined) {
        obj.metalRate = findGold?.Rate;
        obj.metalAmount = findGold?.Amount;
        obj.metalWeight = findGold?.Wt;
        obj.metalPcs = findGold?.Pcs;
      } else {
        obj.metalRate = 0;
        obj.metalAmount = 0;
        obj.metalWeight = 0;
        obj.metalPcs = 0;
      }
      finalArr.push(obj);
    });
    datas.resultArray = finalArr;

    // datas?.resultArray?.forEach((e) => {
    //   let findIndex_ = metwise?.findIndex((a) => a?.MetalPurity === e?.MetalPurity)
    //   let obj = cloneDeep(e);
    //   if(findIndex_ === -1){
    //     obj.OtherCharges_d = 0;
    //     obj.UnitCost_d = 0;
    //     obj.TotalDiaSetcost_d = 0;
    //     obj.TotalDiamondHandling_d = 0;
    //     obj.TotalAmount_d = 0;
    //     obj.MiscAmount_d = 0;
    //     obj.MakingAmount_d = 0;
    //     obj.MetalAmount_d = 0;
    //     obj.grosswt_d = 0;
    //     obj.NetWt_d = 0;
    //     obj.LossWt_d = 0;
    //     obj.total_MakingAmount_Setting_Amount_d = 0;
    //     metwise.push(e);
    //   }else{
    //     metwise[findIndex_].OtherCharges_d += e?.OtherCharges;
    //     metwise[findIndex_].UnitCost_d += e?.UnitCost;
    //     metwise[findIndex_].TotalDiaSetcost_d += e?.TotalDiaSetcost;
    //     metwise[findIndex_].TotalDiamondHandling_d += e?.TotalDiamondHandling;
    //     metwise[findIndex_].TotalDiamondHandling_d += e?.TotalDiamondHandling;
    //     metwise[findIndex_].TotalAmount_d = e?.TotalAmount;
    //     metwise[findIndex_].MiscAmount_d = e?.MiscAmount;
    //     metwise[findIndex_].MakingAmount_d = e?.MakingAmount;
    //     metwise[findIndex_].MetalAmount_d = e?.MetalAmount;
    //     metwise[findIndex_].grosswt_d = e?.grosswt;
    //     metwise[findIndex_].NetWt_d = e?.NetWt;
    //     metwise[findIndex_].LossWt_d = e?.LossWt;
    //     metwise[findIndex_].total_MakingAmount_Setting_Amount_d = e?.total_MakingAmount_Setting_Amount;
    //     metwise[findIndex_].diamond_colorstone_misc = ([...e?.diamond_colorstone_misc]?.flat());
    //   }
    // })
    datas?.resultArray?.forEach((e) => {
      let findRecord = metwise?.findIndex(
        (a) => a?.MetalPurity === e?.MetalPurity 
        // && a?.metalRate === e?.metalRate
      );
      if (findRecord === -1) {
        let obj = { ...e };
        obj.OtherCharges_d = e?.OtherCharges;
        obj.UnitCost_d = e?.UnitCost;
        obj.TotalDiaSetcost_d = e?.TotalDiaSetcost;
        obj.TotalDiamondHandling_d = e?.TotalDiamondHandling;
        obj.TotalAmount_d = e?.TotalAmount;
        obj.MiscAmount_d = e?.MiscAmount;
        obj.MakingAmount_d = e?.MakingAmount;
        obj.MetalAmount_d = e?.MetalAmount;
        obj.grosswt_d = e?.grosswt;
        obj.NetWt_d = e?.NetWt;
        obj.LossWt_d = e?.LossWt;
        obj.total_MakingAmount_Setting_Amount_d = e?.total_MakingAmount_Setting_Amount;
        metwise.push(obj);
      } else {
        metwise[findRecord].OtherCharges_d += e?.OtherCharges;
        metwise[findRecord].OtherCharges += e?.OtherCharges;
        metwise[findRecord].UnitCost_d += e?.UnitCost;
        metwise[findRecord].UnitCost += e?.UnitCost;
        metwise[findRecord].TotalDiaSetcost_d += e?.TotalDiaSetcost;
        metwise[findRecord].TotalDiaSetcost += e?.TotalDiaSetcost;
        metwise[findRecord].TotalDiamondHandling_d += e?.TotalDiamondHandling;
        metwise[findRecord].TotalDiamondHandling += e?.TotalDiamondHandling;
        metwise[findRecord].TotalAmount_d += e?.TotalAmount;
        metwise[findRecord].TotalAmount += e?.TotalAmount;
        metwise[findRecord].MiscAmount_d += e?.MiscAmount;
        metwise[findRecord].MiscAmount += e?.MiscAmount;
        metwise[findRecord].MakingAmount_d += e?.MakingAmount;
        metwise[findRecord].MakingAmount += e?.MakingAmount;
        metwise[findRecord].MetalAmount_d += e?.MetalAmount;
        metwise[findRecord].MetalAmount += e?.MetalAmount;
        metwise[findRecord].grosswt_d += e?.grosswt;
        // metwise[findRecord].grosswt += e?.grosswt;
        metwise[findRecord].NetWt_d += e?.NetWt;
        // metwise[findRecord].NetWt += e?.NetWt;
        metwise[findRecord].LossWt_d += e?.LossWt;
        // metwise[findRecord].LossWt += e?.LossWt;
        // metwise[findRecord].total_MakingAmount_Setting_Amount += e?.total_MakingAmount_Setting_Amount;
        metwise[findRecord].total_MakingAmount_Setting_Amount_d += e?.total_MakingAmount_Setting_Amount;
        metwise[findRecord].diamond_colorstone_misc = [...metwise[findRecord].diamond_colorstone_misc, ...e?.diamond_colorstone_misc].flat()
      }
    });
    metwise?.forEach((e) => {
        let metwise2 = [];
        e?.diamond_colorstone_misc?.forEach((a) => {
          // console.log(a);
          let find_Record = metwise2?.findIndex((el) => el?.MasterManagement_DiamondStoneTypeid === 1 && el?.QualityName === a?.QualityName);
          if(find_Record === -1){
            let obj = {...a};
            obj.a_wt = a?.Wt;
            obj.a_pcs = a?.Pcs;
            obj.a_rate = a?.Rate;
            obj.a_amount = a?.Amount;
            metwise2.push(obj);
          }else{
              metwise2[find_Record].a_wt += a?.Wt;
              metwise2[find_Record].a_pcs += a?.Pcs;
              // metwise2[find_Record].a_rate += a?.Rate;
              metwise2[find_Record].a_amount += a?.Amount;
          }
        })
        e.diamond_colorstone_misc = metwise2;
      })
      metwise?.sort((a, b) => {
        const qualityA = parseInt(a?.MetalPurity);
        const qualityB = parseInt(b?.MetalPurity);
        return qualityA - qualityB;
      });
    //   console.log(metwise);
      let tot_obj = {
        pcs:0,
        wt:0,
        rate:0,
        amount:0
      }
      metwise?.forEach((e) => {
        e?.diamond_colorstone_misc?.forEach((el) => {
          tot_obj.pcs += el?.a_pcs;
          tot_obj.wt += el?.a_wt;
          tot_obj.rate += el?.a_rate;
          tot_obj.amount += el?.a_amount;
        })
      })
    
      setTotObj(tot_obj);
      // console.log(metwise);
      setMetWise(metwise);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="container_ji2">
              <div className="endc_ji2 d_none_ji2"><button
                    className="btn_white blue m-0 "
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button></div>
              <div>
                <div className="headlabel_ji2">
                  {result?.header?.PrintHeadLabel}
                </div>
                <div className="fs_ji2 lh_ji2 pb-2">
                  <div className="fw-bold fs_2_ji2">
                    {result?.header?.CompanyFullName}
                  </div>
                  <div>{result?.header?.CompanyAddress}</div>
                  <div>{result?.header?.CompanyAddress2}</div>
                  <div>
                    {result?.header?.CompanyCity}-
                    {result?.header?.CompanyPinCode},{" "}
                    {result?.header?.CompanyState}(
                    {result?.header?.CompanyCountry})
                  </div>
                  <div>
                    T {result?.header?.CompanyTellNo} | TOLL FREE{" "}
                    {result?.header?.CompanyTollFreeNo}
                  </div>
                  <div>
                    {result?.header?.CompanyEmail} |{" "}
                    {result?.header?.CompanyWebsite}
                  </div>
                  <div>
                    {result?.header?.Company_VAT_GST_No} |{" "}
                    {result?.header?.Company_CST_STATE}-
                    {result?.header?.Company_CST_STATE_No} |{" "}
                    {result?.header?.Com_pannumber}
                  </div>
                  <div>CIN - {result?.header?.CINNO}</div>
                </div>
              </div>
              <div className="d-flex border fs_ji2 lh_ji2">
                <div className="w33_ji2 border-end p-1 fs_ji2 lh_ji2">
                  <div>{result?.header?.lblBillTo}</div>
                  <div className="fw-bold">{result?.header?.customerfirmname}</div>
                  <div>{result?.header?.customerAddress1}</div>
                  <div>{result?.header?.customerAddress2}</div>
                  <div>
                    {result?.header?.customercity}
                    {result?.header?.customerpincode}
                  </div>
                  <div>{result?.header?.customeremail1}</div>
                  <div>{result?.header?.Cust_CST_STATE_No_}</div>
                  <div>
                    GSTIN - {result?.header?.CustGstNo} | PAN -{" "}
                    {result?.header?.CustPanno}
                  </div>
                  <div>
                    <b>Place Of Supply :</b> {result?.header?.customerstate}
                  </div>
                </div>
                <div className="w33_ji2 border-end p-1 fs_ji2 lh_ji2">
                  <div>Ship To,</div>
                  <div className="fw-bold">
                    {result?.header?.customerfirmname}
                  </div>
                  <div>{result?.header?.CustName}</div>
                  <div>
                    {result?.header?.customercity},{" "}
                    {result?.header?.customerstate}
                  </div>
                  <div>
                    {result?.header?.customercountry}
                    {result?.header?.customerpincode}
                  </div>
                  <div>{result?.header?.customermobileno}</div>
                </div>
                <div className="w33_ji2 p-1 fs_ji2 lh_ji2">
                  <div className="d-flex">
                    <div className="w-25 fw-bold">VOUCHER</div>
                    <div className="w-50">{result?.header?.InvoiceNo}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-25 fw-bold">DATE</div>
                    <div className="w-50">{result?.header?.EntryDate}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-25 fw-bold">
                      {result?.header?.HSN_No_Label}
                    </div>
                    <div className="w-50">{result?.header?.HSN_No}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex fw-bold border mt-2 fs_ji2 lh_ji2 h30_ji2">
                  <div className="col1_ji2 border-end center_ji2">SR#</div>
                  <div className="col2_ji2 border-end center_ji2">
                    Description
                  </div>
                  <div className="col3_ji2 border-end center_ji2">Material</div>
                  <div className="col4_ji2 border-end center_ji2">Pcs</div>
                  <div className="col5_ji2 border-end center_ji2">Wt.</div>
                  <div className="col6_ji2 border-end center_ji2">Rate</div>
                  <div className="col7_ji2 border-end center_ji2">Amount</div>
                  <div className="col8_ji2 border-end center_ji2">
                    Labour Amt
                  </div>
                  <div className="col9_ji2 border-end center_ji2">
                    Other charges
                  </div>
                  <div className="col10_ji2 center_ji2">Total Amount</div>
                </div>
                <div>
                  {metWise?.map((e, i) => {
                    return (
                      <div className="d-flex border border-top-0 fs_ji2 lh_ji2" key={i}>
                        <div className="col1_ji2 border-end center_ji2 d-flex justify-content-center align-items-start pt-2">
                          {i + 1}
                        </div>
                        <div className="col2_ji2 border-end pad_start_ji2">
                          {" "}
                          New Jewellery <br /> <b>{e?.grosswt_d?.toFixed(3)}</b> gm Gross
                        </div>
                        <div
                          className="col3_ji2 border-end "
                          style={{ width: "42%" }}
                        >
                          <div className="d-flex border-bottom">
                            <div
                              className="border-end pad_start_ji2"
                              style={{ width: "26%" }}
                            >
                              {e?.MetalTypePurity}
                            </div>
                            <div
                              className="border-end pad_end_ji2 endc_ji2"
                              style={{ width: "14.4%" }}
                            ></div>
                            <div
                              className="border-end pad_end_ji2 endc_ji2"
                              style={{ width: "16.6%" }}
                            >
                              {(e?.NetWt_d + e?.LossWt_d)?.toFixed(3)}
                              {/* {e?.metal?.map((a, i) => {
                                return <div key={i}>{a?.Wt?.toFixed(3)}</div>;
                              })} */}
                            </div>
                            <div
                              className="border-end pad_end_ji2 endc_ji2"
                              style={{ width: "17%" }}
                            >
                              { formatAmount( (e?.MetalAmount)/(e?.NetWt_d + e?.LossWt_d)) }
                              {/* {e?.metal?.map((a, i) => {
                                return (
                                  <div key={i}>{formatAmount(a?.Rate)}</div>
                                );
                              })} */}
                            </div>
                            <div
                              className="pad_end_ji2 endc_ji2"
                              style={{ width: "26%" }}
                            >
                              {formatAmount(e?.MetalAmount)}
                            </div>
                          </div>
                          {e?.diamond_colorstone_misc?.map((el, ind) => {
                            return (
                              <div className="d-flex border-bottom fs_ji2 lh_ji2" key={ind}>
                                <div
                                  className="border-end pad_start_ji2"
                                  style={{ width: "26%" }}
                                >
                                  {el?.MasterManagement_DiamondStoneTypeName} <span>{ el?.MasterManagement_DiamondStoneTypeid === 1 ? el?.QualityName : ''}</span>
                                </div>
                                <div
                                  className="border-end pad_end_ji2 endc_ji2"
                                  style={{ width: "14.4%" }}
                                >
                                  {el?.Pcs}
                                </div>
                                <div
                                  className="border-end pad_end_ji2 endc_ji2"
                                  style={{ width: "16.6%" }}
                                >
                                  {el?.a_wt?.toFixed(3)}
                                </div>
                                <div
                                  className="border-end pad_end_ji2 endc_ji2"
                                  style={{ width: "17%" }}
                                >
                                  {formatAmount(el?.a_rate)}
                                  {/* {console.log(((+el?.a_amount)/(+el?.a_wt)))} */}
                                  {/* {el?.a_wt === 0 ? '' :  formatAmount((+el?.a_amount)/(+el?.a_wt))} */}
                                </div>
                                <div
                                  className="pad_end_ji2 endc_ji2"
                                  style={{ width: "26%" }}
                                >
                                  {formatAmount(el?.a_amount)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="col8_ji2 border-end pad_end_ji2 endc_ji2">
                          {formatAmount(e?.TotalDiaSetcost + e?.MakingAmount)}
                        </div>
                        <div className="col9_ji2 border-end pad_end_ji2 endc_ji2">
                          {formatAmount(
                            e?.TotalDiamondHandling + e?.OtherCharges
                          )}
                        </div>
                        <div className="col10_ji2 pad_end_ji2 endc_ji2">
                          {formatAmount(e?.TotalAmount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="d-flex fw-bold border border-top-0 fs_ji2 lh_ji2 h40_ji2">
                  <div className="col1_ji2 border-end"></div>
                  <div className="col2_ji2 border-end d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-between align-items-center w-100 px-2"><div>TOTAL</div><div>{result?.mainTotal?.grosswt?.toFixed(3)} gm Gross</div></div>
                  </div>
                  <div className="col3_ji2 border-end"></div>
                  <div className="col4_ji2 border-end endc_ji2 pad_end_ji2">
                    {/* {result?.mainTotal?.diamond_colorstone_misc?.Pcs} */}
                    {totobj?.pcs}
                  </div>
                  <div className="col5_ji2 border-end center_ji2">
                    {/* {result?.mainTotal?.diamond_colorstone_misc?.Wt?.toFixed(3)} Ctw <br /> 43.476 gm */}
                    {totobj?.wt?.toFixed(3)} Ctw <br /> 43.476 gm
                  </div>
                  <div className="col6_ji2 border-end"></div>
                  <div className="col7_ji2 border-end endc_ji2 pad_end_ji2">
                    {formatAmount((result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.colorstone?.Amount + result?.mainTotal?.misc?.Amount + result?.mainTotal?.MetalAmount))}
                  </div>
                  <div className="col8_ji2 border-end endc_ji2 pad_end_ji2">
                    {formatAmount(result?.mainTotal?.total_MakingAmount_Setting_Amount)}
                  </div>
                  <div className="col9_ji2 border-end endc_ji2 pad_end_ji2">
                    { formatAmount((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling)) }
                  </div>
                  <div className="col10_ji2 endc_ji2 pad_end_ji2">
                    {formatAmount(result?.mainTotal?.total_unitcost)}
                  </div>
                </div>
              </div>
              <div className="d-flex border border-top-0">
                <div className="border-end p-1 d-flex flex-column justify-content-end fs_ji2 lh_ji2 " style={{width:'70%'}}>
                   In Words Indian Rupees <br />
                  <b>{toWords?.convert((result?.finalAmount))} Only /-</b>
                </div>
                <div  style={{width:'30%'}}>
                   {result?.mainTotal?.total_discount_amount > 0 ?<div className="fs_ji2 lh_ji2 d-flex"><div className="w-50 border-end endc_ji2 pe-2">Discount</div><div className="w-50 endc_ji2 pad_end_ji2">{result?.mainTotal?.total_discount_amount?.toFixed(2)}</div></div> : '' } 
                  <div className="d-flex fw-bold fs_ji2 lh_ji2"><div className="w-50 border-end pe-2 endc_ji2">Amount</div><div className="w-50 endc_ji2 pad_end_ji2">{formatAmount(result?.mainTotal?.total_amount)}</div></div>
                  {
                    result?.allTaxes?.map((e, i) => {
                      return(
                        <div className="d-flex fs_ji2 lh_ji2" key={i}>
                          <div className="w-50 border-end endc_ji2 pe-2">{e?.name} @ {e?.per}</div>
                          <div className="w-50 endc_ji2 pad_end_ji2">{e?.amount}</div>
                        </div>
                      )
                    })
                  }
                  <div className="d-flex fs_ji2 lh_ji2"><div className="w-50 border-end endc_ji2 pe-2">{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div><div className="w-50 endc_ji2 pad_end_ji2">{result?.header?.AddLess}</div></div>
                  <div className="d-flex fs_ji2 lh_ji2 border-top fw-bold"><div className="w-50 border-end p-1 endc_ji2 pad_end_ji2">Grand Total</div><div className="w-50 p-1 endc_ji2 pad_end_ji2">{formatAmount(result?.finalAmount)}</div></div>
                </div>
              </div>
               <div className="fw-bold p-1 fs_ji2 lh_ji2 border border-top-0"><div className="fw-bold">Declaration :</div><div dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div></div>
               <div className="fs_ji2 lh_ji2 p-1 border border-top-0"><b>REMARKS : &nbsp;&nbsp;</b>{result?.header?.PrintRemark}</div>
               <div className='d-flex border border-top-0 fs_ji2 lh_ji2'>
                <div className='w33_ji2 border-end p-1'>
                  <div className='fw-bold'>Bank Detail</div>
                  <div>Bank Name: {result?.header?.bankname}</div>
                  <div>Branch: {result?.header?.bankaddress}</div>
                  <div>Account Name: {result?.header?.accountname}</div>
                  <div>Account No. : {result?.header?.accountnumber}</div>
                  <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
                  {/* <div>Enquiry No. (E & OE)</div> */}
                </div>
                <div className='w33_ji2 d-flex flex-column justify-content-between border-end p-1 '>
                  <div>Signature</div>
                  <div className='fw-bold'>{result?.header?.customerfirmname}</div>
                </div>
                <div className='w33_ji2 d-flex flex-column justify-content-between p-1'>
                  <div>Signature</div>
                  <div className='fw-bold'>{result?.header?.CompanyFullName}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default JewelleryInvoice2;
