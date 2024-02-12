import React, { useEffect, useState } from "react";
import "../../assets/css/prints/detailprint4.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import {
  apiCall,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "./../../components/Loader";
const DetailPrint4 = ({ token, invoiceNo, printName, urls, evn }) => {
  const [result, setResult] = useState(null);
  // eslint-disable-next-line no-unused-vars
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
  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    // console.log(datas);
    setResult(datas);
    setLoader(false);
  };
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
            <div className="container_dp4 mb-5 pb-5">
              <div className="d-flex justify-content-end align-items-center user-select-none printHide_dp4 mt-5">
                <div className="mb-3 me-2 justify-content-center align-items-center">
                  <input
                    type="checkbox"
                    className="me-2"
                    value={imgFlag}
                    checked={imgFlag}
                    onChange={(e) => handleImgShow(e)}
                    id="imgshowdp4"
                  />
                  <label htmlFor="imgshowdp4"> With Image </label>
                </div>
                <div className="mb-3">
                  <button
                    className="btn_white blue py-1"
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button>
                </div>
              </div>
              {/* header */}
              <div>
                <div className="headlabeldp4 fw-bold">
                  {result?.header?.PrintHeadLabel}
                </div>
                <div className="d-flex justify-content-between align-items-center fs_dp4">
                  <div className="w-25">
                    <div className="ps-2">To,</div>
                    <div className="fw-bold ps-2">
                      {result?.header?.Customercode}
                    </div>
                  </div>
                  <div className="w-25">
                    <div className="d-flex w-100">
                      <div className="w-50 end_dp4">
                        Invoice#&nbsp;&nbsp;&nbsp;:
                      </div>
                      <div className="fw-bold w-50 start_dp4">
                        {result?.header?.InvoiceNo}
                      </div>
                    </div>
                    <div className="d-flex w-100">
                      <div className="w-50 end_dp4">
                        Date&nbsp;&nbsp;&nbsp;:
                      </div>
                      <div className="fw-bold w-50 start_dp4">
                        {result?.header?.EntryDate}
                      </div>
                    </div>
                    <div className="d-flex w-100">
                      <div className="w-50 end_dp4">
                        {result?.header?.HSN_No_Label}&nbsp;&nbsp;&nbsp;:
                      </div>
                      <div className="fw-bold w-50 start_dp4">
                        {result?.header?.HSN_No}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex theaddp4 fw-bold fs_dp4">
                  <div className="col1_dp4 border-secondary border-end center_dp4">
                    Sr
                  </div>
                  <div className="col2_dp4 border-secondary border-end center_dp4">
                    Design
                  </div>
                  <div className="col3_dp4 border-secondary border-end">
                    <div className="w-100 center_dp4 h-50">Diamond</div>
                    <div className="d-flex w-100 border-secondary border-top h-50">
                      <div
                        className="center_dp4 dia_col_w_dp4 border-secondary border-end"
                        style={{ width: "35%" }}
                      >
                        Charity / Color
                      </div>
                      <div
                        className="center_dp4 dia_col_w_dp4 border-secondary border-end"
                        style={{ width: "10%" }}
                      >
                        Pcs
                      </div>
                      <div
                        className="center_dp4 border-secondary border-end dia_col_w_dp4"
                        style={{ width: "15%" }}
                      >
                        Wt
                      </div>
                      <div className="center_dp4 border-secondary border-end dia_col_w_dp4">
                        Rate
                      </div>
                      <div className="center_dp4 dia_col_w_dp4">Amount</div>
                    </div>
                  </div>
                  <div className="col4_dp4 border-secondary border-end">
                    <div className="center_dp4 h-50 w-100">Metal</div>
                    <div className="d-flex h-50 w-100 border-secondary border-top">
                      <div className="center_dp4 dia_col_w_dp4 border-secondary border-end">
                        Quality
                      </div>
                      <div className="center_dp4 dia_col_w_dp4 border-secondary border-end">
                        Wt(M+D)
                      </div>
                      <div className="center_dp4 dia_col_w_dp4 border-secondary border-end">
                        N+L
                      </div>
                      <div className="center_dp4 dia_col_w_dp4 border-secondary border-end">
                        Rate
                      </div>
                      <div className="center_dp4 dia_col_w_dp4">Amount</div>
                    </div>
                  </div>
                  <div className="col5_dp4 border-secondary border-end">
                    <div className="w-100 center_dp4 h-50">Stone</div>
                    <div className="d-flex w-100 border-secondary border-top h-50">
                      <div
                        className="center_dp4 col_w_dp4 border-secondary border-end"
                        style={{ width: "35%" }}
                      >
                        Charity / Color
                      </div>
                      <div
                        className="center_dp4 col_w_dp4 border-secondary border-end"
                        style={{ width: "10%" }}
                      >
                        Pcs
                      </div>
                      <div
                        className="center_dp4 col_w_dp4 border-secondary border-end"
                        style={{ width: "15%" }}
                      >
                        Wt
                      </div>
                      <div className="center_dp4 col_w_dp4 border-secondary border-end">
                        Rate
                      </div>
                      <div className="center_dp4 col_w_dp4">Amount</div>
                    </div>
                  </div>
                  <div className="col6_dp4 border-secondary border-end center_dp4">
                    Other
                  </div>
                  <div className="col7_dp4 border-secondary border-end">
                    <div className="h-50 center_dp4 w-100">Labour</div>
                    <div className="d-flex w-100 border-secondary border-top h-50">
                      <div className="w-100 border-secondary border-end center_dp4">
                        Rate
                      </div>
                      <div className="w-100 center_dp4">Amount</div>
                    </div>
                  </div>
                  <div className="col8_dp4 center_dp4">Total Amount</div>
                </div>
                {/* table body */}
                <div>
                  {result?.resultArray?.map((e, i) => {
                    return (
                      <div className="fs_dp4" key={i}>
                        <div className="d-flex border-secondary border-start border-end border-bottom w-100">
                          <div className="col1_dp4 border-secondary border-end center_top_dp4 fs_dp4">
                            {i + 1}
                          </div>
                          <div className="col2_dp4 border-secondary border-end">
                            <div className="d-flex justify-content-between align-items-start fs_dp4">
                              <div>{e?.designno}</div>
                              <div>{e?.SrJobno}</div>
                            </div>
                            {imgFlag ? (
                              <div className="center_dp4">
                                <img
                                  src={e?.DesignImage}
                                  alt="#designimg"
                                  onError={(e) => handleImageError(e)}
                                  className="designimg_dp4"
                                />
                              </div>
                            ) : (
                              ""
                            )}
                            {e?.HUID === "" ? (
                              ""
                            ) : (
                              <div className="center_dp4 fs_dp4">
                                HUID: {e?.HUID}
                              </div>
                            )}
                          </div>
                          <div className="col3_dp4 border-secondary border-end">
                            <div>
                              {e?.diamonds?.map((el, ind) => {
                                return (
                                  <div className="d-flex fs_dp4" key={ind}>
                                    <div
                                      className="dia_col_w_dp4 start_dp4"
                                      style={{ width: "35%" }}
                                    >
                                      {el?.QualityName}
                                    </div>
                                    <div
                                      className="dia_col_w_dp4 end_dp4"
                                      style={{ width: "10%" }}
                                    >
                                      {el?.Pcs}
                                    </div>
                                    <div
                                      className="dia_col_w_dp4 end_dp4"
                                      style={{ width: "15%" }}
                                    >
                                      {el?.Wt?.toFixed(3)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {formatAmount(el?.Rate)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {formatAmount(el?.Amount)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="col4_dp4 border-secondary border-end">
                            <div>
                              {e?.metal?.map((el, ind) => {
                                return (
                                  <div
                                    className="d-flex border-secondary border-bottom fs_dp4"
                                    key={ind}
                                  >
                                    <div
                                      className="dia_col_w_dp4 start_dp4"
                                      style={{ wordWrap: "break-word" }}
                                    >
                                      {e?.MetalTypePurity}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {e?.grosswt?.toFixed(3)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {(e?.NetWt + e?.LossWt)?.toFixed(3)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {formatAmount(el?.Rate)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4 fw-bold">
                                      {formatAmount(el?.Amount)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="col5_dp4 border-secondary border-end">
                            <div>
                              {e?.colorstone?.map((el, ind) => {
                                return (
                                  <div className="d-flex fs_dp4" key={ind}>
                                    <div
                                      className="dia_col_w_dp4 start_dp4"
                                      style={{ width: "35%" }}
                                    >
                                      {el?.QualityName}
                                    </div>
                                    <div
                                      className="dia_col_w_dp4 end_dp4"
                                      style={{ width: "10%" }}
                                    >
                                      {el?.Pcs}
                                    </div>
                                    <div
                                      className="dia_col_w_dp4 end_dp4"
                                      style={{ width: "15%" }}
                                    >
                                      {el?.Wt?.toFixed(3)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {formatAmount(el?.Rate)}
                                    </div>
                                    <div className="dia_col_w_dp4 end_dp4">
                                      {formatAmount(el?.Amount)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="col6_dp4 border-secondary border-end end_top_dp4">
                            {
                              formatAmount()
                              // e?.OtherCharges +
                              //   // e?.TotalDiamondHandling +
                              //   // e?.MiscAmount
                            }
                          </div>
                          <div className="col7_dp4 border-secondary border-end fs_dp4">
                            <div className="d-flex">
                              <div className="w-50 end_top_dp4 fs_dp4">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div>
                              <div className="w-50 end_top_dp4 fs_dp4">
                                {formatAmount(
                                  e?.totals?.makingAmount_settingAmount
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col8_dp4 end_top_dp4 fs_dp4">
                            {formatAmount(e?.TotalAmount)}
                          </div>
                        </div>
                        {/* table row wise total */}
                        <div className="d-flex border-secondary border-start border-end border-bottom w-100 bgc_dp4 fw-bold">
                          <div className="col1_dp4 border-secondary border-end center_top_dp4"></div>
                          <div className="col2_dp4 border-secondary border-end">
                            <div className="fw-bold center_dp4 fs_dp4">
                              {e?.grosswt?.toFixed(3)} gm Gross
                            </div>
                          </div>
                          <div className="col3_dp4 border-secondary border-end">
                            <div>
                              <div className="d-flex">
                                <div
                                  className="dia_col_w_dp4 start_dp4"
                                  style={{ width: "35%" }}
                                ></div>
                                <div
                                  className="dia_col_w_dp4 start_dp4"
                                  style={{ width: "10%" }}
                                >
                                  {e?.totals?.diamonds?.Pcs}
                                </div>
                                <div
                                  className="dia_col_w_dp4 end_dp4"
                                  style={{ width: "15%" }}
                                >
                                  {e?.totals?.diamonds?.Wt?.toFixed(3)}
                                </div>
                                <div className="dia_col_w_dp4 end_dp4">
                                </div>
                                <div className="dia_col_w_dp4 end_dp4">
                                  {formatAmount(e?.totals?.diamonds?.Amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col4_dp4 border-secondary border-end">
                            <div>
                              <div className="d-flex fs_dp4">
                                <div className="dia_col_w_dp4 start_dp4"></div>
                                <div className="dia_col_w_dp4 end_dp4">
                                  {e?.totals?.metal?.Wt?.toFixed(3)}
                                </div>
                                <div className="dia_col_w_dp4 end_dp4">
                                  {e?.totals?.metal?.Wt?.toFixed(3)}
                                </div>
                                <div className="dia_col_w_dp4 end_dp4">
                                  {formatAmount(e?.totals?.metal?.Rate)}
                                </div>
                                <div className="dia_col_w_dp4 end_dp4">
                                  {formatAmount(e?.totals?.metal?.Amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col5_dp4 border-secondary border-end">
                            <div>
                              <div className="d-flex fs_dp4">
                                <div
                                  className="dia_col_w_dp4 start_dp4"
                                  style={{ width: "35%" }}
                                ></div>
                                <div
                                  className="dia_col_w_dp4 end_dp4"
                                  style={{ width: "10%" }}
                                >
                                  {e?.totals?.colorstone?.Pcs}
                                </div>
                                <div
                                  className="dia_col_w_dp4 end_dp4"
                                  style={{ width: "15%" }}
                                >
                                  {e?.totals?.colorstone?.Wt?.toFixed(3)}
                                </div>
                                <div className="dia_col_w_dp4 end_dp4"></div>
                                <div className="dia_col_w_dp4 end_dp4">
                                  {formatAmount(e?.totals?.colorstone?.Amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col6_dp4 border-secondary border-end end_top_dp4 fs_dp4">
                            {formatAmount(
                              e?.OtherCharges +
                                e?.TotalDiamondHandling +
                                e?.MiscAmount
                            )}
                          </div>
                          <div className="col7_dp4 border-secondary border-end">
                            <div className="d-flex fs_dp4">
                              <div className="w-50 end_top_dp4"></div>
                              <div className="w-50 end_top_dp4">
                                {formatAmount(
                                  e?.totals?.makingAmount_settingAmount
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col8_dp4 end_top_dp4 fs_dp4">
                            {formatAmount(e?.TotalAmount + e?.DiscountAmt)}
                          </div>
                        </div>
                        {/* job wise discount */}
                        {e?.DiscountAmt === 0 ? (
                          ""
                        ) : (
                          <div className="d-flex border-secondary border-start border-end border-bottom w-100 bgc_dp4 fw-bold">
                            <div className="col1_dp4 border-secondary border-end center_top_dp4"></div>
                            <div className="col2_dp4 border-secondary border-end">
                              <div className="fw-bold center_dp4 fs_dp4"></div>
                            </div>
                            <div className="col3_dp4 border-secondary border-end">
                              <div>
                                <div className="d-flex fs_dp4">
                                  <div className=".col_w_dp4 start_dp4"></div>
                                  <div className=".col_w_dp4 end_dp4">
                                  </div>
                                  <div className=".col_w_dp4 end_dp4">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col4_dp4 border-secondary border-end">
                              <div>
                                <div className="d-flex fs_dp4">
                                  <div className="w-25 start_dp4"></div>
                                  <div className="w-25 end_dp4">
                                  </div>
                                  <div className="w-25 end_dp4">
                                  </div>
                                  <div className="w-25 end_dp4">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col5_dp4 border-secondary border-end">
                              <div>
                                <div className="d-flex end_dp4">
                                  Discount {e?.Discount} On Amount
                                </div>
                              </div>
                            </div>
                            <div className="col6_dp4 border-secondary border-end end_top_dp4">
                              {/* {formatAmount(
                              e?.OtherCharges +
                                e?.TotalDiamondHandling +
                                e?.MiscAmount
                            )} */}
                            </div>
                            <div className="col7_dp4 border-secondary border-end">
                              <div className="d-flex">
                                <div className="w-50 end_top_dp4"></div>
                                <div className="w-50 end_top_dp4">
                                  {formatAmount(e?.DiscountAmt)}
                                </div>
                              </div>
                            </div>
                            <div className="col8_dp4 end_top_dp4">
                              {formatAmount(e?.TotalAmount)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* tax total */}
                <div className="d-flex justify-content-end align-items-start border border-top-0 border-secondary fs_dp4 py-1">
                  <div style={{ width: "15%" }}>
                    <div className="d-flex lh_dp4">
                      <div className="w-50 end_top_dp4 ">Total Discount</div>
                      <div className="w-50 end_top_dp4">
                        {formatAmount(result?.mainTotal?.total_discount)}
                      </div>
                    </div>
                    {result?.allTaxes?.map((el, ind) => {
                      return (
                        <div className="d-flex lh_dp4" key={ind}>
                          <div className="w-50 end_top_dp4">
                            {el?.name + " @ " + el?.per}
                          </div>
                          <div className="w-50 end_top_dp4">{el?.amount}</div>
                        </div>
                      );
                    })}
                    <div className="d-flex lh_dp4">
                      <div className="w-50 end_top_dp4">Add/Less</div>
                      <div className="w-50 end_top_dp4">
                        {result?.header?.AddLess}
                      </div>
                    </div>
                  </div>
                </div>
                {/* final total */}
                <div className="d-flex border-secondary border-start border-end border-bottom w-100 bgc_dp4 fw-bold">
                  <div className="col1_dp4 border-secondary border-end center_top_dp4"></div>
                  <div className="col2_dp4 border-secondary border-end">
                    <div className="fw-bold center_dp4 fs_dp4">
                      TOTAL
                    </div>
                  </div>
                  <div className="col3_dp4 border-secondary border-end">
                    <div>
                      <div className="d-flex fs_dp4">
                        <div
                          className="dia_col_w_dp4 start_dp4"
                          style={{ width: "35%" }}
                        ></div>
                        <div
                          className="dia_col_w_dp4 start_dp4"
                          style={{ width: "10%" }}
                        >
                          {result?.mainTotal?.diamonds?.Pcs}
                        </div>
                        <div
                          className="dia_col_w_dp4 end_dp4"
                          style={{ width: "15%" }}
                        >
                          {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                        </div>
                        <div className="dia_col_w_dp4 end_dp4">
                        </div>
                        <div className="dia_col_w_dp4 end_dp4">
                          {formatAmount(result?.mainTotal?.diamonds?.Amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col4_dp4 border-secondary border-end">
                    <div>
                      <div className="d-flex fs_dp4">
                        <div className="dia_col_w_dp4 start_dp4"></div>
                        <div className="dia_col_w_dp4 end_dp4">
                        </div>
                        <div className="dia_col_w_dp4 end_dp4">
                          {result?.mainTotal?.metal?.Wt?.toFixed(3)}
                        </div>
                        <div className="dia_col_w_dp4 end_dp4" style={{width:'10%'}}>
                        </div>
                        <div className="dia_col_w_dp4 end_dp4" style={{width:'30%'}}>
                          {formatAmount(result?.mainTotal?.metal?.Amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col5_dp4 border-secondary border-end">
                    <div>
                      <div className="d-flex fs_dp4">
                        <div
                          className="dia_col_w_dp4 start_dp4"
                          style={{ width: "35%" }}
                        ></div>
                        <div
                          className="dia_col_w_dp4 end_dp4"
                          style={{ width: "10%" }}
                        >
                          {result?.mainTotal?.colorstone?.Pcs}
                        </div>
                        <div
                          className="dia_col_w_dp4 end_dp4"
                          style={{ width: "15%" }}
                        >
                          {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                        </div>
                        <div className="dia_col_w_dp4 end_dp4"></div>
                        <div className="dia_col_w_dp4 end_dp4">
                          {formatAmount(result?.mainTotal?.colorstone?.Amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col6_dp4 border-secondary border-end end_top_dp4 fs_dp4">
                    {/* {formatAmount(
                              e?.OtherCharges +
                                e?.TotalDiamondHandling +
                                e?.MiscAmount
                            )} */}
                  </div>
                  <div className="col7_dp4 border-secondary border-end">
                    <div className="d-flex fs_dp4">
                      <div className="w-100 end_top_dp4">
                        {formatAmount(
                          result?.mainTotal?.total_MakingAmount_Setting_Amount
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col8_dp4 end_top_dp4 fs_dp4">
                    {formatAmount(result?.finalAmount)}
                  </div>
                </div>
              </div>
              {/* summary & footer */}
              <div className="d-flex justify-content-between align-items-start fs_dp4 border-bottom">
                <div className="d-flex" style={{ width: "80%" }}>
                  <div
                    className="border-bottom border-secondary"
                    style={{ width: "40%" }}
                  >
                    <div className="summary_dp4_head border-secondary border border-top-0 fw-bold">
                      SUMMARY
                    </div>
                    <div className="d-flex w-100">
                      <div className="w-50">
                        <div className="d-flex justify-content-between">
                          <div className="border-secondary border-start pad_s_dp4 fw-bold">
                            GOLD IN 24KT
                          </div>
                          <div className="border-secondary border-end pad_e_dp4">
                            cts
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="border-secondary border-start pad_s_dp4 fw-bold">
                            GROSS WT
                          </div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {result?.mainTotal?.grosswt?.toFixed(3)} cts
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="border-secondary border-start pad_s_dp4 fw-bold">
                            G+D WT
                          </div>
                          <div className="border-secondary border-end pad_e_dp4">
                            cts
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="border-secondary border-start pad_s_dp4 fw-bold">
                            NET WT
                          </div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {result?.mainTotal?.netwt?.toFixed(3)} cts
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="border-secondary border-start pad_s_dp4 fw-bold">
                            DIAMOND WT
                          </div>
                          <div className="border-secondary border-end pad_e_dp4">
                            { result?.mainTotal?.diamonds?.Pcs } / {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="border-secondary border-start pad_s_dp4 fw-bold">
                            STONE WT
                          </div>
                          <div className="border-secondary border-end pad_e_dp4">
                          { result?.mainTotal?.colorstone?.Pcs } / {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts
                          </div>
                        </div>
                        <div className="summary_dp4_head border-secondary border border-start border-bottom-0"></div>
                      </div>
                      <div className="w-50">
                        <div className="d-flex justify-content-between">
                          <div className="pad_s_dp4 fw-bold">GOLD</div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {formatAmount(result?.mainTotal?.MetalAmount)}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="pad_s_dp4 fw-bold">DIAMOND</div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {formatAmount(result?.mainTotal?.diamonds?.Amount)}{" "}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="pad_s_dp4 fw-bold">CST</div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {formatAmount(
                              result?.mainTotal?.colorstone?.Amount
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="pad_s_dp4 fw-bold">MAKING</div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {formatAmount(
                              result?.mainTotal
                                ?.total_MakingAmount_Setting_Amount
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="pad_s_dp4 fw-bold">OTHER</div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {formatAmount(
                              result?.mainTotal
                                ?.total_otherCharge_Diamond_Handling
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="pad_s_dp4 fw-bold">ADD/LESS</div>
                          <div className="border-secondary border-end pad_e_dp4">
                            {result?.header?.AddLess}
                          </div>
                        </div>
                        <div className="summary_dp4_head d-flex justify-content-between  border-secondary border border-bottom-0 border-start-0 bgc_dp4">
                          <div className="pad_s_dp4 fw-bold">TOTAL</div>
                          <div className="pad_e_dp4">
                            {formatAmount(result?.finalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{width:'20%'}}>
                    <div className="summary_dp4_head border-secondary border border-top-0 fw-bold border-start-0">Diamond Details</div>
                    <div>
                      {
                        Array.from({length:6}, (_,index) => (
                          <div key={index} className="border-end border-secondary">1</div>
                        ))
                      }
                      <div className="d-flex justify-content-between w-100 border-secondary border-end border-bottom border-top">
                        <div className="pad_s_dp4 fw-bold">DIAMOND</div>
                        <div className="pad_e_dp4">{result?.mainTotal?.diamonds?.Pcs} / {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{width:'20%'}}>
                    <div>
                      <div className="summary_dp4_head border-secondary border border-top-0 fw-bold border-start-0">OTHER DETAILS</div>
                      <div>
                      <div className="d-flex justify-content-between w-100 border-secondary border-end border-bottom">
                        <div className="pad_s_dp4 fw-bold">RATE IN 24KT</div>
                        <div className="pad_e_dp4">{formatAmount(result?.header?.MetalRate24K)}</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className="" style={{ width: "20%" }}>
                    <div className="summary_dp4_head border-secondary border border-start-0 border-top-0 border-end-0 fw-bold">
                      Remark
                    </div>
                    <div className="border-secondary border-bottom border-end-0 pad_s_dp4">
                      {result?.header?.PrintRemark}
                    </div>
                  </div>
                </div>
                <div className="check_dp4 border-secondary border border-bottom d-flex justify-content-center align-items-end border-top-0" style={{ width: "20%" }}>
                  <div className="w-50 border-secondary border-end h-100 center_bottom_dp4">Created By</div>
                  <div className="w-50 h-100 center_bottom_dp4">Checked By</div>
                </div>
              </div>
              <div className="fs_dp4">
                ** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US
                IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF
                TRANSACTIONS
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

export default DetailPrint4;
