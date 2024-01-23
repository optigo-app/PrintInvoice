import React, { useEffect, useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/jewelleryTaxInvoice.module.css";
import style1 from "../../assets/css/prints/jewelleryTaxInvoice.module.css";
import style2 from "../../assets/css/headers/header1.module.css";

const JewelleryTaxInvoice = ({ urls, token, invoiceNo, printName, evn }) => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const [tax, settax] = useState([]);
  const [memo, setMemo] = useState(atob(evn)?.toLowerCase() === "memo" ? true : false);
  const [estimate, setEstimate] = useState(atob(evn)?.toLowerCase() === "product estimate" ? true : false);
  const [summary, setSummary] = useState([]);
  const [totalAmount, settotalAmount] = useState({
    before: 0,
    after: 0,
    grand: 0,
  });
  const [json0Data, setJson0Data] = useState({});
  const [customerDetail, setCustomerDetail] = useState({
    pan: "",
    gst: "",
  });

  const [msg, setMsg] = useState("");


  const [evns, setEvns] = useState(atob(evn).toLowerCase());

  const loadData = (data) => {
    let json0Datas = data.BillPrint_Json[0];
    let custDetail = { ...customerDetail };
    if (data.BillPrint_Json[0]?.vat_cst_pan !== "") {
      let custpanGstArr = data.BillPrint_Json[0]?.vat_cst_pan.split("|");
      let custpans = custpanGstArr[1] ? custpanGstArr[1].split("-") : "";
      let custGst = custpanGstArr[0] ? custpanGstArr[0].split("-") : "";
      custDetail.pan = custpans[1] ? custpans[1] : "";
      custDetail.gst = custGst[1] ? custGst[1] : "";
      setCustomerDetail(custDetail);
    }
    setJson0Data(json0Datas);
    let resultArr = [];
    let totalAmountBefore = 0;
    let metalArr = [];
    let diamondWt = 0;
    let colorStoneWt = 0;
    let miscWt = 0;
    let grossWt = 0;
    data?.BillPrint_Json1.forEach((e, i) => {
      let findRecord = metalArr.findIndex(
        (elem) => elem?.label === e?.MetalTypePurity
      );
      if (findRecord === -1) {
        metalArr.push({ label: e?.MetalTypePurity, value: e?.NetWt, gm: true });
      } else {
        metalArr[findRecord].value += e?.NetWt;
      }
      grossWt += e?.grosswt;
      let diamondWts = 0;
      let colorStoneWts = 0;
      let miscWts = 0;
      let obj = { ...e };
      let miscWt = 0;
      let materials = [];
      totalAmountBefore +=
        e?.TotalAmount / data?.BillPrint_Json[0].CurrencyExchRate;
      let metalColorCode = "";
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (obj?.SrJobno === ele?.StockBarcode) {
          // if ((ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2 || ele?.MasterManagement_DiamondStoneTypeid === 3) && ele?.IsHSCOE === 0) {
          if (
            (ele?.MasterManagement_DiamondStoneTypeid === 1 ||
              ele?.MasterManagement_DiamondStoneTypeid === 2 ||
              ele?.MasterManagement_DiamondStoneTypeid === 3) &&
            ele?.IsHSCOE === 0
          ) {
            let findRecord = materials.findIndex(
              (elem) =>
                elem?.MasterManagement_DiamondStoneTypeid ===
                ele?.MasterManagement_DiamondStoneTypeid &&
                elem?.ShapeName === ele?.ShapeName &&
                elem?.Colorname === ele?.Colorname &&
                elem?.QualityName === ele?.QualityName &&
                elem?.Rate === ele?.Rate
            );
            if (findRecord === -1) {
              materials.push(ele);
            } else {
              materials[findRecord].Pcs += ele?.Pcs;
              materials[findRecord].Wt += ele?.Wt;
              materials[findRecord].Amount += ele?.Amount;
            }
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              diamondWt += ele?.Wt;
              diamondWts += ele?.Wt;
            }
            if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              colorStoneWt += ele?.Wt;
              colorStoneWts += ele?.Wt;
            }
            if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
              miscWt += ele?.Wt;
              miscWts += ele?.Wt;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            if (ele?.IsPrimaryMetal === 1) {
              metalColorCode = ele?.MetalColorCode;
            } else if (metalColorCode === "") {
              metalColorCode = ele?.MetalColorCode;
            }
          }
        }
      });
      obj.TotalAmount =
        obj.TotalAmount / data?.BillPrint_Json[0].CurrencyExchRate;
      obj.diamondWts = diamondWts;
      obj.colorStoneWts = colorStoneWts;
      obj.miscWts = miscWts;
      obj.materials = materials;
      obj.metalColorCode = metalColorCode;
      obj.miscWt = miscWt;
      resultArr.push(obj);
    });
    metalArr.push({ label: "Diamond Wt", value: diamondWt, gm: false });
    metalArr.push({ label: "Stone Wt", value: colorStoneWt, gm: false });
    // metalArr.push({label: "Misc Wt", value: diamondWt, gm: false});
    if (!estimate) {
      // metalArr.push({ label: "Gross Wt", value: grossWt, gm: true });
    }
    setSummary(metalArr);
    let taxValue = taxGenrator(json0Datas, totalAmountBefore);
    let afterTotal =
      taxValue.reduce((accumulator, currentValue) => {
        return accumulator + +currentValue.amount;
      }, 0) + totalAmountBefore;
    let grandTotal = afterTotal + json0Datas.AddLess;
    let totalAmounts = {
      before: totalAmountBefore,
      after: afterTotal,
      grand: grandTotal,
    };
    settotalAmount(totalAmounts);
    settax(taxValue);
    setData(resultArr);
  };


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
  }, []);
  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <>
      <div className={`container max_width_container pad_60_allPrint ${style?.containerJewellery} jewelleryinvoiceContain`} >
        {/* buttons */}
        <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
          <div className="form-check ps-3">
            <input
              type="button"
              className="btn_white blue py-1"
              value="Print"
              onClick={(e) => handlePrint(e)}
            />
          </div>
        </div>
        {/* header */}
        {json0Data?.IsBranchWiseAddress === 1 ? (
          <div className="d-flex justify-content-between p-2">
            <div>
              <div
                dangerouslySetInnerHTML={{ __html: json0Data?.Branch_Address }}
              ></div>
            </div>
            <div>
              <img
                src={json0Data?.PrintLogo}
                alt=""
                className={`${style?.image}`}
              />
            </div>
          </div>
        ) : (
          <div className={`${style2.companyDetails}`}>
            <div className={`${style2.companyhead} p-2`}>
              <p className={style2.lines} style21={{ fontWeight: "bold" }}>
                {json0Data?.CompanyFullName}
              </p>
              <p className={style2.lines}>{json0Data?.CompanyAddress}</p>
              <p className={style2.lines}>{json0Data?.CompanyAddress2}</p>
              <p className={style2.lines}>
                {json0Data?.CompanyCity}-{json0Data?.CompanyPinCode},
                {json0Data?.CompanyState}({json0Data?.CompanyCountry})
              </p>
              <p className={style2.lines}>
                Tell No: {json0Data?.CompanyTellNo}
              </p>
              <p className={style2.lines}>
                {json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}
              </p>
              <p className={style2.lines}>
                {json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}
                -{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}
              </p>
            </div>
            <div
              style={{ width: "30%" }}
              className="d-flex justify-content-end align-item-center h-100"
            >
              <img
                src={json0Data?.PrintLogo}
                alt=""
                className={style2.headerImg}
              />
            </div>
          </div>
        )}
        {/* sub header */}
        <div className="mt-2 no_break">
          <div className="border d-flex justify-content-between">
            <div className="col-6 p-2">
              <p className="lh-1 pb-1">To, </p>
              {json0Data?.customerfirmname !== "" && (
                <p className="fw-bold lh-1 pb-1">
                  {json0Data?.customerfirmname}
                </p>
              )}
              {json0Data?.customerstreet !== "" && (
                <p className="lh-1 pb-1">{json0Data?.customerstreet}</p>
              )}
              {json0Data?.customerregion !== "" && (
                <p className="lh-1 pb-1">{json0Data?.customerregion}</p>
              )}
              {json0Data?.customercity !== "" && (
                <p className="lh-1 pb-1">{json0Data?.customercity}</p>
              )}
              <p className="lh-1 pb-1">
                {json0Data?.customerstate}, {json0Data?.customercountry}{" "}
                {json0Data?.customerpincode}
              </p>
              {json0Data?.customermobileno !== "" && (
                <p className="lh-1 pb-1">Tel : {json0Data?.customermobileno}</p>
              )}
              <p className="lh-1 pb-1">{json0Data?.customeremail1}</p>
            </div>
            <div className="col-5 px-2 py-3">
              <p className="lh-1 pb-1">
                {evns === "memo" && "Memo "} Invoice
                <span className="fw-bold">#: {json0Data?.InvoiceNo}</span> Dated{" "}
                <span className="fw-bold">{json0Data?.EntryDate}</span>
              </p>
              {customerDetail?.pan !== "" && (
                <p className="lh-1 pb-1">
                  PAN<span className="fw-bold">#: {customerDetail?.pan}</span>{" "}
                </p>
              )}
              {customerDetail?.gst !== "" && (
                <p className="lh-1 pb-1">
                  GSTIN <span className="fw-bold">{customerDetail?.gst} </span>
                  {json0Data?.Cust_CST_STATE !== "" &&
                    json0Data?.Cust_CST_STATE_No !== "" && (
                      <>
                        | {json0Data?.Cust_CST_STATE}{" "}
                        <span className="fw-bold">
                          {json0Data?.Cust_CST_STATE_No}
                        </span>
                      </>
                    )}{" "}
                </p>
              )}
              {evns !== "memo" && (
                <p className="lh-1 pb-1">
                  Due Date:{" "}
                  <span className="fw-bold">{json0Data?.DueDate}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        {/* table header */}
        <div className="d-flex border lightGrey no_break">
          <div className="col-1 p-1 border-end">
            <p className="fw-bold text-center">SR NO</p>
          </div>
          <div className="col-2 p-1 border-end">
            <p className="fw-bold text-center">ITEM CODE</p>
          </div>
          <div className="col-5 p-1 border-end">
            <p className="fw-bold text-center">DESCRIPTION</p>
          </div>
          <div className="col-2 p-1 border-end">
            <p className="fw-bold text-center">IMAGE</p>
          </div>
          <div className="col-2 p-1">
            <p className="fw-bold text-center">
              AMOUNT ({json0Data?.CurrencyCode})
            </p>
          </div>
        </div>
        {/* table data */}
        {data.length > 0 &&
          data.map((e, i) => {
            return (
              <div
                className="d-flex border-start border-end border-bottom no_break"
                key={i}
              >
                <div className="col-1 p-1 border-end">
                  <p className="text-center">{i + 1}</p>
                </div>
                <div className="col-2 p-1 border-end">
                  <p>Job: {e?.SrJobno} </p>
                  <p>
                    Design: <span className="fw-bold">{e?.designno}</span>{" "}
                  </p>
                  <p className="fw-bold">{e?.Size}</p>
                </div>
                <div className="col-5 p-1 border-end">
                  <p>
                    {e?.MetalTypePurity} {e?.metalColorCode} |{" "}
                    {NumberWithCommas(e?.grosswt, 3)} gms GW |{" "}
                    {NumberWithCommas(e?.NetWt, 3)} gms NW
                    {e?.diamondWts !== 0 && (
                      <> | {memo && "Dia: "} {NumberWithCommas(e?.diamondWts, 3)} Cts</>
                    )}
                    {e?.colorStoneWts !== 0 && (
                      <> | {memo && "CS: "} {NumberWithCommas(e?.colorStoneWts, 3)} Cts</>
                    )}
                    {e?.miscWts !== 0 && (
                      <> | {memo && "MISC: "} {NumberWithCommas(e?.miscWts, 3)} gms</>
                    )}
                  </p>
                  {e?.JobRemark !== "" && (
                    <div>
                      <p className="text-decoration-underline fw-bold">
                        REMARKS{" "}
                      </p>
                      <p>{e?.JobRemark}</p>
                    </div>
                  )}
                  {e.materials.length > 0 &&
                    e.materials.map((ele, ind) => {
                      return (
                        <p key={ind}>
                          {ele?.IsCenterStone === 1 ? (
                            "Center stone"
                          ) : (
                            <>
                              {ele?.MasterManagement_DiamondStoneTypeid === 1 &&
                                "Diamond"}
                              {ele?.MasterManagement_DiamondStoneTypeid === 2 &&
                                "Colorstone"}
                              {ele?.MasterManagement_DiamondStoneTypeid === 3 &&
                                "Misc"}
                            </>
                          )}
                          : {NumberWithCommas(ele?.Pcs, 0)} Pcs | {NumberWithCommas(ele?.Wt, 3)} {ele?.MasterManagement_DiamondStoneTypeid === 3 ? "gms" : "Cts"} | {ele?.ShapeName}{ele?.MasterManagement_DiamondStoneTypeid !== 3 && <> {" "} {ele?.Colorname} {ele?.QualityName}</>}
                        </p>
                      );
                    })}
                </div>
                <div className="col-2 p-1 border-end d-flex justify-content-center align-items-center">
                  <img
                    src={e?.DesignImage}
                    alt=""
                    className={`d-block mx-auto ${style?.image} w-100`}
                    onError={handleImageError}
                  />
                </div>
                <div className="col-2 p-1">
                  <p className="text-end">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: json0Data?.Currencysymbol,
                      }}
                    ></span>
                    {NumberWithCommas(e?.TotalAmount, 2)}{" "}
                  </p>
                </div>
              </div>
            );
          })}
        {/* total */}
        <div className="d-flex border-start border-end border-bottom no_break lightGrey">
          <div className="col-1 p-1 border-end">
            <p className="text-center"></p>
          </div>
          <div className="col-9 p-1 border-end">
            <p className="fw-bold">Total</p>{" "}
          </div>
          <div className="col-2 p-1">
            <p className="text-end fw-bold">
              <span
                dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}
              ></span>
              {NumberWithCommas(totalAmount.before, 2)}{" "}
            </p>
          </div>
        </div>
        {/* Remakrs */}
        <div className="d-flex border-start border-end border-bottom no_break">
          <div className="col-4 p-1 border-end">
            <p className="fw-bold text-decoration-underline"> REMARKS</p>
            <div
              dangerouslySetInnerHTML={{ __html: json0Data?.PrintRemark }}
            ></div>
          </div>
          <div className="col-4 p-1 border-end">
            {summary.map((e, i) => {
              return (
                <div className="d-flex justify-content-between" key={i}>
                  <p key={i}>{e?.label}: </p>
                  <p>
                    {NumberWithCommas(e?.value, 3)} {e?.gm ? "gm" : "cts"}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="col-2 p-1 border-end">
            {tax.map((e, i) => {
              return (
                <p key={i}>
                  {e?.name} @ {e?.per}
                </p>
              );
            })}
            <p>Total</p>
            {json0Data?.AddLess > 0 ? <p>Add</p> : <p>Less</p>}
          </div>
          <div className="col-2 p-1">
            {tax.map((e, i) => {
              return (
                <p className="text-end fw-bold" key={i}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: json0Data?.Currencysymbol,
                    }}
                  ></span>
                  {NumberWithCommas(+e?.amount, 2)}{" "}
                </p>
              );
            })}
            <p className="text-end fw-bold">
              <span
                dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}
              ></span>
              {NumberWithCommas(totalAmount.after, 2)}{" "}
            </p>
            <p className="text-end fw-bold">
              <span
                dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}
              ></span>
              {NumberWithCommas(json0Data?.AddLess, 2)}{" "}
            </p>
          </div>
        </div>
        {/* gran total */}
        <div className="d-flex border-start border-end border-bottom no_break lightGrey">
          <div className="col-8 p-1"></div>
          <div className="col-2 p-1">
            <p className="fw-bold">GRAND TOTAL</p>{" "}
          </div>
          <div className="col-2 p-1">
            <p className="text-end fw-bold">
              <span
                dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}
              ></span>
              {NumberWithCommas(totalAmount.grand, 2)}{" "}
            </p>
          </div>
        </div>
        {/* computer generated */}
        <p className={`py-2 ${style.generated} no_break text-secondary`}>
          ** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US
          IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF
          TRANSACTIONS{" "}
        </p>
        {/* remark */}
        <div className="border px-2 no_break">
          <div
            dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }}
          ></div>
        </div>
        {/* bank detail */}
        <div className="border-start border-end border-bottom d-flex no_break">
          <div className="col-6 border-end p-2">
            <p className="fw-bold">Bank Detail</p>
            <p>Bank Name: {json0Data?.bankname}</p>
            <p>Branch: {json0Data?.bankaddress}</p>
            <p>Account Name: {json0Data?.accountname}</p>
            <p>Account No. : {json0Data?.accountnumber}</p>
            <p>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
          </div>
          <div className="col-3 border-end d-flex flex-column justify-content-between p-2">
            <p>Signature</p>
            <p className="fw-bold">{json0Data?.customerfirmname}</p>
          </div>
          <div className="col-3 d-flex flex-column justify-content-between p-2">
            <p>Signature</p>
            <p className="fw-bold">{json0Data?.CompanyFullName}</p>
          </div>
        </div>
      </div>
    </>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default JewelleryTaxInvoice;
