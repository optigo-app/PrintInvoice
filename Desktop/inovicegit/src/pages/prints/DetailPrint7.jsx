import React, { useEffect, useState } from "react";
import { OrganizeDataPrint } from "./../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import "../../assets/css/prints/detailprint7.css";
import { ToWords } from "to-words";
import {
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  
} from "../../GlobalFunctions";
import { cloneDeep } from "lodash";

const DetailPrint7 = ({ token, invoiceNo, printName, urls, evn }) => {

  const toWords = new ToWords();

  const [result, setResult] = useState(null);
  const [categoryWise, setCategoryWise] = useState([]);
  const [miscWise, setMiscWise] = useState([]);
  const [otherAMountTotal, setOtherAmountTotal] = useState(0);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [miscWise_total, setMiscWise_total] = useState({
    Pcs: 0,
    pcPcs:0,
    wtWeight_Ctw:0,
    wtWeight_gm:0,
    AmtAmount:0,
    Wt:0,
    Wt_Ctw: 0,
    dia_Wt_gm: 0,
    Wt_gm: 0,
    Amount: 0,
  });
  
  async function loadData(data) {
    try {
      
      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      //certification wt added
      datas?.resultArray?.forEach((e) => {
        datas?.json2?.forEach((el) => {
          if (e?.SrJobno === el?.StockBarcode) {
            if (
              el?.ShapeName === "Certification_NM award" &&
              el?.MasterManagement_DiamondStoneTypeid === 3
            ) {
              el.Wt = e?.certificateWtDia;
            }
          }
        });
      });

      let blankArr = [];
      //category wise data setting
      datas?.resultArray?.forEach((j2) => {
        let recordIs = blankArr?.findIndex(
          (e) => (e?.Categoryname === j2?.Categoryname && e?.Wastage === j2?.Wastage)
        );
        if (recordIs === -1) {
          let obj = {...j2};
          obj.GrossWt = j2?.grosswt;
          obj.netwt = j2?.NetWt;
          obj.fineWtByMetalWtCalculation_finewt =  j2?.fineWtByMetalWtCalculation;
          // obj.quantity = j2?.Quantity;
          // obj.wastage = j2?.wastage;
          blankArr.push(obj);
        } else {
          blankArr[recordIs].GrossWt += +j2?.grosswt;
          blankArr[recordIs].netwt += +j2?.NetWt;
          blankArr[recordIs].Wastage += +j2?.Wastage;
          blankArr[recordIs].PureNetWt += +j2?.PureNetWt;
          blankArr[recordIs].Quantity += +j2?.Quantity;
          blankArr[recordIs].fineWtByMetalWtCalculation_finewt += +j2?.fineWtByMetalWtCalculation;
        }
      });

      //cate wise data and finewt
      let cateWise2 = [];
      let fine_wt_calculation = 0;
      blankArr?.forEach((e) => {
        let obj = { ...e };
        let netwtwithloss = (e?.netwt + e?.LossWt)
        let fineWtBYNetWtCal = 0;
        fineWtBYNetWtCal += e?.fineWtByMetalWtCalculation_finewt;
        if(e?.LossWt === 0){
          fine_wt_calculation += e?.PureNetWt;
        }else{
            fine_wt_calculation += (((((e?.NetWt - e?.totals?.finding?.Wt) * (e?.Tunch))/100) + (e?.totals?.finding?.FineWt)))
        }
        obj.fineWtBYNetWtCal = fineWtBYNetWtCal;
        obj.netwtwithloss = netwtwithloss;
        cateWise2.push(obj);
      });
      datas.mainTotal.total_fineWtByMetalWtCalculation = fine_wt_calculation;
      cateWise2.sort((a, b) => a.GrossWt - b.GrossWt);
      
      let othamttot = 0;

      datas?.resultArray?.forEach((e) => {
        datas?.json2?.forEach((el) => {
          if (e?.SrJobno === el?.StockBarcode) {
            if (
              el?.MasterManagement_DiamondStoneTypeid === 3 &&
              (el?.ShapeName === "Hallmark" ||
                el?.ShapeName === "Stamping" ||
                el?.ShapeName?.includes("Certification_"))
            ) {
              e.OtherCharges += el?.Amount;
            }
          }
        });
      });

      datas?.resultArray?.forEach((e) => {
        othamttot += e?.OtherCharges + e?.TotalDiamondHandling;
      });

      setOtherAmountTotal(othamttot);
      setCategoryWise(cateWise2);
      // setResult(datas);
      setLoader(false);


      //product summary wise start
      let miscs = [];
      let colorstones = [];
      // eslint-disable-next-line array-callback-return
      datas.json2.map((ele, ind) => {
        if(ele?.ShapeName === 'Stamping' || ele?.ShapeName === 'Hallmark'){}
        else{
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstones.push(ele);
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            miscs.push(ele);
          }
        }
      });
  
      let miscs_filter = [];
      let colrStone_filter = [];
  
      // eslint-disable-next-line array-callback-return
      miscs?.map((ele, ind) => {
        let findMiscs = miscs_filter.findIndex(
          (elem, index) => (elem?.ShapeName === ele?.ShapeName && elem?.Rate === ele?.Rate)
        );
        if (findMiscs === -1) {
          let objj = {...ele};
          objj.wtWeight = ele?.Wt;
          objj.pcPcs = ele?.Pcs;
          objj.AmtAmount = ele?.Amount;
          miscs_filter.push(objj);
        } else {
          miscs_filter[findMiscs].wtWeight += ele?.Wt;
          miscs_filter[findMiscs].pcPcs += ele?.Pcs;
          miscs_filter[findMiscs].AmtAmount += ele?.Amount;
        }
      });
  
      // eslint-disable-next-line array-callback-return
      colorstones?.map((ele, ind) => {
        let findcs = colrStone_filter?.findIndex(
          (elem, index) => (elem?.ShapeName === ele?.ShapeName && elem?.Rate === ele?.Rate)
        );
        if (findcs === -1) {
          let objj = {...ele};
          objj.wtWeight = ele?.Wt;
          objj.pcPcs = ele?.Pcs;
          objj.AmtAmount = ele?.Amount;
          colrStone_filter.push(objj);
        } else {
          colrStone_filter[findcs].wtWeight += ele?.Wt;
          colrStone_filter[findcs].pcPcs += ele?.Pcs;
          colrStone_filter[findcs].AmtAmount += ele?.Amount;
        }
      });

      let arrnew = [...colrStone_filter, ...miscs_filter].flat();

      let misc_sum_total = {
        Pcs: 0,
        pcPcs:0,
        wtWeight_Ctw:0,
        wtWeight_gm:0,
        Wt_Ctw: 0,
        dia_Wt_gm: 0,
        Wt_gm: 0,
        Amount: 0,
        AmtAmount: 0,
      }

      arrnew?.forEach((e) => {
        if(e?.MasterManagement_DiamondStoneTypeid === 2){
          misc_sum_total.wtWeight_Ctw += e?.wtWeight;
        }else{
          misc_sum_total.wtWeight_gm += e?.wtWeight;
        }
          misc_sum_total.pcPcs += e?.pcPcs;
          misc_sum_total.AmtAmount += e?.AmtAmount;

          misc_sum_total.Wt += e?.Wt;
          misc_sum_total.Pcs += e?.Pcs;
          misc_sum_total.Amount += e?.Amount;
      })
      //product summary wise stop
      setMiscWise(arrnew);
      setMiscWise_total(misc_sum_total);

      let nvoarray = [];
      datas?.resultArray?.forEach((e) => {
        let grp = [];
        let obj = {...e};
        e?.diamond_colorstone_misc?.forEach((el) => {
          let find_red = grp?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.Colorname === el?.Colorname && a?.QualityName === el?.QualityName);
          if(find_red === -1){
            let a_obj = {...el};
            a_obj.dcm_wt = el?.Wt;
            a_obj.dcm_amt = el?.Amount;
            a_obj.dcm_rate = el?.Rate;
            a_obj.dcm_pcs = el?.Pcs;
            grp.push(a_obj);
          }else{
              grp[find_red].dcm_wt += el?.Wt;
              grp[find_red].dcm_rate += el?.Rate;
              grp[find_red].dcm_amt += el?.Amount;
              grp[find_red].dcm_pcs += el?.Pcs;
          }
        })
        obj.dcm_grp = grp;
        nvoarray.push(obj);
      })
      datas.resultArray = nvoarray;
      setResult(datas)
  
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            // separateData(data?.Data);
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

  // const separateData = (data) => {
  //     const deep_data = cloneDeep(data);
  //     let dia_arr = [];
  //     let cls_arr = [];
  //     let misc_arr = [];
      
  //     deep_data?.BillPrint_Json2?.forEach((j2) => {

  //         if(j2?.MasterManagement_DiamondStoneTypeid === 1){
  //           dia_arr?.push(j2);
  //         }
  //         if(j2?.MasterManagement_DiamondStoneTypeid === 2){
  //           cls_arr?.push(j2);
  //         }
  //         if(j2?.MasterManagement_DiamondStoneTypeid === 3){
  //           misc_arr?.push(j2);
  //         }
  //     });

  //     let dia_grp_arr = [];
  //     let cls_grp_arr = [];
  //     let misc_grp_arr = [];

  //     dia_arr?.forEach((e) => {
  //         let findInd = dia_grp_arr?.findIndex((ele) => ele?.ShapeName === e?.ShapeName && ele?.QualityName === e?.QualityName && ele?.Colorname === e.Colorname && ele?.SizeName === e?.SizeName)
  //         if(findInd === -1){
  //           dia_grp_arr.push(e)
  //         }else{
  //           dia_grp_arr[findInd].Wt += e?.Wt;
  //           dia_grp_arr[findInd].Pcs += e?.Pcs;
  //           dia_grp_arr[findInd].Amount += e?.Amount;
  //           dia_grp_arr[findInd].Rate += e?.Rate;
  //         }
  //     })
  //     cls_arr?.forEach((e) => {
  //         let findInd = cls_grp_arr?.findIndex((ele) => ele?.ShapeName === e?.ShapeName && ele?.QualityName === e?.QualityName && ele?.Colorname === e.Colorname && ele?.SizeName === e?.SizeName)
  //         if(findInd === -1){
  //           cls_grp_arr.push(e)
  //         }else{
  //           cls_grp_arr[findInd].Wt += e?.Wt;
  //           cls_grp_arr[findInd].Pcs += e?.Pcs;
  //           cls_grp_arr[findInd].Amount += e?.Amount;
  //           cls_grp_arr[findInd].Rate += e?.Rate;
  //         }
  //     })
  //     misc_arr?.forEach((e) => {
  //       let findInd = misc_grp_arr?.findIndex((ele) => ele?.ShapeName === e?.ShapeName && ele?.QualityName === e?.QualityName && ele?.Colorname === e.Colorname && ele?.SizeName === e?.SizeName)
  //       if(findInd === -1){
  //         misc_grp_arr.push(e)
  //       }else{
  //         misc_grp_arr[findInd].Wt += e?.Wt;
  //         misc_grp_arr[findInd].Pcs += e?.Pcs;
  //         misc_grp_arr[findInd].Amount += e?.Amount;
  //         misc_grp_arr[findInd].Rate += e?.Rate;
  //       }
  //   })

  //   let dia_cls_misc_merge = [...dia_grp_arr, ...cls_grp_arr, ...misc_grp_arr];
  //   setDia_Cls_Misc_Arr(dia_cls_misc_merge);

  // }
  
  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerdp7 pb-5 mb-5">
                {/* image show flag */}
                <div className="d-flex justify-content-end align-items-center my-5 fsgdp7 hidebtn">
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
                {/* table header */}
                <div>
                  {result?.header?.PrintHeadLabel === '' ? '' : <div className="pheaddp7 w-100">
                    {result?.header?.PrintHeadLabel}
                  </div> } 
                  <div className="d-flex justify-content-between align-items-center p-1 ">
                    <div className="w-75 fsgdp7">
                      <div className="fw-bold fsgdp7_ lhdp7">
                        {result?.header?.CompanyFullName}
                      </div>
                      <div className="fsgdp7 lhdp7">
                        {result?.header?.CompanyAddress}
                      </div>
                      <div className="fsgdp7 lhdp7">
                        {result?.header?.CompanyCity}-
                        {result?.header?.CompanyPinCode},
                        {result?.header?.CompanyState}(
                        {result?.header?.CompanyState})
                      </div>
                      <div className="fsgdp7 lhdp7">
                        T {result?.header?.CompanyTellNo} | TOLL FREE{" "}
                        {result?.header?.CompanyTollFreeNo} | TOLL FREE{" "}
                        {result?.header?.CompanyTollFreeNo}
                      </div>
                      <div className="fsgdp7 lhdp7">
                        {result?.header?.CompanyEmail} |{" "}
                        {result?.header?.CompanyWebsite}
                      </div>
                      <div className="fsgdp7 lhdp7">
                        {result?.header?.Company_VAT_GST_No} |{" "}
                        {result?.header?.Company_CST_STATE} -{" "}
                        {result?.header?.Company_CST_STATE_No} | PAN-
                        {result?.header?.Pannumber}{" "}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end w-25 fsgdp7">
                      <img
                        src={result?.header?.PrintLogo}
                        alt="#companylogo"
                        className="headimgdp7"
                      />
                    </div>
                  </div>
                </div>

                {/* table sub header */}
                <div className="d-flex subhead hcompdp7 fsgdp7">
                  <div className="subheaddiv1">
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.lblBillTo}
                    </div>
                    <div className="_fsgdp7_ lhdp7">
                      <b>{result?.header?.customerfirmname}</b>
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customerAddress1}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customerAddress2}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customercity1}{" "}
                      {result?.header?.customerpincode}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.customeremail1}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.vat_cst_pan}
                    </div>
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.Cust_CST_STATE} -{" "}
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subheaddiv2">
                    <div className="fsgdp7 lhdp7">Ship To,</div>
                    <div className="_fsgdp7_ lhdp7">
                      <b>{result?.header?.customerfirmname}</b>
                    </div>
                    {result?.header?.address?.map((e, i) => {
                      return (
                        <div className="fsgdp7 lhdp7" key={i}>
                          {e}
                        </div>
                      );
                    })}
                  </div>
                  <div className="subheaddiv3 fsgdp7">
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">INVOICE NO</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.InvoiceNo}
                      </span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">DATE</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.EntryDate}
                      </span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">{result?.header?.HSN_No_Label}</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.HSN_No}
                      </span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">Delivery Mode</span>
                      <span className="w-50 d-flex justify-content-start"></span>
                    </div>
                    <div className="fsgdp7 lhdp7 d-flex justify-content-between">
                      <span className="w-50 fw-bold">Sales Person</span>
                      <span className="w-50 d-flex justify-content-start">
                        {result?.header?.SalPerName?.split(" ")[0]}
                      </span>
                    </div>
                    <div>
                      <div className="d-flex"><div className="fw-bold w-50">Due Date :</div><div className="w-50">{result?.header?.DueDate}</div></div>
                      <div className="d-flex"><div className="fw-bold w-50">Terms :</div><div className="w-50">{result?.header?.DueDays}</div></div>
                    </div>
                  </div>
                </div>

                {/* table head */}
                <div className="tabledp7 fsgdp7">
                  <div className="theaddp7 hcompdp7 bordersdp7">
                    <div className="col1dp7 dp7cen">SR#</div>
                    <div className="col2dp7 dp7cen">DESIGN DESCRIPTION</div>
                    <div className="col3dp7 dp7cen">KT/COL</div>
                    <div className="col4dp7 dp7cen">GROSS</div>
                    <div className="col5dp7 dp7cen">NET</div>
                    <div className="col6dp7 dp7cen">WASTAGE</div>
                    <div className="col7dp7 d-flex flex-column h-100">
                      <div className="dp7cen brbdp7 h-50">
                        STONE DESCRIPTION
                      </div>
                      <div className="d-flex subcoldp7 h-50">
                        <div className="dp7cen w_subcoldp7 brdp7">MIS TYPE</div>
                        <div className="dp7cen w_subcoldp7 brdp7">PCS</div>
                        <div className="dp7cen w_subcoldp7 brdp7">WT</div>
                        <div className="dp7cen w_subcoldp7 brdp7">RATE</div>
                        <div className="dp7cen w_subcoldp7 brdp7">AMOUNT</div>
                      </div>
                    </div>
                    <div className="col8dp7 dp7cen d-flex flex-column">
                      <span>OTHER</span>
                      <span>CHARGES</span>
                    </div>
                    <div className="col9dp7 dp7cen border-end-0">FINE</div>
                  </div>
                  <div className="tbodydp7">
                    {result?.resultArray?.map((e, i) => {

                      return (
                        <div
                          className="d-flex brbdp7 hcompdp7 bordersdp7"
                          key={i}
                        >
                          <div className="rcol1dp7 dp7cen1">{i+1}</div>
                          <div className="rcol2dp7 d-flex flex-column  justify-content-between  align-items-start p-1">
                            <div className="d-flex justify-content-between align-items-start w-100">
                              <div>{e?.designno}</div>
                              <div>{e?.SrJobno}</div>
                            </div>
                            {imgFlag ? (
                              <div className="w-100 d-flex justify-content-center align-items-start">
                                <img
                                  src={e?.DesignImage}
                                  onError={(e) => handleImageError(e)}
                                  alt="design"
                                  className="rowimgdp7"
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="w-100 d-flex justify-content-center align-items-start">
                              {e?.HUID === "" ? "" : `HUID - ${e?.HUID}`}
                            </div>
                          </div>
                          <div
                            className="rcol3dp7 dp7cen1"
                            style={{ wordBreak: "break-word" }}
                          >
                            {e?.MetalPurity}/{e?.MetalColor}
                          </div>
                          <div className="rcol4dp7 dp7cen2">
                            {e?.grosswt?.toFixed(3)}
                          </div>
                          <div className="rcol5dp7 dp7cen2">
                            {(e?.NetWt + e?.LossWt)?.toFixed(3)}
                          </div>
                          <div className="rcol6dp7 dp7cen2">
                            {e?.Wastage?.toFixed(3)}
                          </div>
                          <div style={{ width: "" }} className=" col7dp7 ">
                            <div className="d-grid h-100">
                            {/* {e?.diamond_colorstone_misc?.map((el, ind) => { */}
                            {e?.dcm_grp?.map((el, ind) => {
                                return (
                                  <div className="d-flex brtdp7" key={ind}>
                                    <div className="w_subcoldp7 dp7cen1 brdp7">
                                      {el?.ShapeName}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.dcm_pcs}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.ShapeName ===
                                      "Certification_NM award"
                                        ? e?.certificateWtDia?.toFixed(3)
                                        : el?.dcm_wt?.toFixed(3)}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                        {el?.ShapeName === "Certification_NM award" ? (formatAmount(((el?.dcm_amt)/(e?.certificateWtDia === 0 ? 1 : e?.certificateWtDia))))
                                        : (formatAmount((el?.dcm_amt)/(el?.dcm_wt)))}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2">
                                      {el?.dcm_amt?.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })}
                              {/* {e?.diamond_colorstone_misc?.map((el, ind) => {
                                return (
                                  <div className="d-flex brtdp7" key={ind}>
                                    <div className="w_subcoldp7 dp7cen1 brdp7">
                                      {el?.ShapeName}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.Pcs}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.ShapeName ===
                                      "Certification_NM award"
                                        ? e?.certificateWtDia?.toFixed(3)
                                        : el?.Wt?.toFixed(3)}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.Rate?.toFixed(2)}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2">
                                      {el?.Amount?.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })} */}
                            </div>
                          </div>
                          <div className="rcol12dp7 dp7cen2 bldp7">
                            {formatAmount(
                              e?.OtherCharges + e?.TotalDiamondHandling
                            )}
                          </div>
                          <div className="rcol13dp7 dp7cen2 border-end-0">

                            {e?.LossWt === 0 ? e?.PureNetWt : ((
                              (((e?.NetWt - e?.totals?.finding?.Wt) * (e?.Tunch))/100)
                               + (e?.totals?.finding?.FineWt))?.toFixed(3))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* table all row total */}
                <div className="totaldp7 w-100 brtdp7 border-top-0 border-start border-end fsgdp7">
                  <div className="totcol1dp7"></div>
                  <div className="totcol2dp7 dp7cen2">
                    {result?.mainTotal?.grosswt !== 0 && result?.mainTotal?.grosswt?.toFixed(3)}
                  </div>
                  <div className="totcol3dp7 dp7cen2">
                    {result?.mainTotal?.netwtWithLossWt !== 0 && result?.mainTotal?.netwtWithLossWt?.toFixed(3)}
                  </div>
                  <div className="totcol4dp7"></div>
                  <div className="totcol5dp7 dp7cen2">
                    {result?.mainTotal?.total_diamond_colorstone_misc_amount !== 0 && formatAmount(result?.mainTotal?.total_diamond_colorstone_misc_amount)}
                  </div>
                  <div className="totcol6dp7 dp7cen2">
                    {otherAMountTotal !== 0 && formatAmount(otherAMountTotal)}
                  </div>
                  <div className="totcol7dp7 dp7cen2">
                    {result?.mainTotal?.total_fineWtByMetalWtCalculation !== 0 && result?.mainTotal?.total_fineWtByMetalWtCalculation?.toFixed(3)}
                  </div>
                </div>

                {/* table total */}
                <div className="w-100 brtdp7 dp7cen2 bradp7 fsgdp7">
                  {result?.mainTotal?.total_amount !== 0 && formatAmount(result?.mainTotal?.total_amount)}
                </div>

                {/* Courier info and Charges */}
                <div className="w-100 d-flex border border-top-0 fsgdp7">
                  <div style={{ width: "69.9%" }}></div>
                  <div style={{ width: "30.1%" }} className="d-flex">
                    <div
                      style={{ width: "63%" }}
                      className="border-end border-start px-1  dp7cen2  "
                    >
                      {result?.header?.ModeOfDel} :{" "}
                    </div>
                    <div style={{ width: "37%" }} className="px-1  dp7cen2  ">
                      {" "}
                      {formatAmount(result?.header?.FreightCharges)}
                    </div>
                  </div>
                </div>

                {/* taxes */}
                {result?.allTaxes?.map((e, i) => {
                  return (
                    <div
                      className="w-100 bradp7 border-bottom-0 border-top-0 taxdp7 fsgdp7"
                      key={i}
                    >
                      <div className="taxdp7d1">{e?.amountInWords}</div>
                      <div className="taxdp7d2 dp7cen2">
                        {e?.name} @ {e?.per}
                      </div>
                      <div className="taxdp7d3 dp7cen2">{e?.amount}</div>
                    </div>
                  );
                })}
                <div className="w-100 bradp7 border-top-0 taxdp7 fsgdp7">
                  <div className="taxdp7d4"></div>
                  <div className="taxdp7d2 dp7cen2 bldp7">
                    Sales Rounded Off
                  </div>
                  <div className="taxdp7d3 dp7cen2">
                    {result?.header?.AddLess}
                  </div>
                </div>

                {/* grand total */}
                <div className="w-100 bradp7 border-top-0 taxdp7 finalAmt_h fsgdp7">
                  <div
                    className="taxdp7d1 fw-bold ps-1 h-100 dp7cen1"
                    style={{ width: "70.5%" }}
                  >
                    Total
                  </div>
                  <div
                    className="taxdp7d2 dp7cen2 bldp7 h-100 border-0 "
                    style={{ width: "19%" }}
                  ></div>
                  <div
                    className="taxdp7d3 dp7cen2 fw-bold pe-2 h-100 border-end-0 bldp7"
                    style={{ width: "11.2%" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: result?.header?.Currencysymbol,
                      }}
                    ></div>
                    <div className="ps-1">
                      {(result?.finalAmount + result?.heder?.FreightCharges) !== 0 && formatAmount((result?.finalAmount + result?.header?.FreightCharges))}
                    </div>
                  </div>
                </div>
                <div className="w-100 d-flex brbdp7 brdp7 bldp7 fsgdp7">
                  <div
                    className="brdp7 fw-bold ps-1"
                    style={{ width: "3%" }}
                    dangerouslySetInnerHTML={{
                      __html: result?.header?.Currencysymbol,
                    }}
                  ></div>
                  <div className="ps-2 fw-bold" style={{ width: "97%" }}>
                    {result?.finalAmount !== 0 && toWords.convert((result?.finalAmount + result?.header?.FreightCharges))}  /-
                  </div>
                </div>

                {/* summary */}
                <div className="summary_container_dp7 hcompdp7 fsgdp7">
                  <div className="summary_container_dp7_product_table hcompdp7">
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
                              {e?.Quantity}
                            </div>
                            <div className="sum_prod_head_col_3 dp7cen2">
                              {e?.GrossWt?.toFixed(3)}
                            </div>
                            <div className="sum_prod_head_col_4 dp7cen2">
                              {e?.netwtwithloss?.toFixed(3)}
                            </div>
                            <div className="sum_prod_head_col_5 dp7cen2">
                              {e?.Wastage?.toFixed(3)}
                            </div>
                            <div className="sum_prod_head_col_6 dp7cen2">
                              {/* {e?.fineWtBYNetWtCal?.toFixed(3)} */}
                              {e?.LossWt === 0 ? e?.PureNetWt : ((
                              (((e?.NetWt - e?.totals?.finding?.Wt) * (e?.Tunch))/100)
                               + (e?.totals?.finding?.FineWt))?.toFixed(3))}
                            </div>
                          </div>
                        );
                      })}
                    <div className="summary_container_dp7_product_total fw-bold fsgdp7">
                      <div className="sum_prod_head_col_1 dp7cen1">Total</div>
                      <div className="sum_prod_head_col_2 dp7cen2">
                        {result?.mainTotal?.total_Quantity !== 0 && result?.mainTotal?.total_Quantity}
                      </div>
                      <div className="sum_prod_head_col_3 dp7cen2">
                        {result?.mainTotal?.grosswt !== 0 && result?.mainTotal?.grosswt?.toFixed(3)}
                      </div>
                      <div className="sum_prod_head_col_4 dp7cen2">
                        {result?.mainTotal?.netwtWithLossWt !== 0 && result?.mainTotal?.netwtWithLossWt?.toFixed(3)}
                      </div>
                      <div className="sum_prod_head_col_5 dp7cen2"></div>
                      <div className="sum_prod_head_col_6 dp7cen2">
                        {result?.mainTotal?.total_fineWtByMetalWtCalculation !== 0 && result?.mainTotal?.total_fineWtByMetalWtCalculation?.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  <div style={{ height: "16px" }}></div>
                  <div className="summary_container_dp7_misc_table hcompdp7 fsgdp7">
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
                          <div
                            className="summary_container_dp7_misc_body fsgdp7"
                            key={i}
                          >
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

                  {
                    otherAMountTotal === 0 ? '' : <div className="summary_container_dp7_misc_total fsgdp7">
                    <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                      Other Charges
                    </div>
                    <div className="summary_container_dp7_misc_head_col_2 dp7cen2"></div>
                    <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
                    <div className="summary_container_dp7_misc_head_col_4 dp7cen2 d-flex flex-column">
                      <div className="w-100 dp7cen2"></div>
                      <div className="w-100 dp7cen2"></div>
                    </div>
                    <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                      {formatAmount(otherAMountTotal)}
                      {/* {(result?.mainTotal?.total_other + result?.header?.FreightCharges)?.toFixed(2)} */}
                    </div>
                  </div>
                  }  

                    <div className="summary_container_dp7_misc_total fw-bold">
                      <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                        Total
                      </div>
                      <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
                        {miscWise_total?.pcPcs}
                      </div>
                      <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
                      <div className="summary_container_dp7_misc_head_col_4 dp7cen2 d-flex flex-column">
                        {
                          miscWise_total?.wtWeight_Ctw === 0 ? '' : <div className="w-100 dp7cen2">
                            {miscWise_total?.wtWeight_Ctw?.toFixed(3)} Ctw
                          </div>
                        } 
                        {
                          miscWise_total?.wtWeight_gm === 0 ? '' : <div className="w-100 dp7cen2">
                          {" "}
                          {miscWise_total?.wtWeight_gm?.toFixed(3)} Gm
                          </div>
                        } 
                      </div>
                      <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                        {formatAmount(
                          miscWise_total?.AmtAmount + otherAMountTotal
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div
                  className="mt-1 bradp7 p-1 hcompdp7 fsgdp7"
                  dangerouslySetInnerHTML={{
                    __html: result?.header?.Declaration,
                  }}
                >
                  {}
                </div>
                <div className="border-top-0 bradp7 border-bottom-0 ps-1 fsgdp7">
                  <b>REMARKS</b> : {result?.header?.PrintRemark}
                </div>
                <div className="d-flex footer_bank hcompdp7 fsgdp7">
                  <div className="subheaddiv_1">
                    <div className="fw-bold">Bank Detail</div>
                    <div>Bank Name: {result?.header?.bankname}</div>
                    <div>Branch: {result?.header?.bankaddress}</div>
                    <div>Account Name: {result?.header?.accountname}</div>
                    <div>Account No. : {result?.header?.accountnumber}</div>
                    <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
                    <div>Enquiry No. (E & OE)</div>
                  </div>
                  <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start">
                    <div>Signature</div>
                    <div className="fw-bold mb-2">
                      {result?.header?.customerfirmname}
                    </div>
                  </div>
                  <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start border-end-0">
                    <div>Signature</div>
                    <div className="fw-bold mb-2">
                      {result?.header?.CompanyFullName}
                    </div>
                  </div>
                </div>
              </div>
            </>
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

export default DetailPrint7;
