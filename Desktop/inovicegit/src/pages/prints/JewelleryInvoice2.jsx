import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import { apiCall, isObjectEmpty } from "../../GlobalFunctions";
import "../../assets/css/prints/jewelleryinvoice2.css";
import { formatAmount } from "./../../GlobalFunctions";
import { ToWords } from "to-words";
const JewelleryInvoice2 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [metWise, setMetWise] = useState([]);
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
    console.log(datas);
    setResult(datas);

    let metwise = [];

    // let finalArr = [];
    // datas?.resultArray?.forEach((e, i) => {
    //   let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
    //   let obj = cloneDeep(e);
    //   if (findGold !== undefined) {
    //     obj.metalRate = findGold?.Rate;
    //     obj.metalAmount = findGold?.Amount;
    //     obj.metalWeight = findGold?.Wt;
    //     obj.metalPcs = findGold?.Pcs;
    //   } else {
    //     obj.metalRate = 0;
    //     obj.metalAmount = 0;
    //     obj.metalWeight = 0;
    //     obj.metalPcs = 0;
    //   }
    //   finalArr.push(obj);
    // });
    // datas.resultArray = finalArr
    datas?.resultArray?.forEach((e) => {
      let findRecord = metwise?.findIndex(
        (a) => a?.MetalPurity === e?.MetalPurity 
        // && a?.metalRate === e?.metalRate
      );
      if (findRecord === -1) {
        let obj = { ...e };
        obj.OtherCharges_d = 0;
        obj.UnitCost_d = 0;
        obj.TotalDiaSetcost_d = 0;
        obj.TotalDiamondHandling_d = 0;
        obj.TotalAmount_d = 0;
        obj.MiscAmount_d = 0;
        obj.MakingAmount_d = 0;
        obj.MetalAmount_d = 0;
        obj.grosswt_d = 0;
        obj.NetWt_d = 0;
        obj.LossWt_d = 0;
        metwise.push(obj);
      } else {
        metwise[findRecord].OtherCharges_d += e?.OtherCharges;
        metwise[findRecord].UnitCost_d += e?.UnitCost;
        metwise[findRecord].TotalDiaSetcost_d += e?.TotalDiaSetcost;
        metwise[findRecord].TotalDiamondHandling_d += e?.TotalDiamondHandling;
        metwise[findRecord].TotalAmount_d += e?.TotalAmount;
        metwise[findRecord].MiscAmount_d += e?.MiscAmount;
        metwise[findRecord].MakingAmount_d += e?.MakingAmount;
        metwise[findRecord].MetalAmount_d += e?.MetalAmount;
        metwise[findRecord].grosswt_d += e?.grosswt;
        metwise[findRecord].NetWt_d += e?.NetWt;
        metwise[findRecord].LossWt_d += e?.LossWt;
        metwise[findRecord].diamond_colorstone_misc = [...metwise[findRecord].diamond_colorstone_misc, ...e.diamond_colorstone_misc].flat()
      }
    });
    
    metwise?.forEach((a) => {
        let obj_a = {...a};
        let  metwise2 = [];
        obj_a?.diamond_colorstone_misc?.forEach((el) => {
            let find_record = metwise2?.findIndex((ele) =>  (ele?.Colorname === el?.Colorname && 
                                                          ele?.QualityName === el?.QualityName &&
                                                ele?.MasterManagement_DiamondStoneTypeName === el?.MasterManagement_DiamondStoneTypeName))
            if(find_record === -1){
                let obj = {...el};
                obj.wt_Wt = el?.Wt;
                obj.pcs_Pcs = el?.Pcs;
                obj.rt_Rate = el?.Rate;
                obj.amt_Amount = el?.Amount;
                metwise2.push(obj);
            }else{
                metwise2[find_record].wt_Wt += el?.Wt;
                metwise2[find_record].pcs_Pcs += el?.Pcs;
                metwise2[find_record].rt_Rate += el?.Rate;
                metwise2[find_record].amt_Amount += el?.Amount;
            }
        })
        // console.log(obj_a?.diamond_colorstone_misc);
        obj_a.diamond_colorstone_misc = metwise2;
        console.log(obj_a?.diamond_colorstone_misc);
    })
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
              <div>
                <div className="headlabel_ji2">
                  {result?.header?.PrintHeadLabel}
                </div>
                <div className="fs_ji2 lh_ji2 pb-2">
                  <div className="fw-bold">
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
                <div className="w33_ji2 border-end p-1">
                  <div>{result?.header?.lblBillTo}</div>
                  <div>{result?.header?.customerfirmname}</div>
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
                <div className="w33_ji2 border-end p-1">
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
                <div className="w33_ji2 p-1">
                  <div className="d-flex">
                    <div className="w-50 fw-bold">VOUCHER</div>
                    <div className="w-50">{result?.header?.InvoiceNo}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 fw-bold">DATE</div>
                    <div className="w-50">{result?.header?.EntryDate}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50 fw-bold">
                      {result?.header?.HSN_No_Label}
                    </div>
                    <div className="w-50">{result?.header?.HSN_No}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex fw-bold border mt-2">
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
                      <div className="d-flex border border-top-0" key={i}>
                        <div className="col1_ji2 border-end center_ji2">
                          {i + 1}
                        </div>
                        <div className="col2_ji2 border-end pad_start_ji2">
                          {" "}
                          New Jewellery <br /> <b>{e?.grosswt?.toFixed(3)}</b> gm Gross
                        </div>
                        <div
                          className="col3_ji2 border-end "
                          style={{ width: "42%" }}
                        >
                          <div className="d-flex border-bottom">
                            <div
                              className="border-end pad_start_ji2"
                              style={{ width: "19%" }}
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
                              {e?.metal?.map((a, i) => {
                                return <div key={i}>{a?.Wt?.toFixed(3)}</div>;
                              })}
                            </div>
                            <div
                              className="border-end pad_end_ji2 endc_ji2"
                              style={{ width: "24%" }}
                            >
                              {e?.metal?.map((a, i) => {
                                return (
                                  <div key={i}>{formatAmount(a?.Rate)}</div>
                                );
                              })}
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
                              <div className="d-flex border-bottom" key={ind}>
                                <div
                                  className="border-end pad_start_ji2"
                                  style={{ width: "19%" }}
                                >
                                  {el?.MasterManagement_DiamondStoneTypeName}
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
                                  {el?.Wt?.toFixed(3)}
                                </div>
                                <div
                                  className="border-end pad_end_ji2 endc_ji2"
                                  style={{ width: "24%" }}
                                >
                                  {formatAmount(el?.Rate)}
                                </div>
                                <div
                                  className="pad_end_ji2 endc_ji2"
                                  style={{ width: "26%" }}
                                >
                                  {formatAmount(el?.Amount)}
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
                <div className="d-flex fw-bold border border-top-0">
                  <div className="col1_ji2 border-end"></div>
                  <div className="col2_ji2 border-end d-flex justify-content-between align-items-center">
                    TOTAL
                  </div>
                  <div className="col3_ji2 border-end"></div>
                  <div className="col4_ji2 border-end endc_ji2 pad_end_ji2">
                    {result?.mainTotal?.diamond_colorstone_misc?.Pcs}
                  </div>
                  <div className="col5_ji2 border-end center_ji2">
                    {result?.mainTotal?.diamond_colorstone_misc?.Wt?.toFixed(3)} Ctw <br /> 43.476 gm
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
                <div className="border-end p-1" style={{width:'70%'}}>
                   In Words Indian Rupees <br />
                  <b>{toWords?.convert((result?.finalAmount))} Only /-</b>
                </div>
                <div  style={{width:'30%'}}>
                   {result?.mainTotal?.total_discount > 0 ?<div className="d-flex"><div className="w-50 border-end">Discount</div><div className="w-50">{result?.mainTotal?.total_discount?.toFixed(2)}</div></div> : '' } 
                  <div className="d-flex fw-bold"><div className="w-50 border-end">Amount</div><div className="w-50 ">{formatAmount(result?.mainTotal?.total_amount)}</div></div>
                  {
                    result?.allTaxes?.map((e, i) => {
                      return(
                        <div className="d-flex" key={i}>
                          <div className="w-50 border-end">{e?.name} @ {e?.per}</div>
                          <div className="w-50">{e?.amount}</div>
                        </div>
                      )
                    })
                  }
                  <div className="d-flex"><div className="w-50 border-end">{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div><div className="w-50">{result?.header?.AddLess}</div></div>
                  <div className="d-flex border-top fw-bold"><div className="w-50 border-end p-1">Grand Total</div><div className="w-50 p-1">{formatAmount(result?.finalAmount)}</div></div>
                </div>
              </div>
              <div className="fw-bold p-1 fs_ji2 lh_ji2 border border-top-0" dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
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
