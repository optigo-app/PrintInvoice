import React, { useEffect, useState } from "react";
import {
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  numberToWord,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "./../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import "../../assets/css/prints/detailprint7.css";

const DetailPrint7 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [categoryWise, setCategoryWise] = useState([]);
  const [miscWise, setMiscWise] = useState([]);
  const [miscWise_total, setMiscWise_total] = useState({
    Pcs: 0,
    Wt_Ctw: 0,
    dia_Wt_gm: 0,
    Wt_gm: 0,
    Amount: 0,
  });
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [headerComp, setHeaderComp] = useState(null);
  const [imgFlag, setImgFlag] = useState(true);

  async function loadData(data) {
    try {
      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      let blankArr = [];
      let blankArr2 = [];
      let obj = {
        Pcs: 0,
        Wt_Ctw: 0,
        dia_Wt_gm: 0,
        Wt_gm: 0,
        Amount: 0,
      };
      datas?.resultArray?.forEach((j2) => {
        // let findIndex = blankArr?.map((el) => el?.Categoryname === e?.Categoryname);
        // if(findIndex === -1){
        //   e[findIndex].pieces += e[findIndex].length;
        //   blankArr.push(e[findIndex]);
        // }else{
        //   blankArr[findIndex].FineWt += (+e?.FineWt);
        //   blankArr[findIndex].Wastage += (+e?.Wastage);
        //   blankArr[findIndex].grosswt += (+e?.grosswt);
        //   blankArr[findIndex].NetWt += (+e?.NetWt);
        // }
        // console.log("zzzzz",blankArr);

        let recordIs = blankArr?.findIndex(
          (e) => e?.Categoryname === j2?.Categoryname
          // e?.QualityName === j2?.QualityName &&
          // e?.Colorname === j2?.Colorname
        );
        if (recordIs === -1) {
          blankArr.push(j2);
        } else {
          blankArr[recordIs].grosswt += +j2?.grosswt;
          blankArr[recordIs].NetWt += +j2?.NetWt;
          blankArr[recordIs].Wastage += +j2?.Wastage;
          blankArr[recordIs].PureNetWt += +j2?.PureNetWt;
          blankArr[recordIs].Quantity += +j2?.Quantity;
        }
      });
      datas?.json2?.forEach((e) => {
        if (
          e?.MasterManagement_DiamondStoneTypeid === 2 ||
          e?.MasterManagement_DiamondStoneTypeid === 3
        ) {

          if (e?.ShapeName === "Hallmark" || e?.ShapeName === "Stamping") {
            return "";
          } else {
            let recordIs = blankArr2?.findIndex(
              (el) => el?.ShapeName === e?.ShapeName
            );
            if (recordIs === -1) {
              blankArr2.push(e);
            } else {
              blankArr2[recordIs].rate += +e?.rate;
              blankArr2[recordIs].Wt += +e?.Wt;
              blankArr2[recordIs].Amount += +e?.Amount;
              blankArr2[recordIs].Pcs += +e?.Pcs;
            }
          }
        }
      });

      //important
      obj.Pcs = 0;
      obj.Amount = 0;
      blankArr2?.forEach((e) => {
        obj.Pcs += e?.Pcs;
        obj.Amount += e?.Amount;
        if (e?.MasterManagement_DiamondStoneTypeid === 2) {
          obj.Wt_Ctw += e?.Wt;
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
          obj.Wt_gm += e?.Wt;
        }
      });

      setMiscWise_total(obj);
      setMiscWise(blankArr2);
      setCategoryWise(blankArr);
      console.log(datas);
      setResult(datas);

      const headerCompo = HeaderComponent(
        data?.BillPrint_Json[0]?.HeaderNo,
        data?.BillPrint_Json[0]
      );
      setHeaderComp(headerCompo);
      setLoader(false);
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
                <div className="d-flex justify-content-end align-items-center my-5 hidebtn">
                  <input
                    type="checkbox"
                    checked={imgFlag}
                    id="showImg"
                    onChange={handleImgShow}
                    className="mx-2"
                  />
                  <label htmlFor="showImg" className="me-2">
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
                {/* <div className="w-100 hcompdp7">{headerComp}</div> */}
                <div>
                  <div className="pheaddp7">{result?.header?.PrintHeadLabel}</div>
                  <div className="d-flex justify-content-between align-items-center p-1">
                    <div>
                      <div className="fw-bold fsgdp7 lhdp7">{result?.header?.CompanyFullName}</div>
                      <div className="fsgdp7 lhdp7">{result?.header?.CompanyAddress}</div>
                      <div className="fsgdp7 lhdp7">{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode},{result?.header?.CompanyState}({result?.header?.CompanyState})</div>
                      <div className="fsgdp7 lhdp7">T {result?.header?.CompanyTellNo} | TOLL FREE  {result?.header?.CompanyTollFreeNo} | TOLL FREE  {result?.header?.CompanyTollFreeNo}</div>
                      <div className="fsgdp7 lhdp7">{result?.header?.CompanyEmail}</div>
                      <div className="fsgdp7 lhdp7">{result?.header?.CompanyEmail}</div>
                      <div className="fsgdp7 lhdp7">{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Pannumber} </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <img src={result?.header?.PrintLogo} alt="#companylogo" className="headimgdp7" />
                    </div>
                  </div>
                </div>

                {/* table sub header */}
                <div className="d-flex subhead hcompdp7">
                  <div className="subheaddiv1">
                    <div className="fsgdp7 lhdp7">
                      {result?.header?.lblBillTo}
                    </div>
                    <div className="fsgdp7 lhdp7">
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
                      {result?.header?.Cust_CST_STATE}{" "}
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subheaddiv2">
                    <div className="fsgdp7 lhdp7">Ship To,</div>
                    <div className="fsgdp7 lhdp7">
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
                  <div className="subheaddiv3">
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
                      <span className="w-50 fw-bold">HSN</span>
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
                  </div>
                </div>

                {/* table head */}
                <div className="tabledp7">
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
                          <div className="rcol1dp7 dp7cen1">{e?.SrNo}</div>
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
                          <div className="rcol3dp7 dp7cen1">
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
                              {e?.diamond_colorstone_misc?.map((el, ind) => {
                                return (
                                  <div className="d-flex brtdp7" key={ind}>
                                    <div className="w_subcoldp7 dp7cen1 brdp7">
                                      {el?.ShapeName}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.Pcs}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                     { el?.ShapeName === "Certification_NM award" ? e?.certificateWtDia?.toFixed(3) : el?.Wt?.toFixed(3) } 
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2 brdp7">
                                      {el?.Rate}
                                    </div>
                                    <div className="w_subcoldp7 dp7cen2">
                                      {el?.Amount?.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="rcol12dp7 dp7cen2 bldp7">
                            {e?.OtherCharges?.toFixed(2)}
                          </div>
                          <div className="rcol13dp7 dp7cen2 border-end-0">
                            {e?.PureNetWt?.toFixed(3)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* table all row total */}
                <div className="totaldp7 w-100 brtdp7 border-top-0 border-start border-end">
                  <div className="totcol1dp7"></div>
                  <div className="totcol2dp7 dp7cen2">
                    {result?.mainTotal?.grosswt?.toFixed(3)}
                  </div>
                  <div className="totcol3dp7 dp7cen2">
                    {result?.mainTotal?.netwtWithLossWt?.toFixed(3)}
                  </div>
                  <div className="totcol4dp7"></div>
                  <div className="totcol5dp7 dp7cen2">
                    {formatAmount(
                      result?.mainTotal?.total_diamond_colorstone_misc_amount
                    )}
                  </div>
                  <div className="totcol6dp7 dp7cen2">
                    {formatAmount(result?.mainTotal?.total_other)}
                  </div>
                  <div className="totcol7dp7 dp7cen2">
                    {result?.mainTotal?.total_purenetwt?.toFixed(3)}
                  </div>
                </div>

                {/* table total */}
                <div className="w-100 brtdp7 dp7cen2 bradp7 ">
                  {formatAmount(result?.mainTotal?.total_amount)}
                </div>

                {/* taxes */}
                {result?.allTaxes?.map((e, i) => {
                  return (
                    <div
                      className="w-100 bradp7 border-bottom-0 border-top-0 taxdp7"
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
                <div className="w-100 bradp7 border-top-0 taxdp7">
                  <div className="taxdp7d4"></div>
                  <div className="taxdp7d2 dp7cen2 bldp7">
                    Sales Rounded Off
                  </div>
                  <div className="taxdp7d3 dp7cen2">
                    {result?.header?.AddLess}
                  </div>
                </div>

                {/* grand total */}
                <div className="w-100 bradp7 border-top-0 taxdp7 finalAmt_h">
                  <div
                    className="taxdp7d1 fw-bold ps-1 h-100 dp7cen1"
                    style={{ width: "70.5%" }}
                  >
                    Total
                  </div>
                  <div
                    className="taxdp7d2 dp7cen2 bldp7 h-100 border-0 "
                    style={{ width: "20%" }}
                  ></div>
                  <div
                    className="taxdp7d3 dp7cen2 fw-bold pe-2 h-100 border-end-0 bldp7"
                    style={{ width: "10.2%" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: result?.header?.Currencysymbol,
                      }}
                    ></div>
                    <div className="ps-1">
                      {" "}
                      {/* {NumberWithCommas(result?.finalAmount)} */}
                      {formatAmount(result?.finalAmount)}
                    </div>
                  </div>
                </div>
                <div className="w-100 d-flex brbdp7 brdp7 bldp7">
                  <div
                    className="brdp7 fw-bold ps-1"
                    style={{ width: "3%" }}
                    dangerouslySetInnerHTML={{
                      __html: result?.header?.Currencysymbol,
                    }}
                  ></div>
                  <div className="ps-2 fw-bold" style={{ width: "97%" }}>
                    {numberToWord(result?.finalAmount)} Only
                  </div>
                </div>

                {/* summary */}
                <div className="summary_container_dp7 hcompdp7">
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
                            className="summary_container_dp7_product_body"
                            key={i}
                          >
                            <div className="sum_prod_head_col_1 dp7cen1">
                              {e?.Categoryname}
                            </div>
                            <div className="sum_prod_head_col_2 dp7cen2">
                              {e?.Quantity}
                            </div>
                            <div className="sum_prod_head_col_3 dp7cen2">
                              {e?.grosswt?.toFixed(3)}
                            </div>
                            <div className="sum_prod_head_col_4 dp7cen2">
                              {e?.NetWt?.toFixed(3)}
                            </div>
                            <div className="sum_prod_head_col_5 dp7cen2">
                              {e?.Wastage?.toFixed(3)}
                            </div>
                            <div className="sum_prod_head_col_6 dp7cen2">
                              {e?.PureNetWt?.toFixed(3)}
                            </div>
                          </div>
                        );
                      })}
                    <div className="summary_container_dp7_product_total fw-bold">
                      <div className="sum_prod_head_col_1 dp7cen1">Total</div>
                      <div className="sum_prod_head_col_2 dp7cen2">
                        {result?.mainTotal?.total_Quantity}
                      </div>
                      <div className="sum_prod_head_col_3 dp7cen2">
                        {result?.mainTotal?.grosswt?.toFixed(3)}
                      </div>
                      <div className="sum_prod_head_col_4 dp7cen2">
                        {result?.mainTotal?.netwtWithLossWt?.toFixed(3)}
                      </div>
                      <div className="sum_prod_head_col_5 dp7cen2"></div>
                      <div className="sum_prod_head_col_6 dp7cen2">
                        {result?.mainTotal?.total_purenetwt?.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  <div style={{ height: "16px" }}></div>
                  <div className="summary_container_dp7_misc_table hcompdp7">
                    <div className="summary_container_dp7_misc_title">
                      MISC SUMMARY
                    </div>

                    <div className="summary_container_dp7_misc_head w-100 fw-bold">
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
                            className="summary_container_dp7_misc_body"
                            key={i}
                          >
                            <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                              {e?.ShapeName}
                            </div>
                            <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
                              {e?.Pcs}
                            </div>
                            <div className="summary_container_dp7_misc_head_col_3 dp7cen2">
                              {e?.Rate?.toFixed(2)}
                            </div>
                            <div className="summary_container_dp7_misc_head_col_4 dp7cen2">
                              {e?.MasterManagement_DiamondStoneTypeid === 2
                                ? `${e?.Wt?.toFixed(3)} Ctw`
                                : `${e?.Wt?.toFixed(3)} gm`}
                            </div>
                            <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                              {e?.Amount?.toFixed(3)}
                            </div>
                          </div>
                        );
                      })}

                    <div className="summary_container_dp7_misc_total">
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
                        {result?.mainTotal?.total_other?.toFixed(2)}
                      </div>
                    </div>
                    <div className="summary_container_dp7_misc_total fw-bold">
                      <div className="summary_container_dp7_misc_head_col_1 dp7cen1">
                        Total
                      </div>
                      <div className="summary_container_dp7_misc_head_col_2 dp7cen2">
                        {miscWise_total?.Pcs}
                      </div>
                      <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
                      <div className="summary_container_dp7_misc_head_col_4 dp7cen2 d-flex flex-column">
                        <div className="w-100 dp7cen2">
                          {miscWise_total?.Wt_Ctw?.toFixed(3)} Ctw
                        </div>
                        <div className="w-100 dp7cen2">
                          {" "}
                          {miscWise_total?.Wt_gm?.toFixed(3)} Gm
                        </div>
                      </div>
                      <div className="summary_container_dp7_misc_head_col_5 dp7cen2 border-end-0">
                        {(
                          miscWise_total?.Amount +
                          result?.mainTotal?.total_other
                        )?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div
                  className="mt-1 bradp7 p-1 hcompdp7"
                  dangerouslySetInnerHTML={{
                    __html: result?.header?.Declaration,
                  }}
                >
                  {}
                </div>
                <div className="border-top-0 bradp7 border-bottom-0 ps-1">
                  REMARKS : {result?.header?.PrintRemark}
                </div>
                <div className="d-flex footer_bank hcompdp7">
                  <div className="subheaddiv_1">
                    <div className="fw-bold">Bank Detail</div>
                    <div>Bank Name: {result?.header?.bankname}</div>
                    <div>Branch: {result?.header?.bankaddress}</div>
                    <div>Account Name: {result?.header?.accountname}</div>
                    <div>Account No. : {result?.header?.accountnumber}</div>
                    <div>RTGS/NEFT IFSC: Kotak00000405</div>
                    <div>Enquiry No. (E & OE)</div>
                  </div>
                  <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start">
                    <div>Signature</div>
                    <div className="fw-bold mb-2">
                      {result?.header?.customerfirmname}
                    </div>
                  </div>
                  <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start">
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
