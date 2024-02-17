import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import "../../assets/css/prints/detailprint10.css";
import Loader from "../../components/Loader";

const DetailPrint10 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  const [diamondWise, setDiamondWise] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);

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

  function loadData(data) {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    let diaObj = {
      ShapeName: "OTHERS",
      wtWt: 0,
      wtWts: 0,
      pcPcs: 0,
      pcPcss: 0,
      rRate: 0,
      rRates: 0,
      amtAmount: 0,
      amtAmounts: 0,
    };

    let diaonlyrndarr1 = [];
    let diaonlyrndarr2 = [];
    let diaonlyrndarr3 = [];
    let diaonlyrndarr4 = [];
    let diarndotherarr5 = [];
    let diaonlyrndarr6 = [];
    datas?.json2?.forEach((e) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        if (e.ShapeName?.toLowerCase() === "rnd") {
          diaonlyrndarr1.push(e);
        } else {
          diaonlyrndarr2.push(e);
        }
      }
    });

    diaonlyrndarr1.forEach((e) => {
      let findRecord = diaonlyrndarr3.findIndex(
        (a) =>
          e?.StockBarcode === a?.StockBarcode &&
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );

      if (findRecord === -1) {
        let obj = { ...e };
        obj.wtWt = e?.Wt;
        obj.pcPcs = e?.Pcs;
        obj.rRate = e?.Rate;
        obj.amtAmount = e?.Amount;
        diaonlyrndarr3.push(obj);
      } else {
        diaonlyrndarr3[findRecord].wtWt += e?.Wt;
        diaonlyrndarr3[findRecord].pcPcs += e?.Pcs;
        diaonlyrndarr3[findRecord].rRate += e?.Rate;
        diaonlyrndarr3[findRecord].amtAmount += e?.Amount;
      }
    });

    diaonlyrndarr2.forEach((e) => {
      let findRecord = diaonlyrndarr4.findIndex(
        (a) =>
          e?.StockBarcode === a?.StockBarcode &&
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );

      if (findRecord === -1) {
        let obj = { ...e };
        obj.wtWt = e?.Wt;
        obj.wtWts = e?.Wt;
        obj.pcPcs = e?.Pcs;
        obj.pcPcss = e?.Pcs;
        obj.rRate = e?.Rate;
        obj.rRates = e?.Rate;
        obj.amtAmount = e?.Amount;
        obj.amtAmounts = e?.Amount;
        diaonlyrndarr4.push(obj);
      } else {
        diaonlyrndarr4[findRecord].wtWt += e?.Wt;
        diaonlyrndarr4[findRecord].wtWts += e?.Wt;
        diaonlyrndarr4[findRecord].pcPcs += e?.Pcs;
        diaonlyrndarr4[findRecord].pcPcss += e?.Pcs;
        diaonlyrndarr4[findRecord].rRate += e?.Rate;
        diaonlyrndarr4[findRecord].rRates += e?.Rate;
        diaonlyrndarr4[findRecord].amtAmount += e?.Amount;
        diaonlyrndarr4[findRecord].amtAmounts += e?.Amount;
      }
    });

    diaonlyrndarr4.forEach((e) => {
      diaObj.wtWt += e?.wtWt;
      diaObj.wtWts += e?.wtWts;
      diaObj.pcPcs += e?.pcPcs;
      diaObj.pcPcss += e?.pcPcss;
      diaObj.rRate += e?.rRate;
      diaObj.rRates += e?.rRates;
      diaObj.amtAmount += e?.amtAmount;
      diaObj.amtAmounts += e?.amtAmounts;
    });
    
    diaonlyrndarr3?.forEach((e) => {
      let find_record = diaonlyrndarr6?.findIndex(
        (a) =>
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );
      if (find_record === -1) {
        let obj = { ...e };
        obj.wtWts = e?.wtWt;
        obj.pcPcss = e?.pcPcs;
        obj.rRates = e?.rRate;
        obj.amtAmounts = e?.amtAmount;
        diaonlyrndarr6.push(obj);
      }else{
        diaonlyrndarr6[find_record].wtWts += e?.wtWt;
        diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
        diaonlyrndarr6[find_record].rRates += e?.rRate;
        diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
      }
    });

    diarndotherarr5 = [...diaonlyrndarr6, diaObj];
    setDiamondWise(diarndotherarr5);
    setResult(datas);
  }

  const handleCheckbox = () => {
    if (imgFlag) {
      setImgFlag(false);
    } else {
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
              <div className="containerdp10 pab60_dp10">
                <div className="d-flex justify-content-end align-items-center hidebtndp10 mb-4">
                  <input
                    type="checkbox"
                    id="imghideshow"
                    className="mx-1"
                    checked={imgFlag}
                    onChange={handleCheckbox}
                  />
                  <label htmlFor="imghideshow" className="me-3">
                    Image Show
                  </label>
                  <button
                    className="btn_white blue mb-0 hidedp10 m-0"
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button>
                </div>
                {/* header */}
                <div>
                  <div className="pheaddp10">
                    {result?.header?.PrintHeadLabel}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="p-1 fsgdp10">
                      <div className="fw-bold fs-6 py-2">
                        {result?.header?.CompanyFullName}
                      </div>
                      <div>{result?.header?.CompanyAddress}</div>
                      <div>{result?.header?.CompanyAddress2}</div>
                      <div>{result?.header?.CompanyCity}</div>
                      <div>
                        {result?.header?.CompanyCity}-
                        {result?.header?.CompanyPinCode},{" "}
                        {result?.header?.CompanyState}(
                        {result?.header?.CompanyCountry})
                      </div>
                      <div>T {result?.header?.CompanyTellNo}</div>
                      <div>
                        {result?.header?.CompanyEmail} |{" "}
                        {result?.header?.CompanyWebsite}
                      </div>
                      <div>
                        {result?.header?.Company_VAT_GST_No} |{" "}
                        {result?.header?.Company_CST_STATE}-
                        {result?.header?.Company_CST_STATE_No} | PAN-
                        {result?.header?.Pannumber}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end pe-2 pt-2">
                      <img
                        src={result?.header?.PrintLogo}
                        alt="#companylogo"
                        className="imgHWdp10"
                      />
                    </div>
                  </div>
                </div>
                {/* subheader */}
                <div className="subheaderdp10">
                  <div className="subdiv1dp10 border-end fsgdp10 border-start ">
                    <div className="px-1">{result?.header?.lblBillTo}</div>
                    <div className="px-1 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress2}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress1}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress3}
                    </div>
                    <div className="px-1">
                      {result?.header?.customercity1}-{result?.header?.PinCode}
                    </div>
                    <div className="px-1">{result?.header?.customeremail1}</div>
                    <div className="px-1">{result?.header?.vat_cst_pan}</div>
                    <div className="px-1">
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subdiv2dp10 border-end fsgdp10">
                    <div className="px-1">Ship To,</div>
                    <div className="px-1 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    {result?.header?.address?.map((e, i) => {
                      return (
                        <div className="px-1" key={i}>
                          {e}
                        </div>
                      );
                    })}
                  </div>
                  <div className="subdiv3dp10 fsgdp10 border-end">
                    <div className="d-flex justify-content-between px-1">
                      <div className="w-50 fw-bold">BILL NO</div>
                      <div className="w-50">{result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <div className="w-50 fw-bold">DATE</div>
                      <div className="w-50">{result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <div className="w-50 fw-bold">
                        {result?.header?.HSN_No_Label}
                      </div>
                      <div className="w-50">{result?.header?.HSN_No}</div>
                    </div>
                    <div className="d-flex justify-content-end mt-5 px-2 fw-bold">
                      Gold Rate {result?.header?.MetalRate24K?.toFixed(2)} Per
                      Gram
                    </div>
                  </div>
                </div>
                {/* table */}

                <div className="tabledp10">
                  {/* tablehead */}
                  <div className="theaddp10 fw-bold fsg2dp10" style={{backgroundColor:'#F5F5F5'}}>
                    <div className="col1dp10 centerdp10 ">Sr</div>
                    <div className="col2dp10 centerdp10  fw-bold">Design</div>
                    <div className="col3dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">
                        Diamond
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10 w-100">
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Code
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Size
                        </div>
                        <div
                          className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10"
                          style={{ width: "14.66%" }}
                        >
                          Pcs
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Wt
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Rate
                        </div>
                        <div
                          className="centerdp10 h-100 theadsubcol1_dp10"
                          style={{ width: "18.66%" }}
                        >
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col4dp10 ">
                      <div className="h-50 centerdp10 fw-bold w-100">Metal</div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10 w-100">
                        <div
                          className="theadsubcol2_dp10 bright_dp10 h-100 centerdp10"
                          style={{ width: "40%" }}
                        >
                          Quality
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 bright_dp10 h-100">
                          N+L
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 bright_dp10 h-100">
                          Rate
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 h-100">
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col3dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">Stone</div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10 w-100">
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Code
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Size
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Pcs
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Wt
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Rate
                        </div>
                        <div className="centerdp10 h-100 theadsubcol1_dp10">
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col6dp10">
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Other
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Charges
                      </div>
                    </div>
                    <div className="col7dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">
                        Labour
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10  w-100">
                        <div className="w-50 h-100 centerdp10 bright_dp10">
                          Rate
                        </div>
                        <div className="w-50 h-100 centerdp10">Amount</div>
                      </div>
                    </div>
                    <div className="col8dp10">
                      <div className="d-flex justify-content-center align-items-center h-50 border-top w-100">
                        Total
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Amount
                      </div>
                    </div>
                  </div>
                  {/* table body */}
                  <div className="tbodydp10 fsgdp10 ">
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <div className="tbrowdp10 h-100 " key={i}>
                          <div className="tbcol1dp10 center_sdp10">
                            {/* {e?.SrNo} */}
                            {i + 1}
                          </div>
                          <div className="tbcol2dp10 d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between px-1 ">
                              <div className="fsgdp10">{e?.designno}</div>
                              <div className="fsgdp10">{e?.SrJobno}</div>
                            </div>
                            <div className="d-flex justify-content-end px-1">
                              {e?.MetalColor}
                            </div>
                            {imgFlag ? (
                              <div
                                className="w-100 d-flex justify-content-center align-items-start fsgdp10"
                                style={{ minHeight: "80px" }}
                              >
                                <img
                                  src={e?.DesignImage}
                                  onError={(e) => handleImageError(e)}
                                  alt="design"
                                  className="imgdp10"
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="centerdp10 fsgdp10">
                              {e?.batchnumber}
                            </div>
                            {e?.HUID !== "" ? (
                              <div className="centerdp10 fsgdp10">
                                HUID - {e?.HUID}
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="centerdp10 fw-bold fsgdp10">
                              PO: {e?.PO}
                            </div>
                            <div className="centerdp10 fsgdp10">
                              Tunch : &nbsp;
                              <b className="fsgdp10">{e?.Tunch?.toFixed(3)}</b>
                            </div>
                            <div className="centerdp10">
                              <b className="fsgdp10">
                                {e?.grosswt?.toFixed(3)} gm
                              </b>
                              &nbsp; Gross
                            </div>
                            <div className="centerdp10">
                              {" "}
                              {e?.Size === "" ? "" : `Size : ${e?.Size}`}
                            </div>
                          </div>
                          <div className="tbcol3dp10 ">
                            {e?.diamonds?.map((el, idia) => {
                              return (
                                <div className="d-flex" key={idia}>
                                  <div className="theadsubcol1_dp10" style={{wordBreak:'break-word',paddingLeft:'2px'}}>
                                    {el?.ShapeName} {el?.QualityName}&nbsp;
                                    {el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10 text-center" style={{lineHeight:'8px !important'}}>
                                    {el?.SizeName}
                                  </div>
                                  <div
                                    className="theadsubcol1_dp10 end_dp10"
                                    style={{ width: "14.66%" }}
                                  >
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {formatAmount(el?.Rate)}
                                  </div>
                                  <div
                                    className="theadsubcol1_dp10 fw-bold end_dp10"
                                    style={{ width: "18.66%",paddingRight:'1.5px' }}
                                  >
                                    {formatAmount(el?.Amount)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="tbcol4dp10">
                            {e?.metal?.map((el, imet) => {
                              return (
                                <div className="d-flex w-100" key={imet}>
                                  <div
                                    className="theadsubcol2_dp10 d-flex justify-content-start border-end h-100 ps-1 border-end-0"
                                    style={{ width: "37%" }}
                                  >
                                    {el?.ShapeName} {el?.QualityName}
                                  </div>
                                  <div className="theadsubcol2_dp10 centerdp10 border-end h-100 pe-1 border-end-0 end_dp10">
                                    {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                                    {el?.Wt}
                                  </div>
                                  <div className="theadsubcol2_dp10 centerdp10 border-end h-100 pe-1 border-end-0 end_dp10">
                                    {el?.Rate?.toFixed(2)}
                                  </div>
                                  <div className="theadsubcol2_dp10 centerdp10 border-end h-100 pe-1 border-end-0 end_dp10">
                                    {el?.Amount?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="p-2 px-1">
                              {e?.JobRemark !== "" ? (
                                <>
                                  <b className="fsgdp10">Remark : </b>{" "}
                                  {e?.JobRemark}
                                </>
                              ) : (
                                ""
                              )}{" "}
                            </div>
                          </div>
                          <div className="tbcol3dp10">
                            {e?.colorstone?.map((el, ics) => {
                              return (
                                <div className="d-flex" key={ics}>
                                  <div className="theadsubcol1_dp10" style={{wordBreak:'break-word', paddingLeft:'2px'}}>
                                    {el?.ShapeName +
                                      " " +
                                      el?.QualityName +
                                      " " +
                                      el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10 text-center">
                                    {el?.SizeName}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Rate?.toFixed(2)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10 fw-bold" style={{paddingRight:'1.5px'}}>
                                    {el?.Amount?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="tbcol6dp10 end_dp10 p-1">
                            {formatAmount(
                              e?.OtherCharges +
                                e?.MiscAmount +
                                e?.TotalDiamondHandling
                            )}
                          </div>
                          <div className="tbcol7dp10 ">
                            <div className="d-flex">
                              <div className="w-50 end_dp10 ">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div>
                              <div className="w-50 end_dp10">
                                {formatAmount( (e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost) )}
                              </div>
                            </div>
                          </div>
                          <div className="tbcol8dp10 end_dp10 fw-bold p-1">
                            {formatAmount(e?.TotalAmount + e?.DiscountAmt)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* final total */}
                  <div className="d-flex justify-content-end align-items-center brb_dp10">
                    <div style={{ width: "13%" }}>
                      <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10">Net Amount</div>
                        <div className="w-50 end_dp10 pe-2">
                          {(
                            +result?.mainTotal?.total_amount?.toFixed(2) +
                            +result?.mainTotal?.total_discount_amount?.toFixed(
                              2
                            )
                          )?.toFixed(2)}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10">Total Discount</div>
                        <div className="w-50 end_dp10 pe-2">
                          {result?.mainTotal?.total_discount_amount?.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        {result?.allTaxes?.map((e, i) => {
                          return (
                            <div
                              className="d-flex justify-content-between"
                              key={i}
                            >
                              <div className="w-50 end_dp10">
                                {e?.name} {e?.per}
                              </div>
                              <div className="w-50 end_dp10 pe-2">
                                {e?.amount}
                              </div>
                            </div>
                          );
                        })}
                        <div className="d-flex justify-content-between">
                          <div className="w-50 end_dp10">
                            {result?.header?.AddLess > 0 ? "Add" : "Less"}
                          </div>
                          <div className="w-50 end_dp10 pe-2">
                            {result?.header?.AddLess}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* all table row total */}
                  <div
                    className="d-flex grandtotaldp10 brb_dp10 brbb_dp10"
                    style={{ backgroundColor: "#F5F5F5" }}
                  >
                    <div
                      className="centerdp10 brR_dp10"
                      style={{ width: "12%" }}
                    >
                      Total
                    </div>
                    <div className="col3dp10 d-flex align-items-center brR_dp10">
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.diamonds?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10"></div> */}
                      <div
                        className="theadsubcol1_dp10 end_dp10 pe-1"
                        style={{ width: "33.332%" }}
                      >
                        {formatAmount(result?.mainTotal?.diamonds?.Amount)}
                      </div>
                    </div>
                    <div className="col4dp10 d-flex align-items-center brR_dp10">
                      <div
                        className="theadsubcol2_dp10"
                        style={{ width: "40%" }}
                      ></div>
                      <div className="theadsubcol2_dp10 end_dp10">
                        {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                        {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol2_dp10"></div> */}
                      <div
                        className="theadsubcol2_dp10 end_dp10 pe-1"
                        style={{ width: "46%" }}
                      >
                        {formatAmount(result?.mainTotal?.metal?.Amount)}
                      </div>
                    </div>
                    <div className="col3dp10 d-flex align-items-center brR_dp10">
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.colorstone?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10"></div> */}
                      <div
                        className="theadsubcol1_dp10 end_dp10 pe-1"
                        style={{ width: "33.32%" }}
                      >
                        {formatAmount(result?.mainTotal?.colorstone?.Amount)}
                      </div>
                    </div>
                    <div className="col6dp10 end_dp10 pe-1 d-flex align-items-center brR_dp10">
                      {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                    </div>
                    <div className="col7dp10 end_dp10 pe-1 d-flex align-items-center brR_dp10">
                      {formatAmount( result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost )}
                    </div>
                    <div className="col8dp10 end_dp10  d-flex align-items-center">
                      {formatAmount(result?.finalAmount)}
                    </div>
                  </div>
                  </div>
                  {/* summary */}
                  <div className="d-flex justify-content-between mt-1 summarydp10">
                    <div className="d-flex flex-column sumdp10">
                      <div className="fw-bold bg_dp10 w-100 centerdp10  ball_dp10">
                        SUMMARY
                      </div>
                      <div className="d-flex w-100 fsgdp10">
                        <div className="w-50 bright_dp10  bl_dp10">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD IN 24KT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.convertednetwt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GROSS WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.grosswt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">NET WT</div>
                            <div className="w-50 end_dp10 pe-1">
                            {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
                              gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.diamonds?.Pcs} /{" "}
                              {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">STONE WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.colorstone?.Pcs} /{" "}
                              {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}{" "}
                              cts
                            </div>
                          </div>
                        </div>
                        <div className="w-50 bright_dp10 ">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD</div>
                            <div className="w-50 end_dp10">
                              {formatAmount(result?.mainTotal?.metal?.Amount)}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND</div>
                            <div className="w-50 end_dp10">
                              {formatAmount(
                                result?.mainTotal?.diamonds?.Amount
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">CST</div>
                            <div className="w-50 end_dp10">
                              {formatAmount(
                                result?.mainTotal?.colorstone?.Amount
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MAKING </div>
                            <div className="w-50 end_dp10">
                              {formatAmount(
                                result?.mainTotal?.total_MakingAmount_Setting_Amount
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">OTHER </div>
                            <div className="w-50 end_dp10">
                              {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">
                              {result?.header?.AddLess > 0 ? "ADD" : "LESS"}
                            </div>
                            <div className="w-50 end_dp10">
                              {result?.header?.AddLess}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg_dp10 h_bd10 ball_dp10 d-flex fsgdp10 ">
                        <div className="w-50 h-100"></div>
                        <div className="w-50 h-100 d-flex align-items-center bl_dp10">
                          <div className="fw-bold w-50 px-1">TOTAL</div>
                          <div className="w-50 end_dp10 px-1">
                            {formatAmount(result?.finalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dia_sum_dp10 d-flex flex-column  fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        Diamond Detail
                      </div>
                      {diamondWise?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-1 ball_dp10 border-top-0 border-bottom-0 fsgdp10"
                            key={i}
                          >
                            <div className="fw-bold w-50">
                              {e?.ShapeName} {e?.QualityName} {e?.Colorname}
                            </div>
                            <div className="w-50 end_dp10">
                              {e?.pcPcss} / {e?.wtWts?.toFixed(3)} cts
                            </div>
                          </div>
                        );
                      })}
                      <div className="d-flex justify-content-between px-1 bg_dp10 h_bd10  ball_dp10">
                        <div className="fw-bold w-50 h14_dp10" ></div>
                        <div className="w-50"></div>
                      </div>
                    </div>
                    <div className="oth_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        OTHER DETAILS
                      </div>
                      <div className="d-flex flex-column justify-content-between w-100 px-1 ball_dp10 border-top-0 p-1">
                        <div className="d-flex">
                          <div className="w-50 fw-bold start_dp10 fsgdp10">
                            RATE IN 24KT
                          </div>
                          <div className="w-50 end_dp10 fsgdp10">
                            {result?.header?.MetalRate24K?.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          {result?.header?.BrokerageDetails?.map((e, i) => {
                            return (
                              <div className="d-flex fsgdp10" key={i}>
                                <div className="w-50 fw-bold start_dp10">
                                  {e?.label}
                                </div>
                                <div className="w-50 end_dp10">{e?.value}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                     {
                      result?.header?.PrintRemark === '' ? <div style={{width:'15%'}}></div> : <div className="remark_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        Remark
                      </div>
                       <div className="ball_dp10 border-top-0 p-1">
                        {result?.header?.PrintRemark}
                      </div>
                    </div>
                     } 
                    <div className="check_dp10 ball_dp10 d-flex justify-content-center align-items-end pb-1 fsgdp10">
                      <i>Created By</i>
                    </div>
                    <div className="check_dp10 ball_dp10 d-flex justify-content-center align-items-end pb-1 fsgdp10">
                      <i>Checked By</i>
                    </div>
                  </div>
                  <div style={{color:'gray'}} className="pt-3" >**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
                
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

export default DetailPrint10;
