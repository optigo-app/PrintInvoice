import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  HeaderComponent,
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
  const [headerCom, setHeaderCom] = useState(null);
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
      console.log(datas);
    let blankDiaArr = [];
    let only_rnd = [];
    let others_dia = [];
    let OTHERS_OBJ = {
      ShapeName: "OTHERS",
      Pcs: 0,
      Wt: 0,
      Rate: 0,
      Amount: 0,
    };

    datas?.json2?.forEach((e) => {
      if (e.MasterManagement_DiamondStoneTypeid === 1) {
        let findRecord = blankDiaArr?.findIndex(
          (el) =>
            el?.ShapeName === e?.ShapeName &&
            el?.QualityName === e?.QualityName &&
            el?.Colorname === e?.Colorname
        );
        if (findRecord === -1) {
          blankDiaArr.push(e);
        } else {
          blankDiaArr[findRecord].Wt += e?.Wt;
          blankDiaArr[findRecord].Pcs += e?.Pcs;
          blankDiaArr[findRecord].Amount += e?.Amount;
        }
      }
    });

    blankDiaArr?.forEach((e) => {
      if (e?.ShapeName === "RND") {
        only_rnd.push(e);
      } else {
        others_dia.push(e);
      }
    });

    others_dia?.forEach((e) => {
      OTHERS_OBJ.Pcs += e?.Pcs;
      OTHERS_OBJ.Wt += e?.Wt;
      OTHERS_OBJ.Rate += e?.Rate;
      OTHERS_OBJ.Amount += e?.Amount;
    });

    let mainRNDArr = [...only_rnd];

    mainRNDArr.push(OTHERS_OBJ);

    setDiamondWise(mainRNDArr);

    const headerComp = HeaderComponent(
      data?.BillPrint_Json[0]?.HeaderNo,
      data?.BillPrint_Json[0]
    );
    setHeaderCom(headerComp);

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
                  <div className="pheaddp10">{result?.header?.PrintHeadLabel}</div>
                  <div className="d-flex justify-content-between">
                  <div className="p-1 fsgdp10">
                    <div className="fw-bold fs-6 py-2">{result?.header?.CompanyFullName}</div>
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyAddress2}</div>
                    <div>{result?.header?.CompanyCity}</div>
                    <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode}, {result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                    <div>T {result?.header?.CompanyTellNo}</div>
                    <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                    <div>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE}-{result?.header?.Company_CST_STATE_No} | PAN-{result?.header?.Pannumber}</div>
                  </div>
                  <div className="d-flex justify-content-end pe-2 pt-2">
                    <img src={result?.header?.PrintLogo} alt="#companylogo" className="imgHWdp10" />
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
                  <div className="theaddp10 fw-bold fsg2dp10">
                    <div className="col1dp10 centerdp10 ">Sr</div>
                    <div className="col2dp10 centerdp10  fw-bold">Design</div>
                    <div className="col3dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">
                        Diamond
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Code
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Size
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10" style={{width:"14.66%"}}>
                          Pcs
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Wt
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Rate
                        </div>
                        <div className="centerdp10 h-100 theadsubcol1_dp10" style={{width:"18.66%"}}>
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col4dp10 ">
                      <div className="h-50 centerdp10 fw-bold w-100">Metal</div>
                      <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                        <div
                          className="theadsubcol2_dp10 border-end h-100 centerdp10"
                          style={{ width: "40%" }}
                        >
                          Quality
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 border-end h-100">
                          N+L
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 border-end h-100">
                          Rate
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 h-100">
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col3dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">Stone</div>
                      <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Code
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Size
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Pcs
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
                          Wt
                        </div>
                        <div className="centerdp10 h-100 border-end theadsubcol1_dp10">
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
                      <div className="d-flex justify-content-between align-items-center h-50 border-top w-100">
                        <div className="w-50 h-100 centerdp10 border-end">
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
                            {e?.SrNo}
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
                              <div className="w-100 d-flex justify-content-center align-items-start fsgdp10" style={{minHeight:"80px"}}>
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
                            <div className="centerdp10 fw-bold fsgdp10">
                              PO: {e?.PO}
                            </div>
                            <div className="centerdp10 fsgdp10">{e?.batchnumber}</div>
                            {e?.HUID !== "" ? (
                              <div className="centerdp10 fsgdp10">HUID - {e?.HUID}</div>
                            ) : (
                              ""
                            )}
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
                                  <div className="theadsubcol1_dp10">
                                    {el?.ShapeName} {el?.QualityName}{" "}
                                    {el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10">
                                    {el?.SizeName}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10" style={{width:"14.66%"}}>
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {formatAmount(el?.Rate)}
                                  </div>
                                  <div className="theadsubcol1_dp10 fw-bold end_dp10" style={{width:"18.66%"}}>
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
                                    {(e?.NetWt + e?.LossWt)?.toFixed(3)}
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
                            <div className="p-2 px-1">{e?.JobRemark !== '' ? <><b className="fsgdp10">Remark : </b> {e?.JobRemark}</> : ''} </div>
                          </div>
                          <div className="tbcol3dp10">
                            {e?.colorstone?.map((el, ics) => {
                              return (
                                <div className="d-flex" key={ics}>
                                  <div className="theadsubcol1_dp10">
                                    {el?.ShapeName}
                                  </div>
                                  <div className="theadsubcol1_dp10">
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
                                  <div className="theadsubcol1_dp10 end_dp10 fw-bold">
                                    {el?.Amount?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="tbcol6dp10 end_dp10 p-1">
                            {e?.OtherCharges?.toFixed(2)}
                          </div>
                          <div className="tbcol7dp10 border-end">
                            <div className="d-flex">
                              <div className="w-50 end_dp10 border-end">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div>
                              <div className="w-50 end_dp10">
                                {formatAmount(e?.MakingAmount)}
                              </div>
                            </div>
                          </div>
                          <div className="tbcol8dp10 end_dp10 fw-bold p-1">
                            {formatAmount((e?.TotalAmount + e?.DiscountAmt))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* final total */}
                  <div className="d-flex justify-content-end align-items-center">
                    <div style={{ width: "13%" }}>
                      <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10">Net Amount</div>
                        <div className="w-50 end_dp10 pe-2">
                          {((+result?.mainTotal?.total_amount?.toFixed(2)) + (+result?.mainTotal?.total_discount_amount?.toFixed(2)))?.toFixed(2)}
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
                    className="d-flex grandtotaldp10"
                    style={{ backgroundColor: "#dbdbdb" }}
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
                        {result?.mainTotal?.netwtWithLossWt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol2_dp10"></div> */}
                      <div className="theadsubcol2_dp10 end_dp10 pe-1" style={{width:"46%"}}>
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
                      <div className="theadsubcol1_dp10 end_dp10 pe-1" style={{width:"33.32%"}}>
                        {formatAmount(result?.mainTotal?.colorstone?.Amount)}
                      </div>
                    </div>
                    <div className="col6dp10 end_dp10 pe-1 d-flex align-items-center brR_dp10">
                      {formatAmount(result?.mainTotal?.total_other)}
                    </div>
                    <div className="col7dp10 end_dp10 pe-1 d-flex align-items-center brR_dp10">
                      {formatAmount(
                        result?.mainTotal?.total_labour?.labour_amount
                      )}
                    </div>
                    <div className="col8dp10 end_dp10 pe-1 d-flex align-items-center">
                      {formatAmount(result?.finalAmount)}
                    </div>
                  </div>
                  {/* summary */}
                  <div className="d-flex justify-content-between mt-1 summarydp10">
                    <div className="d-flex flex-column sumdp10">
                      <div className="fw-bold bg_dp10 w-100 centerdp10  border">
                        SUMMARY
                      </div>
                      <div className="d-flex w-100 fsgdp10">
                        <div className="w-50 border-end border-bottom border-start">
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
                              {result?.mainTotal?.netwtWithLossWt?.toFixed(3)}{" "}
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
                        <div className="w-50 border-end border-bottom">
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
                                result?.mainTotal?.total_labour?.labour_amount
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">OTHER </div>
                            <div className="w-50 end_dp10">
                              {formatAmount(result?.mainTotal?.total_other)}
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
                      <div className="bg_dp10 h_bd10 border d-flex fsgdp10 ">
                        <div className="w-50 h-100"></div>
                        <div className="w-50 h-100 d-flex align-items-center border-start">
                          <div className="fw-bold w-50 px-1">TOTAL</div>
                          <div className="w-50 end_dp10 px-1 fw-bold">
                            {formatAmount(result?.finalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dia_sum_dp10 d-flex flex-column border-end border-start border-bottom fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold border">
                        Diamond Detail
                      </div>
                      {diamondWise?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-1 fsgdp10"
                            key={i}
                          >
                            <div className="fw-bold w-50">
                              {e?.ShapeName} {e?.QualityName} {e?.Colorname}
                            </div>
                            <div className="w-50 end_dp10">
                              {e?.Pcs} / {e?.Wt?.toFixed(3)} cts
                            </div>
                          </div>
                        );
                      })}
                      {/* <div className="d-flex justify-content-between px-1 bg_dp10 h_bd10 border">
                        <div className="fw-bold w-50"></div>
                        <div className="w-50"></div>
                      </div> */}
                    </div>
                    <div className="oth_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold border">
                        OTHER DETAILS
                      </div>
                      <div className="d-flex flex-column justify-content-between w-100 px-1 border p-1">
                        <div className="d-flex">
                        <div className="w-50 fw-bold start_dp10 fsgdp10">
                          RATE IN 24KT
                        </div>
                        <div className="w-50 end_dp10 fsgdp10">
                          {result?.header?.MetalRate24K?.toFixed(2)}
                        </div>
                        </div>
                        <div>
                        {
                          result?.header?.BrokerageDetails?.map((e, i) => {
                            return(
                              <div className="d-flex fsgdp10" key={i}>
                                <div className="w-50 fw-bold start_dp10">{e?.label}</div>
                                <div className="w-50 end_dp10">{e?.value}</div>
                              </div>
                            )
                          })
                        }
                        </div>
                      </div>
                    </div>
                    <div className="remark_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold border">
                        Remark
                      </div>
                      <div className="border p-1">
                        {result?.header?.PrintRemark}
                      </div>
                    </div>
                    <div className="check_dp10 border d-flex justify-content-center align-items-end pb-1 fsgdp10">
                      Created By
                    </div>
                    <div className="check_dp10 border d-flex justify-content-center align-items-end pb-1 fsgdp10">
                      Checked By
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

export default DetailPrint10;
